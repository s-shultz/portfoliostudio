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
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.fbxLoader = new FBXLoader(this.loadingManager);
    
    this.setupLoadingManager();
  }

  setupLoadingManager() {
    this.loadingManager.onLoad = () => {
      console.log('All assets loaded successfully');
      this.onLoadComplete && this.onLoadComplete();
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(`Loading progress: ${progress.toFixed(1)}% (${url})`);
      this.onLoadProgress && this.onLoadProgress(progress, url);
    };

    this.loadingManager.onError = (url) => {
      console.error(`Failed to load: ${url}`);
      this.onLoadError && this.onLoadError(url);
    };
  }

  async loadSmallOfficeModel(modelPath: string, texturesConfig: Record<string, any> = {}) {
    try {
      let model: THREE.Object3D;
      let animations: THREE.AnimationClip[] = [];
      let cameras: THREE.Camera[] = [];
      let scenes: THREE.Group[] = [];

      // Determine file type and load accordingly
      if (modelPath.endsWith('.glb') || modelPath.endsWith('.gltf')) {
        const gltf = await this.loadGLTF(modelPath);
        model = gltf.scene;
        animations = gltf.animations;
        cameras = gltf.cameras;
        scenes = gltf.scenes;
      } else if (modelPath.endsWith('.fbx')) {
        model = await this.loadFBX(modelPath);
      } else {
        throw new Error('Unsupported model format');
      }

      if (Object.keys(texturesConfig).length > 0) {
        await this.applyTextures(model, texturesConfig);
      }

      this.optimizeModel(model);
      this.scene.add(model);

      return {
        model: model,
        animations: animations,
        cameras: cameras,
        scenes: scenes
      };

    } catch (error) {
      console.error('Error loading model:', error);
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
      this.fbxLoader.load(
        path,
        (object) => resolve(object),
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`FBX loading: ${percent.toFixed(1)}%`);
        },
        (error) => reject(error)
      );
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