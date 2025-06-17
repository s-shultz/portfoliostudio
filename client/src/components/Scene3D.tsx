import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  initializeScene,
  createLighting,
  handleResize,
} from "../lib/three-utils";
import { ModelLoader } from "../lib/ModelLoader";
import { MonitorInteraction, MonitorType } from "../lib/MonitorInteraction";
import InteractiveScreens, { ScreenType } from "./InteractiveScreens";

interface Scene3DProps {
  onLoaded: () => void;
  onError: (error: string) => void;
}

// Load office model with robust ModelLoader system
async function loadOfficeModel(modelLoader: ModelLoader, scene: THREE.Scene, monitorInteraction: MonitorInteraction): Promise<THREE.Mesh[]> {
  try {
    // Define texture configuration for your office model
    const texturesConfig = {};

    // Load your actual FBX office model
    const modelData = await modelLoader.loadSmallOfficeModel(
      "/models/SmallOffice.fbx",
      texturesConfig,
    );

    // Position and scale the loaded model
    const model = modelData.model;
    model.position.set(0, -2, 0);
    model.scale.setScalar(0.03);
    model.rotation.y = Math.PI;

    console.log("FBX office model loaded successfully");
    console.log("Available objects:", modelLoader.getObjectNames(model));
    console.log("Model position:", model.position);
    console.log("Model scale:", model.scale);

    // Load and position monitors on the desk
    const clickableScreens = await loadMonitors(modelLoader, scene, monitorInteraction);
    return clickableScreens;
  } catch (error) {
    console.error("Failed to load FBX office model:", error);
    throw error;
  }
}

// Load monitor models and position them on the desk
async function loadMonitors(modelLoader: ModelLoader, scene: THREE.Scene, monitorInteraction: MonitorInteraction) {
  try {
    console.log("Loading monitor models...");

    // Load the new 3D screen assets
    const creativeCodingData = await modelLoader.loadGLTF("/models/creativecoding.glb");
    console.log("Creative Coding GLB data loaded:", creativeCodingData);

    const creativeCodingScreen = creativeCodingData.scene.clone();
    console.log("Creative Coding screen children count:", creativeCodingScreen.children.length);

    // Scale for the new 3D screens
    const screenScale = 0.5;

    // First monitor (left) - Creative Coding Screen
    creativeCodingScreen.position.set(-6.5, -5.5, 1);
    creativeCodingScreen.scale.setScalar(0.65);
    // creativeCodingScreen.rotation.x = Math.PI;
    creativeCodingScreen.rotation.y = Math.PI * 1.48;
    creativeCodingScreen.rotation.z = 0;
    scene.add(creativeCodingScreen);

    // Create clickable area for creative coding screen
    const screen1 = monitorInteraction.createClickableArea(
      new THREE.Vector3(-6.8, -2.7, 1.05),
      new THREE.Vector2(2.0, 1.1),
      new THREE.Euler(0, Math.PI * 0.55, 0)
    );
    scene.add(screen1);
    monitorInteraction.addMonitor(screen1, "coding", "monitor1");

    // Second monitor (center) - XR Screen
    const xrScreenData = await modelLoader.loadGLTF("/models/xrscreen.glb");
    const xrScreen = xrScreenData.scene.clone();
    xrScreen.position.set(-5.0, -5.5, 8);
    xrScreen.scale.setScalar(0.65);
    // xrScreen.scale.setScalar(screenScale);
    // xrScreen.rotation.x = Math.PI;
    xrScreen.rotation.y = Math.PI * 1.7;
    xrScreen.rotation.z = 0;
    scene.add(xrScreen);

    // Create clickable area for XR screen
    const screen2 = monitorInteraction.createClickableArea(
      new THREE.Vector3(-6.85, -2.7, 7.95),
      new THREE.Vector2(2.0, 1.1),
      new THREE.Euler(0, Math.PI * 0.45, 0)
    );
    scene.add(screen2);
    monitorInteraction.addMonitor(screen2, "3d", "monitor2");

    // Third monitor (right) - UI/UX Design (Hanging monitor)
    const monitor3Data = await modelLoader.loadGLTF("/models/hanging_monitor.glb");
    const monitor3 = monitor3Data.scene.clone();
    monitor3.position.set(-10, -1.5, 5);
    monitor3.scale.setScalar(15);
    monitor3.rotation.x = 0;
    monitor3.rotation.y = Math.PI * 0.55;
    monitor3.rotation.z = 0;
    scene.add(monitor3);

    // Create clickable area for the hanging monitor (using the 3D model itself)
    const clickableArea = monitorInteraction.createClickableArea(
      new THREE.Vector3(-9.0, 1.3, 4.6),
      new THREE.Vector2(4.0, 2.0),
      new THREE.Euler(0.05, Math.PI * 0.55, 0)
    );
    scene.add(clickableArea);
    monitorInteraction.addMonitor(clickableArea, "uiux", "monitor3");

    console.log("Interactive monitors setup complete");
    return [screen1, screen2, clickableArea];
  } catch (error) {
    console.error("Failed to load monitor models:", error);
    return [];
  }
}

