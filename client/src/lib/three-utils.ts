import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

export function initializeScene(container: HTMLElement): SceneSetup {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);
  scene.fog = new THREE.Fog(0x1a1a1a, 50, 200);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 3, 8);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.0;


  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.target.set(0, 1, 0);
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  return { scene, camera, renderer, controls };
}

export function createLighting(scene: THREE.Scene): void {
  // Bright ambient light for baked textures - reduced intensity
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  // Soft directional light to enhance details without overpowering baked lighting
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = false; // Disable shadows for baked lighting
  scene.add(directionalLight);

  // Fill light from the opposite side
  const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
  fillLight.position.set(-5, 10, -5);
  scene.add(fillLight);

  // Additional overhead lighting to simulate office ceiling lights
  const overheadLight1 = new THREE.PointLight(0xffffff, 1.5, 15);
  overheadLight1.position.set(0, 8, 0);
  scene.add(overheadLight1);

  const overheadLight2 = new THREE.PointLight(0xffffff, 1.2, 12);
  overheadLight2.position.set(-3, 6, -3);
  scene.add(overheadLight2);

  const overheadLight3 = new THREE.PointLight(0xffffff, 1.2, 12);
  overheadLight3.position.set(3, 6, 3);
  scene.add(overheadLight3);

  // Warm accent lights to simulate desk lamps
  const deskLight = new THREE.PointLight(0xfff4e6, 0.8, 8);
  deskLight.position.set(1, 3, -2);
  scene.add(deskLight);
}

export function handleResize(
  camera: THREE.PerspectiveCamera, 
  renderer: THREE.WebGLRenderer
): void {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

export function createEnvironmentMap(scene: THREE.Scene): THREE.CubeTexture {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    '/textures/sky.png', // positive x
    '/textures/sky.png', // negative x
    '/textures/sky.png', // positive y
    '/textures/sky.png', // negative y
    '/textures/sky.png', // positive z
    '/textures/sky.png', // negative z
  ]);
  
  scene.environment = texture;
  return texture;
}

export function optimizeModel(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Optimize geometry
      if (child.geometry) {
        child.geometry.computeBoundingSphere();
        child.geometry.computeVertexNormals();
      }
      
      // Optimize materials
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(material => {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.needsUpdate = true;
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.needsUpdate = true;
        }
      }
    }
  });
}
