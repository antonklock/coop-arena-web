import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

export const applyMaterialToGltf = (gltf: GLTF, material: THREE.Material) => {
    gltf.scene.traverse((child) => {
        (child as THREE.Mesh).material = material;
    });
}