// Enhanced procedural environment using ModelLoader for textures
async function createEnhancedOfficeEnvironment(
  scene: THREE.Scene,
  modelLoader: ModelLoader,
) {
  try {
    // Load textures using ModelLoader's robust system
    const floorTexture = await modelLoader.loadTexture(
      "/textures/Floorbaked.png",
    );
    const wallTexture = await modelLoader.loadTexture(
      "/textures/BakedWall.png",
    );
    const wallNormal = await modelLoader.loadTexture(
      "/textures/BakedWallNormal.png",
    );
    const deskTexture = await modelLoader.loadTexture(
      "/textures/DeskPainting.jpg",
    );
    const chairTexture = await modelLoader.loadTexture(
      "/textures/ChairBaked.png",
    );
    const cupboardTexture = await modelLoader.loadTexture(
      "/textures/CupboardBaked.png",
    );
    const roofTexture = await modelLoader.loadTexture(
      "/textures/RoofBaked.png",
    );
    const painting1 = await modelLoader.loadTexture("/textures/Painting1.jpg");
    const painting2 = await modelLoader.loadTexture("/textures/Painting2.jpg");
    const painting3 = await modelLoader.loadTexture("/textures/Painting3.jpg");
    const backdropTexture = await modelLoader.loadTexture(
      "/textures/Backdrop.jpg",
    );

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
      backdrop: backdropTexture,
    });

    // Trigger completion callback
    modelLoader.onLoadComplete && modelLoader.onLoadComplete();
  } catch (error) {
    console.error("Failed to load textures:", error);
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
    metalness: 0.1,
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
    roughness: 0.9,
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
    new THREE.MeshStandardMaterial({ map: textures.roof, roughness: 0.9 }),
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
    metalness: 0.1,
  });
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(-2, -1.5, -4);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  // Chair with your chair texture
  const chairMaterial = new THREE.MeshStandardMaterial({ map: textures.chair });
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    chairMaterial,
  );
  chairSeat.position.set(-2, -1.3, -2);
  chairSeat.castShadow = true;
  scene.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.1),
    chairMaterial,
  );
  chairBack.position.set(-2, -0.7, -2.5);
  chairBack.castShadow = true;
  scene.add(chairBack);

  // Cupboard with your cupboard texture
  const shelfMaterial = new THREE.MeshStandardMaterial({
    map: textures.cupboard,
  });
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 4, 0.5),
    shelfMaterial,
  );
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
      opacity: 0.8,
    }),
  );
  windowGlass.position.set(4, 1, -9.85);
  scene.add(windowGlass);

  // Wall paintings using your painting textures
  const paintings = [
    { texture: textures.painting1, position: [-9.9, 1, -4] },
    { texture: textures.painting2, position: [0, 3, -9.9] },
    { texture: textures.painting3, position: [6, 2, -9.9] },
  ];

  paintings.forEach(({ texture, position }) => {
    const paintingMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.2),
      new THREE.MeshStandardMaterial({ map: texture }),
    );
    paintingMesh.position.set(position[0], position[1], position[2]);
    if (position[0] < -9) paintingMesh.rotation.y = Math.PI / 2;
    paintingMesh.castShadow = true;
    scene.add(paintingMesh);
  });

  // Add some office accessories
  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x000000 }),
  );
  monitor.position.set(-2, -0.8, -4.2);
  monitor.castShadow = true;
  scene.add(monitor);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x333333 }),
  );
  keyboard.position.set(-1.5, -1.4, -3.5);
  keyboard.castShadow = true;
  scene.add(keyboard);
}

