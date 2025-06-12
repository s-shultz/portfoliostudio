import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initializeScene, createLighting, handleResize } from "../lib/three-utils";
import { ModelLoader } from "../lib/ModelLoader";

interface Scene3DProps {
  onLoaded: () => void;
  onError: (error: string) => void;
}

// Load office model with robust ModelLoader system
async function loadOfficeModel(modelLoader: ModelLoader, scene: THREE.Scene) {
  try {
    // Define texture configuration for your office model
    const texturesConfig = {};

    // Load your actual FBX office model
    const modelData = await modelLoader.loadSmallOfficeModel(
      '/models/SmallOffice.fbx',
      texturesConfig
    );

    // Position and scale the loaded model
    const model = modelData.model;
    model.position.set(0, -2, 0);
    model.scale.setScalar(0.03);
    model.rotation.y = Math.PI;

    console.log('FBX office model loaded successfully');
    console.log('Available objects:', modelLoader.getObjectNames(model));
    console.log('Model position:', model.position);
    console.log('Model scale:', model.scale);

    // Load and position monitors on the desk
    await loadMonitors(modelLoader, scene);

  } catch (error) {
    console.error('Failed to load FBX office model:', error);
    
    // Don't fall back to procedural environment - indicate loading failure
    throw error;
  }
}

// Load monitor models and position them on the desk
async function loadMonitors(modelLoader: ModelLoader, scene: THREE.Scene) {
  try {
    console.log('Loading monitor models...');
    
    // Load the first monitor
    const monitor1Data = await modelLoader.loadGLTF('/models/monitors.glb');
    console.log('Monitor GLB data loaded:', monitor1Data);
    
    const monitor1 = monitor1Data.scene.clone();
    console.log('Monitor 1 children count:', monitor1.children.length);
    
    // Traverse the monitor to see its structure
    monitor1.traverse((child) => {
      console.log('Monitor child:', child.type, child.name);
      if ((child as THREE.Mesh).isMesh) {
        console.log('  - Mesh found:', child.name);
      }
    });
    
    // Create 3 monitors in a row on the desk
    const monitorScale = 5.3; // Reduced by a third from 8.0
    const monitorY = -1.8; // Lower position on desk
    
    // First monitor (left)
    monitor1.position.set(-1.5, monitorY, -0.5);
    monitor1.scale.setScalar(monitorScale);
    monitor1.rotation.x = -Math.PI * 0.1; // Tilt screens down to face camera
    monitor1.rotation.y = Math.PI * 0.7; // Face towards camera
    scene.add(monitor1);
    
    // Load second monitor (center)
    const monitor2Data = await modelLoader.loadGLTF('/models/monitors.glb');
    const monitor2 = monitor2Data.scene.clone();
    monitor2.position.set(-0.8, monitorY, -0.4);
    monitor2.scale.setScalar(monitorScale);
    monitor2.rotation.x = -Math.PI * 0.08; // Slight tilt down to face camera
    monitor2.rotation.y = Math.PI * 0.75; // Face towards camera
    scene.add(monitor2);
    
    // Load third monitor (right)
    const monitor3Data = await modelLoader.loadGLTF('/models/monitors.glb');
    const monitor3 = monitor3Data.scene.clone();
    monitor3.position.set(-0.1, monitorY, -0.3);
    monitor3.scale.setScalar(monitorScale);
    monitor3.rotation.x = -Math.PI * 0.06; // Slight tilt down for rightmost monitor
    monitor3.rotation.y = Math.PI * 0.8; // Face towards camera
    scene.add(monitor3);
    
    console.log('Monitor 2 positioned at:', monitor2.position);
    console.log('Monitor 2 scale:', monitor2.scale);
    
    console.log('Monitors loaded and positioned successfully');
    
  } catch (error) {
    console.error('Failed to load monitor models:', error);
    // Don't throw - monitors are optional, office should still work without them
  }
}

// Enhanced procedural environment using ModelLoader for textures
async function createEnhancedOfficeEnvironment(scene: THREE.Scene, modelLoader: ModelLoader) {
  try {
    // Load textures using ModelLoader's robust system
    const floorTexture = await modelLoader.loadTexture('/textures/Floorbaked.png');
    const wallTexture = await modelLoader.loadTexture('/textures/BakedWall.png');
    const wallNormal = await modelLoader.loadTexture('/textures/BakedWallNormal.png');
    const deskTexture = await modelLoader.loadTexture('/textures/DeskPainting.jpg');
    const chairTexture = await modelLoader.loadTexture('/textures/ChairBaked.png');
    const cupboardTexture = await modelLoader.loadTexture('/textures/CupboardBaked.png');
    const roofTexture = await modelLoader.loadTexture('/textures/RoofBaked.png');
    const painting1 = await modelLoader.loadTexture('/textures/Painting1.jpg');
    const painting2 = await modelLoader.loadTexture('/textures/Painting2.jpg');
    const painting3 = await modelLoader.loadTexture('/textures/Painting3.jpg');
    const backdropTexture = await modelLoader.loadTexture('/textures/Backdrop.jpg');

    // Create office geometry with loaded textures
    createTexturedOfficeGeometry(scene, {
      floor: floorTexture,
      wall: wallTexture,
      wallNormal: wallNormal,
      desk: deskTexture,
      chair: chairTexture,
      cupboard: cupboardTexture,
      roof: roofTexture,
      painting1: painting1,
      painting2: painting2,
      painting3: painting3,
      backdrop: backdropTexture
    });

    // Trigger completion callback
    modelLoader.onLoadComplete && modelLoader.onLoadComplete();

  } catch (error) {
    console.error('Failed to load textures:', error);
    // Ultimate fallback
    createOfficeEnvironment(scene);
    modelLoader.onLoadComplete && modelLoader.onLoadComplete();
  }
}

