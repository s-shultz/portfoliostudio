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

  constructor(camera: THREE.Camera) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.camera = camera;
  }

  setClickHandler(handler: (type: MonitorType) => void) {
    this.onMonitorClick = handler;
  }

  addMonitor(mesh: THREE.Object3D, type: MonitorType, id: string) {
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

  // Create visible clickable areas for monitor screens
  createClickableArea(position: THREE.Vector3, size: THREE.Vector2, rotation: THREE.Euler): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(size.x, size.y);
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0.15,
      color: 0x4444ff,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotation.copy(rotation);
    
    // Add pulsing animation
    const originalOpacity = 0.15;
    let time = 0;
    const animate = () => {
      time += 0.02;
      material.opacity = originalOpacity + Math.sin(time) * 0.1;
      requestAnimationFrame(animate);
    };
    animate();
    
    // Add bright border for visibility
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.8,
      linewidth: 3
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    wireframe.position.copy(position);
    wireframe.rotation.copy(rotation);
    mesh.add(wireframe);
    
    return mesh;
  }
}