// Create a professional office environment with textures
function createOfficeEnvironment(scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader();

  // Load textures
  const floorTexture = textureLoader.load("/textures/Floorbaked.png");
  const wallTexture = textureLoader.load("/textures/BakedWall.png");
  const deskTexture = textureLoader.load("/textures/DeskPainting.jpg");
  const chairTexture = textureLoader.load("/textures/ChairBaked.png");
  const cupboardTexture = textureLoader.load("/textures/CupboardBaked.png");
  const roofTexture = textureLoader.load("/textures/RoofBaked.png");
  const painting1 = textureLoader.load("/textures/Painting1.jpg");
  const painting2 = textureLoader.load("/textures/Painting2.jpg");
  const painting3 = textureLoader.load("/textures/Painting3.jpg");
  const backdropTexture = textureLoader.load("/textures/Backdrop.jpg");

  // Configure texture settings
  [
    floorTexture,
    wallTexture,
    deskTexture,
    chairTexture,
    cupboardTexture,
    roofTexture,
  ].forEach((texture) => {
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
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Office walls with texture
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.9,
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
    new THREE.MeshStandardMaterial({ map: roofTexture, roughness: 0.9 }),
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
    metalness: 0.1,
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
    [-0.2, -2.2, -3.2],
  ];

  legPositions.forEach((pos) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    scene.add(leg);
  });

  // Office chair with texture
  const chairMaterial = new THREE.MeshStandardMaterial({ map: chairTexture });
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    chairMaterial,
  );
  chairSeat.position.set(-2, -1.3, -2);
  chairSeat.castShadow = true;
  scene.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.1),
    chairMaterial,
  );
  chairBack.position.set(-2, -0.7, -2.5);
  chairBack.castShadow = true;
  scene.add(chairBack);

  // Monitor
  const monitorScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x000000 }),
  );
  monitorScreen.position.set(-2, -0.8, -4.2);
  monitorScreen.castShadow = true;
  scene.add(monitorScreen);

  // Monitor stand
  const monitorStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x666666 }),
  );
  monitorStand.position.set(-2, -1.2, -4);
  monitorStand.castShadow = true;
  scene.add(monitorStand);

  // Bookshelf/Cupboard with texture
  const shelfMaterial = new THREE.MeshStandardMaterial({
    map: cupboardTexture,
  });
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 4, 0.5),
    shelfMaterial,
  );
  shelf.position.set(-8, 0, -8);
  shelf.castShadow = true;
  shelf.receiveShadow = true;
  scene.add(shelf);

  // Books on shelf
  const bookColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
  for (let i = 0; i < 8; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.3, 0.2),
      new THREE.MeshStandardMaterial({
        color: bookColors[i % bookColors.length],
      }),
    );
    book.position.set(-8.3 + (i % 4) * 0.15, 1 + Math.floor(i / 4) * 0.5, -8);
    book.castShadow = true;
    scene.add(book);
  }

  // Potted plant
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
  );
  pot.position.set(2, -1.7, -7);
  pot.castShadow = true;
  scene.add(pot);

  const plant = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0x228b22 }),
  );
  plant.position.set(2, -1.2, -7);
  plant.castShadow = true;
  scene.add(plant);

  // Window frame
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3, 2.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
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
      opacity: 0.8,
    }),
  );
  windowGlass.position.set(4, 1, -9.85);
  scene.add(windowGlass);

  // Wall paintings using your painting textures
  const paintings = [
    { texture: painting1, position: [-9.9, 1, -4] },
    { texture: painting2, position: [0, 3, -9.9] },
    { texture: painting3, position: [6, 2, -9.9] },
  ];

  paintings.forEach(({ texture, position }) => {
    const paintingMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 1.2),
      new THREE.MeshStandardMaterial({ map: texture }),
    );
    paintingMesh.position.set(position[0], position[1], position[2]);
    if (position[0] < -9) paintingMesh.rotation.y = Math.PI / 2;
    paintingMesh.castShadow = true;
    scene.add(paintingMesh);
  });

  // Office accessories
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.05, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x333333 }),
  );
  keyboard.position.set(-1.5, -1.4, -3.5);
  keyboard.castShadow = true;
  scene.add(keyboard);

  const notepad = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.02, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xffffcc }),
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
  const [activeScreen, setActiveScreen] = useState<ScreenType | null>(null);
  const monitorInteractionRef = useRef<MonitorInteraction | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    try {
      // Initialize scene
      const { scene, camera, renderer, controls } = initializeScene(
        mountRef.current,
      );
      sceneRef.current = { scene, camera, renderer, controls };

      // Add lighting
      createLighting(scene);

      // Initialize ModelLoader for robust texture and model handling
      const modelLoader = new ModelLoader(scene, renderer);

      // Initialize monitor interaction system
      const monitorInteraction = new MonitorInteraction(camera);
      monitorInteractionRef.current = monitorInteraction;

      // Set up monitor click handler
      monitorInteraction.setClickHandler((type: MonitorType) => {
        setActiveScreen(type as ScreenType);
      });

      // Set up ModelLoader callbacks
      modelLoader.onLoadProgress = (progress: number, url: string) => {
        console.log(`Loading progress: ${progress.toFixed(1)}% - ${url}`);
      };

      modelLoader.onLoadComplete = () => {
        console.log("All assets loaded successfully");
        setIsModelLoaded(true);
        onLoaded();
      };

      modelLoader.onLoadError = (url: string) => {
        console.error(`Failed to load: ${url}`);
        onError(`Failed to load model: ${url}`);
      };

      // Load your actual office FBX model and get clickable screens
      loadOfficeModel(modelLoader, scene, monitorInteraction).then((screens) => {
        clickableScreens = screens;
        console.log("Clickable screens loaded:", screens.length);
      });

      // Handle resize
      const handleResizeEvent = () => handleResize(camera, renderer);
      window.addEventListener("resize", handleResizeEvent);

      // Handle mouse clicks for monitor interaction
      const handleClick = (event: MouseEvent) => {
        console.log("Click detected at:", event.clientX, event.clientY);
        if (monitorInteractionRef.current && mountRef.current) {
          monitorInteractionRef.current.handleClick(event, mountRef.current);
        }
      };
      
      // Store clickable screens reference
      let clickableScreens: THREE.Mesh[] = [];
      
      // Handle mouse movement for hover effects
      const handleMouseMove = (event: MouseEvent) => {
        if (mountRef.current && clickableScreens.length > 0) {
          const rect = mountRef.current.getBoundingClientRect();
          const mouse = new THREE.Vector2();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
          
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(mouse, camera);
          
          const intersects = raycaster.intersectObjects(clickableScreens, true);
          
          if (intersects.length > 0) {
            mountRef.current.style.cursor = "pointer";
          } else {
            mountRef.current.style.cursor = "grab";
          }
        }
      };
      
      mountRef.current.addEventListener("click", handleClick);
      mountRef.current.addEventListener("mousemove", handleMouseMove);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener("resize", handleResizeEvent);
        mountRef.current?.removeEventListener("click", handleClick);
        if (sceneRef.current) {
          sceneRef.current.renderer.dispose();
          mountRef.current?.removeChild(sceneRef.current.renderer.domElement);
        }
      };
    } catch (error) {
      console.error("Scene initialization error:", error);
      onError("Failed to initialize 3D scene");
    }
  }, [onLoaded, onError]);

  return (
    <>
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: "grab" }}
      />
      <InteractiveScreens 
        activeScreen={activeScreen} 
        onClose={() => setActiveScreen(null)} 
      />
    </>
  );
}
