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
  camera.position.set(10, 0, 9); // Moved back and more to the right for better view

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
  controls.target.set(-2, 0, 2); // Focus on desk area
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;

  return { scene, camera, renderer, controls };
}

export function createLighting(scene: THREE.Scene): void {
  // Brighter ambient light for better overall illumination
  const ambientLight = new THREE.AmbientLight(0xf8fbff, 1.2);
  scene.add(ambientLight);

  // Repositioned window lights to avoid hitting screens directly
  const windowLight1 = new THREE.DirectionalLight(0xfff5d6, 1.2);
  windowLight1.position.set(15, 6, -5); // Moved further right and back
  windowLight1.target.position.set(0, 0, -5); // Target away from screens
  scene.add(windowLight1);
  scene.add(windowLight1.target);

  // Back lighting for general illumination
  const windowLight2 = new THREE.DirectionalLight(0xfff8e1, 1.0);
  windowLight2.position.set(2, 8, -12); // Positioned behind and above
  windowLight2.target.position.set(0, 0, -8); // Target away from screen area
  scene.add(windowLight2);
  scene.add(windowLight2.target);

  // Gentle fill light from opposite side
  const bouncedLight = new THREE.DirectionalLight(0xe8f4f8, 0.3);
  bouncedLight.position.set(-12, 6, 6); // Moved further left
  bouncedLight.target.position.set(-2, 0, 0);
  scene.add(bouncedLight);

  // Overhead point lights aligned with office model ceiling fixtures
  const ceilingLight1 = new THREE.PointLight(0xffffff, 2.0, 20);
  ceilingLight1.position.set(-3, 3.5, 0); // Aligned with first office ceiling light
  ceilingLight1.castShadow = true;
  scene.add(ceilingLight1);

  const ceilingLight2 = new THREE.PointLight(0xffffff, 2.0, 20);
  ceilingLight2.position.set(-6, 3.5, 3); // Aligned with second office ceiling light
  ceilingLight2.castShadow = true;
  scene.add(ceilingLight2);

  const ceilingLight3 = new THREE.PointLight(0xffffff, 1.8, 18);
  ceilingLight3.position.set(-9, 3.5, 6); // Aligned with third office ceiling light
  ceilingLight3.castShadow = true;
  scene.add(ceilingLight3);

  const ceilingLight4 = new THREE.PointLight(0xffffff, 1.5, 16);
  ceilingLight4.position.set(0, 3.5, -3); // Additional light for desk area
  ceilingLight4.castShadow = true;
  scene.add(ceilingLight4);

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