// Create textured office geometry
function createTexturedOfficeGeometry(scene: THREE.Scene, textures: any) {
  // Office floor with your texture
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: textures.floor,
    roughness: 0.8,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Office walls with texture and normal maps
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: textures.wall,
    normalMap: textures.wallNormal,
    normalScale: new THREE.Vector2(0.5, 0.5),
    roughness: 0.9
  });
  
  // Back wall
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
  backWall.position.set(0, 2, -10);
  backWall.receiveShadow = true;
  scene.add(backWall);
  
  // Side walls
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-10, 2, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Ceiling with roof texture
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map: textures.roof, roughness: 0.9 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Desk with your desk texture
  const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
  const deskMaterial = new THREE.MeshStandardMaterial({ 
    map: textures.desk,
    roughness: 0.6,
    metalness: 0.1
  });
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(-2, -1.5, -4);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  // Chair with your chair texture
  const chairMaterial = new THREE.MeshStandardMaterial({ map: textures.chair });
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), chairMaterial);
  chairSeat.position.set(-2, -1.3, -2);
  chairSeat.castShadow = true;
  scene.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.1), chairMaterial);
  chairBack.position.set(-2, -0.7, -2.5);
  chairBack.castShadow = true;
  scene.add(chairBack);

  // Cupboard with your cupboard texture
  const shelfMaterial = new THREE.MeshStandardMaterial({ map: textures.cupboard });
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 0.5), shelfMaterial);
  shelf.position.set(-8, 0, -8);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  scene.add(shelf);

  // Window with backdrop texture
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 2.3),
    new THREE.MeshStandardMaterial({ 
      map: textures.backdrop,
      transparent: true,
      opacity: 0.8
    })
  );
  windowGlass.position.set(4, 1, -9.85);
  scene.add(windowGlass);

  // Wall paintings using your painting textures
  const paintings = [
    { texture: textures.painting1, position: [-9.9, 1, -4] },
    { texture: textures.painting2, position: [0, 3, -9.9] },
    { texture: textures.painting3, position: [6, 2, -9.9] }
  ];

  paintings.forEach(({ texture, position }) => {
    const paintingMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.2),
      new THREE.MeshStandardMaterial({ map: texture })
    );
    paintingMesh.position.set(position[0], position[1], position[2]);
    if (position[0] < -9) paintingMesh.rotation.y = Math.PI / 2;
    paintingMesh.castShadow = true;
    scene.add(paintingMesh);
  });

  // Add some office accessories
  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  monitor.position.set(-2, -0.8, -4.2);
  monitor.castShadow = true;
  scene.add(monitor);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  keyboard.position.set(-1.5, -1.4, -3.5);
  keyboard.castShadow = true;
  scene.add(keyboard);
}

