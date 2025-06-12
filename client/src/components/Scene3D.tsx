import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initializeScene, createLighting, handleResize } from "../lib/three-utils";

interface Scene3DProps {
  onLoaded: () => void;
  onError: (error: string) => void;
}

// Create a professional office environment
function createOfficeEnvironment(scene: THREE.Scene) {
  // Office floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x444444,
    roughness: 0.8,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Office walls
  const wallMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xeeeeee,
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

  // Desk
  const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
  const deskMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
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

  // Office chair
  const chairSeat = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.1, 1),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
  chairSeat.position.set(-2, -1.3, -2);
  chairSeat.castShadow = true;
  scene.add(chairSeat);

  const chairBack = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
  );
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

  // Bookshelf
  const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
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

  // Window glass
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.8, 2.3),
    new THREE.MeshStandardMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3
    })
  );
  windowGlass.position.set(4, 1, -9.85);
  scene.add(windowGlass);
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

      // Load your specific FBX office model
      const fbxLoader = new FBXLoader();
      
      fbxLoader.load(
        '/models/office.fbx',
        (object) => {
          console.log('FBX office model loaded successfully');
          
          // Scale and position the model appropriately
          object.scale.setScalar(0.03);
          object.position.set(0, -2, 0);
          object.rotation.y = Math.PI;
          
          // Enhance materials and enable shadows
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              // Preserve original materials but enhance them
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      mat.roughness = 0.7;
                      mat.metalness = 0.1;
                      mat.needsUpdate = true;
                    }
                  });
                } else if (child.material instanceof THREE.MeshStandardMaterial) {
                  child.material.roughness = 0.7;
                  child.material.metalness = 0.1;
                  child.material.needsUpdate = true;
                } else {
                  // Convert other material types to StandardMaterial
                  const newMaterial = new THREE.MeshStandardMaterial({
                    color: child.material.color || 0xffffff,
                    roughness: 0.7,
                    metalness: 0.1
                  });
                  
                  // Preserve texture if available
                  if ((child.material as any).map) {
                    newMaterial.map = (child.material as any).map;
                  }
                  
                  child.material = newMaterial;
                }
              }
            }
          });

          scene.add(object);
          setIsModelLoaded(true);
          onLoaded();
          console.log('Office model added to scene with enhanced materials');
        },
        (progress) => {
          const percent = (progress.loaded / progress.total * 100);
          console.log('Loading progress:', percent.toFixed(1) + '%');
        },
        (error) => {
          console.error('FBX loading error:', error);
          // Fallback to built-in environment if model fails to load
          createOfficeEnvironment(scene);
          setIsModelLoaded(true);
          onLoaded();
        }
      );

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
