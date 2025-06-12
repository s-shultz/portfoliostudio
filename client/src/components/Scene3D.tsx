import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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

      // Load FBX model
      const fbxLoader = new FBXLoader();
      const textureLoader = new THREE.TextureLoader();
      
      // Load the office FBX model
      fbxLoader.load(
        '/models/office.fbx',
        (object) => {
          // Scale and position the model appropriately for the office
          object.scale.setScalar(0.03);
          object.position.set(0, -2, 0);
          object.rotation.y = Math.PI; // Rotate to face the right direction
          
          // Create a mapping of texture names to their paths
          const textureMap: { [key: string]: string } = {
            'Backdrop': '/textures/Backdrop.jpg',
            'BakedSkirtingBoard': '/textures/BakedSkirtingBoard.png',
            'BakedWall': '/textures/BakedWall.png',
            'BakedWallNormal': '/textures/BakedWallNormal.png',
            'ChairBaked': '/textures/ChairBaked.png',
            'ClockBaked': '/textures/ClockBaked.png',
            'ClockfaceBaked': '/textures/ClockfaceBaked.png',
            'CupboardBaked': '/textures/CupboardBaked.png',
            'CurtainBaked': '/textures/CurtainBaked.png',
            'DeskPainting': '/textures/DeskPainting.jpg',
            'Dirt': '/textures/Dirt.jpg',
            'Floorbaked': '/textures/Floorbaked.png',
            'Glass2': '/textures/Glass2.png',
            'GlassNormal': '/textures/GlassNormal.png',
            'Keyboard': '/textures/Keyboard.png',
            'Notepad': '/textures/Notepad.png',
            'Painting1': '/textures/Painting1.jpg',
            'Painting2': '/textures/Painting2.jpg',
            'Painting3': '/textures/Painting3.jpg',
            'PlugBaked': '/textures/PlugBaked.png',
            'RoofBaked': '/textures/RoofBaked.png',
            'RoofNormal': '/textures/RoofNormal.png',
            'TowelBaked': '/textures/TowelBaked.png',
            'WallPaintingsBaked': '/textures/WallPaintingsBaked.png'
          };
          
          // The FBX model likely has multiple sub-meshes with different material assignments
          // Let's examine the structure and apply textures based on FBX material names
          console.log('Analyzing FBX structure...');
          
          // Create texture atlas for different parts of the office
          const officeTextures = {
            floor: textureLoader.load('/textures/Floorbaked.png'),
            wall: textureLoader.load('/textures/BakedWall.png'),
            roof: textureLoader.load('/textures/RoofBaked.png'),
            chair: textureLoader.load('/textures/ChairBaked.png'),
            cupboard: textureLoader.load('/textures/CupboardBaked.png'),
            backdrop: textureLoader.load('/textures/Backdrop.jpg'),
            clock: textureLoader.load('/textures/ClockfaceBaked.png'),
            towel: textureLoader.load('/textures/TowelBaked.png'),
            curtain: textureLoader.load('/textures/CurtainBaked.png'),
            keyboard: textureLoader.load('/textures/Keyboard.png'),
            paintings: textureLoader.load('/textures/WallPaintingsBaked.png'),
            plug: textureLoader.load('/textures/PlugBaked.png'),
            skirting: textureLoader.load('/textures/BakedSkirtingBoard.png'),
            glass: textureLoader.load('/textures/Glass2.png'),
            notepad: textureLoader.load('/textures/Notepad.png')
          };
          
          // Configure all textures
          Object.values(officeTextures).forEach(texture => {
            texture.flipY = false;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.generateMipmaps = true;
          });
          
          // Create materials for different office components
          const officeMaterials = {
            floor: new THREE.MeshStandardMaterial({ 
              map: officeTextures.floor, 
              roughness: 0.8, 
              metalness: 0.1 
            }),
            wall: new THREE.MeshStandardMaterial({ 
              map: officeTextures.wall, 
              roughness: 0.9, 
              metalness: 0.0 
            }),
            roof: new THREE.MeshStandardMaterial({ 
              map: officeTextures.roof, 
              roughness: 0.9, 
              metalness: 0.1 
            }),
            chair: new THREE.MeshStandardMaterial({ 
              map: officeTextures.chair, 
              roughness: 0.6, 
              metalness: 0.3 
            }),
            furniture: new THREE.MeshStandardMaterial({ 
              map: officeTextures.cupboard, 
              roughness: 0.7, 
              metalness: 0.2 
            }),
            backdrop: new THREE.MeshStandardMaterial({ 
              map: officeTextures.backdrop, 
              roughness: 0.8, 
              metalness: 0.0 
            }),
            glass: new THREE.MeshStandardMaterial({ 
              map: officeTextures.glass, 
              transparent: true, 
              opacity: 0.7, 
              roughness: 0.1, 
              metalness: 0.0 
            }),
            generic: new THREE.MeshStandardMaterial({ 
              map: officeTextures.wall, 
              roughness: 0.7, 
              metalness: 0.1 
            })
          };
          
          // Apply materials based on FBX structure and names
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              const meshName = child.name.toLowerCase();
              const materialName = child.material?.name?.toLowerCase() || '';
              
              console.log(`Mesh: "${child.name}", Material: "${child.material?.name || 'none'}"`);
              
              // Apply appropriate material based on mesh/material names
              if (meshName.includes('backdrop') || materialName.includes('backdrop')) {
                child.material = officeMaterials.backdrop.clone();
              } else if (meshName.includes('floor') || materialName.includes('floor')) {
                child.material = officeMaterials.floor.clone();
              } else if (meshName.includes('wall') || materialName.includes('wall')) {
                child.material = officeMaterials.wall.clone();
              } else if (meshName.includes('roof') || meshName.includes('ceiling') || materialName.includes('roof')) {
                child.material = officeMaterials.roof.clone();
              } else if (meshName.includes('chair') || materialName.includes('chair')) {
                child.material = officeMaterials.chair.clone();
              } else if (meshName.includes('glass') || materialName.includes('glass')) {
                child.material = officeMaterials.glass.clone();
              } else if (meshName.includes('furniture') || meshName.includes('cupboard') || meshName.includes('desk')) {
                child.material = officeMaterials.furniture.clone();
              } else {
                // For the main office geometry, apply a comprehensive material
                child.material = officeMaterials.generic.clone();
              }
              
              console.log(`Applied material to ${child.name}`);
            }
          });

          scene.add(object);
          setIsModelLoaded(true);
          onLoaded();
          console.log('Office FBX model loaded successfully');
        },
        (progress) => {
          const percent = (progress.loaded / progress.total * 100);
          console.log('Loading progress:', percent + '%');
        },
        (error) => {
          console.error('Failed to load FBX model:', error);
          onError('Failed to load 3D office model. Please check if the model file is accessible.');
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