// Create a professional office environment with textures
function createOfficeEnvironment(scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader();
  
  // Load textures
  const floorTexture = textureLoader.load('/textures/Floorbaked.png');
  const wallTexture = textureLoader.load('/textures/BakedWall.png');
  const deskTexture = textureLoader.load('/textures/DeskPainting.jpg');
  const chairTexture = textureLoader.load('/textures/ChairBaked.png');
  const cupboardTexture = textureLoader.load('/textures/CupboardBaked.png');
  const roofTexture = textureLoader.load('/textures/RoofBaked.png');
  const painting1 = textureLoader.load('/textures/Painting1.jpg');
  const painting2 = textureLoader.load('/textures/Painting2.jpg');
  const painting3 = textureLoader.load('/textures/Painting3.jpg');
  const backdropTexture = textureLoader.load('/textures/Backdrop.jpg');
  
  // Configure texture settings
  [floorTexture, wallTexture, deskTexture, chairTexture, cupboardTexture, roofTexture].forEach(texture => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.flipY = false;
    }
  });

  // Office floor with texture
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture,
    roughness: 0.8,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Office walls with texture
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    map: wallTexture,
    roughness: 0.9
  });
  
  // Back wall
  const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
  backWall.position.set(0, 2, -10);
  backWall.receiveShadow = true;
  scene.add(backWall);
  
  // Side walls
  const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), wallMaterial);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-10, 2, 0);
  leftWall.receiveShadow = true;
  scene.add(leftWall);

  // Ceiling with roof texture
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.9 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 6;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  // Desk with texture
  const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
  const deskMaterial = new THREE.MeshStandardMaterial({ 
    map: deskTexture,
    roughness: 0.6,
    metalness: 0.1
  });
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(-2, -1.5, -4);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  // Desk legs
  const legGeometry = new THREE.BoxGeometry(0.1, 1.4, 0.1);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
  
  const legPositions = [
    [-3.8, -2.2, -4.8],
    [-0.2, -2.2, -4.8],
    [-3.8, -2.2, -3.2],
    [-0.2, -2.2, -3.2]
  ];
  
  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    scene.add(leg);
  });

  // Office chair with texture
  const chairMaterial = new THREE.MeshStandardMaterial({ map: chairTexture });
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), chairMaterial);
  chairSeat.position.set(-2, -1.3, -2);
  chairSeat.castShadow = true;
  scene.add(chairSeat);

  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 0.1), chairMaterial);
  chairBack.position.set(-2, -0.7, -2.5);
  chairBack.castShadow = true;
  scene.add(chairBack);

  // Monitor
  const monitorScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x000000 })
  );
  monitorScreen.position.set(-2, -0.8, -4.2);
  monitorScreen.castShadow = true;
  scene.add(monitorScreen);

  // Monitor stand
  const monitorStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x666666 })
  );
  monitorStand.position.set(-2, -1.2, -4);
  monitorStand.castShadow = true;
  scene.add(monitorStand);

  // Bookshelf/Cupboard with texture
  const shelfMaterial = new THREE.MeshStandardMaterial({ map: cupboardTexture });
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 0.5), shelfMaterial);
  shelf.position.set(-8, 0, -8);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  scene.add(shelf);

  // Books on shelf
  const bookColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF];
  for (let i = 0; i < 8; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.3, 0.2),
      new THREE.MeshStandardMaterial({ color: bookColors[i % bookColors.length] })
    );
    book.position.set(-8.3 + (i % 4) * 0.15, 1 + Math.floor(i / 4) * 0.5, -8);
    book.castShadow = true;
    scene.add(book);
  }

  // Potted plant
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  pot.position.set(2, -1.7, -7);
  pot.castShadow = true;
  scene.add(pot);

  const plant = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
  );
  plant.position.set(2, -1.2, -7);
  plant.castShadow = true;
  scene.add(plant);

  // Window frame
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  windowFrame.position.set(4, 1, -9.9);
  windowFrame.castShadow = true;
  scene.add(windowFrame);

  // Window with backdrop texture
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 2.3),
    new THREE.MeshStandardMaterial({ 
      map: backdropTexture,
      transparent: true,
      opacity: 0.8
    })
  );
  windowGlass.position.set(4, 1, -9.85);
  scene.add(windowGlass);

  // Wall paintings using your painting textures
  const paintings = [
    { texture: painting1, position: [-9.9, 1, -4] },
    { texture: painting2, position: [0, 3, -9.9] },
    { texture: painting3, position: [6, 2, -9.9] }
  ];

  paintings.forEach(({ texture, position }) => {
    const paintingMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.2),
      new THREE.MeshStandardMaterial({ map: texture })
    );
    paintingMesh.position.set(position[0], position[1], position[2]);
    if (position[0] < -9) paintingMesh.rotation.y = Math.PI / 2;
    paintingMesh.castShadow = true;
    scene.add(paintingMesh);
  });

  // Office accessories
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  keyboard.position.set(-1.5, -1.4, -3.5);
  keyboard.castShadow = true;
  scene.add(keyboard);

  const notepad = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.02, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xffffcc })
  );
  notepad.position.set(-2.5, -1.4, -3.5);
  notepad.castShadow = true;
  scene.add(notepad);
}

export default function Scene3D({ onLoaded, onError }: Scene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
  } | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Initialize scene
      const { scene, camera, renderer, controls } = initializeScene(mountRef.current);
      sceneRef.current = { scene, camera, renderer, controls };

      // Add lighting
      createLighting(scene);

      // Initialize ModelLoader for robust texture and model handling
      const modelLoader = new ModelLoader(scene, renderer);
      
      // Set up ModelLoader callbacks
      modelLoader.onLoadProgress = (progress: number, url: string) => {
        console.log(`Loading progress: ${progress.toFixed(1)}% - ${url}`);
      };

      modelLoader.onLoadComplete = () => {
        console.log('All assets loaded successfully');
        setIsModelLoaded(true);
        onLoaded();
      };

      modelLoader.onLoadError = (url: string) => {
        console.error(`Failed to load: ${url}`);
        onError(`Failed to load model: ${url}`);
      };

      // Load your actual office FBX model
      loadOfficeModel(modelLoader, scene);

      // Handle resize
      const handleResizeEvent = () => handleResize(camera, renderer);
      window.addEventListener('resize', handleResizeEvent);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener('resize', handleResizeEvent);
        if (sceneRef.current) {
          sceneRef.current.renderer.dispose();
          mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        }
      };
    } catch (error) {
      console.error('Scene initialization error:', error);
      onError('Failed to initialize 3D scene');
    }
  }, [onLoaded, onError]);



  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'grab' }}
    />
  );
}
