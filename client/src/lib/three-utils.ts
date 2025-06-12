import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

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
  // Ambient light for general illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  // Main directional light (key light)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(10, 20, 10);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  
  // Shadow camera settings
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -20;
  directionalLight.shadow.camera.right = 20;
  directionalLight.shadow.camera.top = 20;
  directionalLight.shadow.camera.bottom = -20;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.bias = -0.0001;

  scene.add(directionalLight);
  scene.add(directionalLight.target);

  // Fill light (opposite side)
  const fillLight = new THREE.DirectionalLight(0x8899ff, 0.4);
  fillLight.position.set(-10, 15, -5);
  scene.add(fillLight);

  // Rim light (from behind)
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, 10, -20);
  scene.add(rimLight);

  // Point lights for accent lighting
  const pointLight1 = new THREE.PointLight(0xff9500, 0.8, 20);
  pointLight1.position.set(-8, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x0099ff, 0.6, 15);
  pointLight2.position.set(8, 3, -5);
  scene.add(pointLight2);
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
