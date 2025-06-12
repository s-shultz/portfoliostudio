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
  renderer.toneMappingExposure = 2.2; // Much higher exposure for very bright appearance


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
  // Very bright ambient light for natural office lighting
  const ambientLight = new THREE.AmbientLight(0xf0f8ff, 2.0); // Much brighter ambient
  scene.add(ambientLight);

  // Strong window light streaming in from outside - brighter and lower
  const windowLight1 = new THREE.DirectionalLight(0xfff5d6, 2.5); // Much brighter warm sunlight
  windowLight1.position.set(10, 4, 0); // Lower position, coming from the side window
  windowLight1.target.position.set(0, 0, 0);
  scene.add(windowLight1);
  scene.add(windowLight1.target);

  // Additional window light from another angle - brighter and lower
  const windowLight2 = new THREE.DirectionalLight(0xfff8e1, 2.0); // Brighter warm daylight
  windowLight2.position.set(6, 5, -8); // Lower position, coming from back window
  windowLight2.target.position.set(0, 0, 0);
  scene.add(windowLight2);
  scene.add(windowLight2.target);

  // Soft bounced light for realistic fill
  const bouncedLight = new THREE.DirectionalLight(0xe8f4f8, 0.4); // Cool fill light
  bouncedLight.position.set(-6, 6, 4);
  scene.add(bouncedLight);

  // Overhead office lighting (reduced to let window light dominate)
  const ceilingLight1 = new THREE.PointLight(0xffffff, 1.2, 20);
  ceilingLight1.position.set(0, 10, 0);
  scene.add(ceilingLight1);

  const ceilingLight2 = new THREE.PointLight(0xffffff, 0.8, 18);
  ceilingLight2.position.set(-4, 9, -4);
  scene.add(ceilingLight2);

  const ceilingLight3 = new THREE.PointLight(0xffffff, 0.8, 18);
  ceilingLight3.position.set(4, 9, 4);
  scene.add(ceilingLight3);

  // Window-adjacent spot lights to simulate focused light spill - brighter and lower
  const windowSpill1 = new THREE.SpotLight(0xfff8e1, 4.0, 20, Math.PI / 3, 0.1);
  windowSpill1.position.set(8, 3, 0); // Much lower position
  windowSpill1.target.position.set(0, 0, 0);
  scene.add(windowSpill1);
  scene.add(windowSpill1.target);

  const windowSpill2 = new THREE.SpotLight(0xfff5d6, 3.5, 18, Math.PI / 3, 0.1);
  windowSpill2.position.set(0, 3, -8); // Much lower position
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
