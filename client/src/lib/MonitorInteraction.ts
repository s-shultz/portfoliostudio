import * as THREE from "three";

export type MonitorType = "uiux" | "coding" | "3d";

interface ClickableMonitor {
  mesh: THREE.Object3D;
  type: MonitorType;
  id: string;
}

export class MonitorInteraction {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private monitors: ClickableMonitor[] = [];
  private onMonitorClick?: (type: MonitorType) => void;
  private hoveredMonitor: ClickableMonitor | null = null;

  constructor(camera: THREE.Camera) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
  }

  setClickHandler(handler: (type: MonitorType) => void) {
    this.onMonitorClick = handler;
  }

  addMonitor(mesh: THREE.Object3D, type: MonitorType, id: string) {
    // Store original scale for hover effects
    (mesh as any).originalScale = mesh.scale.clone();
    this.monitors.push({ mesh, type, id });
  }

  handleClick(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Find intersections with monitor meshes
    const meshes = this.monitors.map(m => m.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      
      // Find which monitor was clicked
      for (const monitor of this.monitors) {
        if (this.isDescendantOf(clickedObject, monitor.mesh)) {
          console.log(`Clicked on ${monitor.type} monitor`);
          this.onMonitorClick?.(monitor.type);
          break;
        }
      }
    }
  }

  private isDescendantOf(child: THREE.Object3D, parent: THREE.Object3D): boolean {
    let current = child;
    while (current) {
      if (current === parent) return true;
      current = current.parent!;
    }
    return false;
  }

  // Handle mouse hover for monitor scaling effects
  handleHover(event: MouseEvent, container: HTMLElement) {
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Find intersections with monitor meshes
    const meshes = this.monitors.map(m => m.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    let hoveredMonitor: ClickableMonitor | null = null;

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      
      // Find which monitor is being hovered
      for (const monitor of this.monitors) {
        if (this.isDescendantOf(hoveredObject, monitor.mesh)) {
          hoveredMonitor = monitor;
          break;
        }
      }
    }

    // Handle hover state changes
    if (this.hoveredMonitor !== hoveredMonitor) {
      // Reset previous hovered monitor
      if (this.hoveredMonitor) {
        const originalScale = (this.hoveredMonitor.mesh as any).originalScale;
        this.hoveredMonitor.mesh.scale.copy(originalScale);
        container.style.cursor = 'grab';
      }

      // Set new hovered monitor
      this.hoveredMonitor = hoveredMonitor;
      
      if (this.hoveredMonitor) {
        const originalScale = (this.hoveredMonitor.mesh as any).originalScale;
        this.hoveredMonitor.mesh.scale.copy(originalScale.clone().multiplyScalar(1.1));
        container.style.cursor = 'pointer';
      }
    }
  }
}