import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initializeScene, createLighting, handleResize } from "../lib/three-utils";

interface Scene3DProps {
  onLoaded: () => void;
  onError: (error: string) => void;
}

// Helper function to find matching texture
function findMatchingTexture(meshName: string, textures: { [key: string]: THREE.Texture }): THREE.Texture | null {
  const lowerMeshName = meshName.toLowerCase();
  
  // Direct matches
  for (const texName in textures) {
    const texBaseName = texName.toLowerCase().replace(/baked|\.png|\.jpg/g, '');
    if (lowerMeshName.includes(texBaseName) || texBaseName.includes(lowerMeshName)) {
      return textures[texName];
    }
  }
  
  // Pattern matches
  if (lowerMeshName.includes('floor')) return textures['Floorbaked.png'] || null;
  if (lowerMeshName.includes('wall')) return textures['BakedWall.png'] || null;
  if (lowerMeshName.includes('chair')) return textures['ChairBaked.png'] || null;
  if (lowerMeshName.includes('desk')) return textures['DeskPainting.jpg'] || null;
  if (lowerMeshName.includes('roof') || lowerMeshName.includes('ceiling')) return textures['RoofBaked.png'] || null;
  if (lowerMeshName.includes('cupboard')) return textures['CupboardBaked.png'] || null;
  
  return null;
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

      // Create enhanced office environment with loaded textures
      const textureLoader = new THREE.TextureLoader();
      
      // Load key textures to enhance the built-in office environment
      const floorTexture = textureLoader.load('/textures/Floorbaked.png');
      const wallTexture = textureLoader.load('/textures/BakedWall.png');
      const deskTexture = textureLoader.load('/textures/DeskPainting.jpg');
      
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.wrapS = THREE.RepeatWrapping;
      wallTexture.wrapT = THREE.RepeatWrapping;
      deskTexture.wrapS = THREE.RepeatWrapping;
      deskTexture.wrapT = THREE.RepeatWrapping;
      
      // Create textured office environment
      createOfficeEnvironment(scene);
      setIsModelLoaded(true);
      onLoaded();

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
