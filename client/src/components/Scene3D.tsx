import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initializeScene, createLighting, handleResize } from "../lib/three-utils";

interface Scene3DProps {
  onLoaded: () => void;
  onError: (error: string) => void;
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

      // Try GLTF loader first (more reliable), fallback to FBX
      const gltfLoader = new GLTFLoader();
      const fbxLoader = new FBXLoader();
      
      // First attempt with GLTF format (if available)
      gltfLoader.load(
        '/models/office.glb',
        (gltf) => {
          console.log('GLTF model loaded successfully');
          const object = gltf.scene;
          
          // Position and scale
          object.scale.setScalar(0.03);
          object.position.set(0, -2, 0);
          object.rotation.y = Math.PI;
          
          // Enhance materials
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              if (child.material) {
                if (child.material instanceof THREE.MeshStandardMaterial) {
                  child.material.roughness = 0.7;
                  child.material.metalness = 0.1;
                  child.material.needsUpdate = true;
                }
              }
            }
          });

          scene.add(object);
          setIsModelLoaded(true);
          onLoaded();
        },
        (progress) => {
          console.log('GLTF Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.log('GLTF not available, trying FBX format');
          
          // Fallback to FBX loader
          fbxLoader.load(
            '/models/office.fbx',
            (object) => {
              console.log('FBX loaded successfully');
              
              // Basic positioning
              object.scale.setScalar(0.03);
              object.position.set(0, -2, 0);
              object.rotation.y = Math.PI;
              
              // Simple material enhancement
              object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  
                  if (child.material) {
                    const material = new THREE.MeshStandardMaterial({
                      color: 0xffffff,
                      roughness: 0.7,
                      metalness: 0.1
                    });
                    
                    // Preserve embedded textures
                    if ((child.material as any).map) {
                      material.map = (child.material as any).map;
                    }
                    
                    child.material = material;
                  }
                }
              });

              scene.add(object);
              setIsModelLoaded(true);
              onLoaded();
            },
            (progress) => {
              console.log('FBX Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
              console.error('Both GLTF and FBX loading failed:', error);
              createFallbackEnvironment(scene);
              setIsModelLoaded(true);
              onLoaded();
            }
          );
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

  const createFallbackEnvironment = (scene: THREE.Scene) => {
    // Create a simple office-like environment as fallback
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x444444,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf0f0f0,
      roughness: 0.9,
      metalness: 0.0
    });

    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(20, 8);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 4, -10);
    scene.add(backWall);

    // Side walls
    const sideWallGeometry = new THREE.PlaneGeometry(20, 8);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-10, 4, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(10, 4, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Desk
    const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
    const deskMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.6,
      metalness: 0.2
    });
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    desk.position.set(0, 1.5, -3);
    desk.castShadow = true;
    scene.add(desk);

    // Chair
    const chairGeometry = new THREE.BoxGeometry(1, 0.1, 1);
    const chairMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.7,
      metalness: 0.3
    });
    const chair = new THREE.Mesh(chairGeometry, chairMaterial);
    chair.position.set(0, 0.8, -1);
    chair.castShadow = true;
    scene.add(chair);

    // Chair back
    const chairBackGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
    const chairBack = new THREE.Mesh(chairBackGeometry, chairMaterial);
    chairBack.position.set(0, 1.5, -0.5);
    chairBack.castShadow = true;
    scene.add(chairBack);

    // Monitor
    const monitorGeometry = new THREE.BoxGeometry(1.5, 1, 0.1);
    const monitorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.8
    });
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitor.position.set(0, 2, -2.8);
    monitor.castShadow = true;
    scene.add(monitor);

    // Bookshelf
    const shelfGeometry = new THREE.BoxGeometry(0.3, 6, 2);
    const shelfMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x654321,
      roughness: 0.8,
      metalness: 0.1
    });
    const bookshelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    bookshelf.position.set(-6, 3, -6);
    bookshelf.castShadow = true;
    scene.add(bookshelf);
  };

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full"
      style={{ cursor: 'grab' }}
    />
  );
}
