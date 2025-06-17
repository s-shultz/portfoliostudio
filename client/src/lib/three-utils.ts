import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

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
  camera.position.set(-8, 2, 3); // Positioned to look at the desk/window area

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
  renderer.toneMappingExposure = 1.7; // Balanced exposure for natural brightness


  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.maxPolarAngle = Math.PI / 2.2;
  controls.target.set(-2, 0, 2); // Focus on desk/window area
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  return { scene, camera, renderer, controls };
}

export function createLighting(scene: THREE.Scene): void {
  // Soft ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0xf0f8ff, 0.6);
  scene.add(ambientLight);

  // Overhead ceiling lights positioned to match office model
  const officeLight1 = new THREE.PointLight(0xffffff, 1.8, 20);
  officeLight1.position.set(-3, 3, 0); // First overhead light
  officeLight1.castShadow = true;
  officeLight1.shadow.mapSize.width = 1024;
  officeLight1.shadow.mapSize.height = 1024;
  scene.add(officeLight1);

  const officeLight2 = new THREE.PointLight(0xffffff, 1.8, 20);
  officeLight2.position.set(-6, 3, 3); // Second overhead light near desk
  officeLight2.castShadow = true;
  officeLight2.shadow.mapSize.width = 1024;
  officeLight2.shadow.mapSize.height = 1024;
  scene.add(officeLight2);

  const officeLight3 = new THREE.PointLight(0xffffff, 1.5, 18);
  officeLight3.position.set(-9, 3, 6); // Third overhead light
  officeLight3.castShadow = true;
  scene.add(officeLight3);

  // Window light for natural illumination
  const windowLight = new THREE.DirectionalLight(0xfff8e1, 1.2);
  windowLight.position.set(-15, 5, 10); // Coming from window direction
  windowLight.target.position.set(-5, 0, 5); // Target desk area
  windowLight.castShadow = true;
  windowLight.shadow.mapSize.width = 2048;
  windowLight.shadow.mapSize.height = 2048;
  scene.add(windowLight);
  scene.add(windowLight.target);

  // Gentle fill light from opposite side
  const bouncedLight = new THREE.DirectionalLight(0xe8f4f8, 0.3);
  bouncedLight.position.set(-12, 6, 6); // Moved further left
  bouncedLight.target.position.set(-2, 0, 0);
  scene.add(bouncedLight);

  // Reduced overhead lighting
  const ceilingLight1 = new THREE.PointLight(0xffffff, 0.8, 15);
  ceilingLight1.position.set(2, 10, -2); // Moved away from screen area
  scene.add(ceilingLight1);

  const ceilingLight2 = new THREE.PointLight(0xffffff, 0.6, 12);
  ceilingLight2.position.set(-2, 9, -6); // Positioned behind screens
  scene.add(ceilingLight2);

  const ceilingLight3 = new THREE.PointLight(0xffffff, 0.8, 18);
  ceilingLight3.position.set(4, 9, 4);
  scene.add(ceilingLight3);

  // Window-adjacent spot lights to simulate focused light spill - balanced intensity
  const windowSpill1 = new THREE.SpotLight(0xfff8e1, 2.8, 20, Math.PI / 3, 0.1);
  windowSpill1.position.set(8, 3, 0); // Lower position
  windowSpill1.target.position.set(0, 0, 0);
  scene.add(windowSpill1);
  scene.add(windowSpill1.target);

  const windowSpill2 = new THREE.SpotLight(0xfff5d6, 2.5, 18, Math.PI / 3, 0.1);
  windowSpill2.position.set(0, 3, -8); // Lower position
  windowSpill2.target.position.set(0, 0, 0);
  scene.add(windowSpill2);
  scene.add(windowSpill2.target);

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
