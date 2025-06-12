import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export class ModelLoader {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  loadingManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  gltfLoader: GLTFLoader;
  fbxLoader: FBXLoader;
  onLoadComplete?: () => void;
  onLoadProgress?: (progress: number, url: string) => void;
  onLoadError?: (url: string) => void;

  constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.loadingManager = new THREE.LoadingManager();
    
    // Set up path resolution for FBX embedded textures and fbm folders
    this.loadingManager.setURLModifier((url) => {
      console.log('Loading URL:', url);
      
      // Handle FBX material folder (.fbm) structure - fix space mismatch
      if (url.includes('/models/Small Office.fbm/')) {
        // Convert spaced path to non-spaced path and extract filename
        const filename = url.split('/').pop();
        const fixedUrl = `/models/SmallOffice.fbm/${filename}`;
        console.log(`Fixed .fbm path: ${url} -> ${fixedUrl}`);
        return fixedUrl;
      }
      
      if (url.includes('/models/SmallOffice.fbm/')) {
        // Keep the .fbm folder structure intact
        return url;
      }
      
      // Block attempts to load the .fbm folder itself as a file
      if (url.endsWith('/models/Small Office.fbm') || url.endsWith('/models/SmallOffice.fbm')) {
        console.log('Blocking attempt to load .fbm folder as file:', url);
        // Return a data URL that won't cause loading errors
        return 'data:text/plain;base64,'; 
      }
      
      // If it's a texture file being loaded from models directory, redirect to textures
      if (url.includes('/models/') && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png'))) {
        const filename = url.split('/').pop();
        return `/textures/${filename}`;
      }
      
      return url;
    });
    
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.fbxLoader = new FBXLoader(this.loadingManager);
    
    this.setupLoadingManager();
  }

  setupLoadingManager() {
    this.loadingManager.onLoad = () => {
      console.log('✅ All assets loaded successfully');
      this.onLoadComplete && this.onLoadComplete();
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(`📦 Loading progress: ${progress.toFixed(1)}% - ${url}`);
      this.onLoadProgress && this.onLoadProgress(progress, url);
    };

    this.loadingManager.onError = (url) => {
      console.error(`❌ Failed to load: ${url}`);
      console.error('Error occurred at:', new Date().toISOString());
      this.onLoadError && this.onLoadError(url);
    };
  }

  async loadSmallOfficeModel(modelPath: string, texturesConfig: Record<string, any> = {}) {
    try {
      console.log(`Starting to load model from: ${modelPath}`);
      
      let model: THREE.Object3D;
      let animations: THREE.AnimationClip[] = [];
      let cameras: THREE.Camera[] = [];
      let scenes: THREE.Group[] = [];

      // Determine file type and load accordingly
      if (modelPath.endsWith('.glb') || modelPath.endsWith('.gltf')) {
        console.log('Loading as GLTF/GLB format');
        const gltf = await this.loadGLTF(modelPath);
        model = gltf.scene;
        animations = gltf.animations;
        cameras = gltf.cameras;
        scenes = gltf.scenes;
      } else if (modelPath.endsWith('.fbx')) {
        console.log('Loading as FBX format');
        model = await this.loadFBX(modelPath);
        console.log('FBX model loaded successfully, processing...');
      } else {
        throw new Error('Unsupported model format');
      }

      console.log('Model loaded, applying optimizations...');
      
      if (Object.keys(texturesConfig).length > 0) {
        console.log('Applying custom texture configuration...');
        await this.applyTextures(model, texturesConfig);
      }

      this.optimizeModel(model);
      this.scene.add(model);
      
      console.log('Model added to scene successfully');
      console.log('Model object count:', this.getObjectNames(model).length);

      return {
        model: model,
        animations: animations,
        cameras: cameras,
        scenes: scenes
      };

    } catch (error) {
      console.error('Error loading model:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  loadGLTF(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        path,
        (gltf) => resolve(gltf),
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Model loading: ${percent.toFixed(1)}%`);
        },
        (error) => reject(error)
      );
    });
  }

  loadFBX(path: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      // Create a separate loading manager for FBX to handle errors gracefully
      const fbxLoadingManager = new THREE.LoadingManager();
      
      fbxLoadingManager.onError = (url) => {
        console.log(`Ignoring FBX loader error for: ${url}`);
        // Don't reject - just log and continue
      };
      
      const fbxLoader = new FBXLoader(fbxLoadingManager);
      
      fbxLoader.load(
        path,
        (object) => {
          console.log('FBX model loaded successfully, applying material fixes...');
          // Process and clean up materials to reduce warnings
          this.cleanupFBXMaterials(object);
          resolve(object);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`FBX loading: ${percent.toFixed(1)}%`);
        },
        (error) => {
          console.error('FBX loading error details:', error);
          reject(error);
        }
      );
    });
  }

  cleanupFBXMaterials(object: THREE.Object3D) {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          // Handle both single materials and material arrays
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          
          materials.forEach((material, index) => {
            // Create a new MeshStandardMaterial to avoid FBX loader warnings
            const standardMaterial = new THREE.MeshStandardMaterial();
            
            // Copy properties from the original material safely
            if ((material as any).color) {
              standardMaterial.color.copy((material as any).color);
            }
            
            // Copy textures if they exist
            if ((material as any).map) {
              standardMaterial.map = (material as any).map;
            }
            
            if ((material as any).normalMap) {
              standardMaterial.normalMap = (material as any).normalMap;
            }
            
            if ((material as any).emissiveMap) {
              standardMaterial.emissiveMap = (material as any).emissiveMap;
            }
            
            if ((material as any).aoMap) {
              standardMaterial.aoMap = (material as any).aoMap;
            }
            
            // Copy transparency settings
            if (material.transparent !== undefined) {
              standardMaterial.transparent = material.transparent;
            }
            
            if (material.opacity !== undefined) {
              standardMaterial.opacity = material.opacity;
            }
            
            // Set PBR properties for realistic rendering
            standardMaterial.roughness = 0.7;
            standardMaterial.metalness = 0.1;
            
            // Copy material name for debugging
            standardMaterial.name = material.name || `Material_${index}`;
            
            // Replace the material
            if (Array.isArray(mesh.material)) {
              mesh.material[index] = standardMaterial;
            } else {
              mesh.material = standardMaterial;
            }
          });
        }
      }
    });
  }

  async applyTextures(model: THREE.Object3D, texturesConfig: Record<string, any>) {
    const texturePromises: Promise<any>[] = [];
    const loadedTextures: Record<string, THREE.Texture> = {};

    for (const [materialName, textureData] of Object.entries(texturesConfig)) {
      for (const [textureType, texturePath] of Object.entries(textureData)) {
        if (texturePath && !loadedTextures[texturePath as string]) {
          texturePromises.push(
            this.loadTexture(texturePath as string).then(texture => {
              loadedTextures[texturePath as string] = texture;
              return { path: texturePath, texture };
            })
          );
        }
      }
    }

    await Promise.all(texturePromises);

    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mesh = child as THREE.Mesh;
        const materialName = (mesh.material as THREE.Material).name || mesh.name;
        const textureData = texturesConfig[materialName];

        if (textureData) {
          mesh.material = this.applyTextureToMaterial(mesh.material as THREE.Material, textureData, loadedTextures);
        }
      }
    });
  }

  loadTexture(path: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.flipY = false;
          texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  applyTextureToMaterial(material: THREE.Material, textureData: any, loadedTextures: Record<string, THREE.Texture>): THREE.Material {
    let standardMaterial: THREE.MeshStandardMaterial;

    if (!(material instanceof THREE.MeshStandardMaterial)) {
      standardMaterial = new THREE.MeshStandardMaterial({
        color: (material as any).color || 0xffffff,
        transparent: material.transparent,
        opacity: material.opacity,
        side: material.side
      });
    } else {
      standardMaterial = material;
    }

    if (textureData.map && loadedTextures[textureData.map]) {
      standardMaterial.map = loadedTextures[textureData.map];
      standardMaterial.needsUpdate = true;
    }

    if (textureData.normalMap && loadedTextures[textureData.normalMap]) {
      standardMaterial.normalMap = loadedTextures[textureData.normalMap];
      standardMaterial.normalScale = new THREE.Vector2(1, 1);
      standardMaterial.needsUpdate = true;
    }

    if (textureData.roughnessMap && loadedTextures[textureData.roughnessMap]) {
      standardMaterial.roughnessMap = loadedTextures[textureData.roughnessMap];
      standardMaterial.roughness = 1.0;
      standardMaterial.needsUpdate = true;
    }

    if (textureData.metalnessMap && loadedTextures[textureData.metalnessMap]) {
      standardMaterial.metalnessMap = loadedTextures[textureData.metalnessMap];
      standardMaterial.metalness = 1.0;
      standardMaterial.needsUpdate = true;
    }

    if (textureData.aoMap && loadedTextures[textureData.aoMap]) {
      standardMaterial.aoMap = loadedTextures[textureData.aoMap];
      standardMaterial.aoMapIntensity = 1.0;
      standardMaterial.needsUpdate = true;
    }

    return standardMaterial;
  }

  optimizeModel(model: THREE.Object3D) {
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          mesh.geometry.computeBoundingBox();
          mesh.geometry.computeBoundingSphere();
        }

        mesh.frustumCulled = true;
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('Model bounds:', { center, size });
    return { center, size };
  }

  findObjectByName(model: THREE.Object3D, name: string): THREE.Object3D | null {
    let foundObject: THREE.Object3D | null = null;
    model.traverse((child) => {
      if (child.name === name) {
        foundObject = child;
      }
    });
    return foundObject;
  }

  setObjectVisibility(model: THREE.Object3D, objectName: string, visible: boolean) {
    const object = this.findObjectByName(model, objectName);
    if (object) {
      object.visible = visible;
    }
  }

  getObjectNames(model: THREE.Object3D): string[] {
    const names: string[] = [];
    model.traverse((child) => {
      if (child.name) {
        names.push(child.name);
      }
    });
    return names;
  }
}