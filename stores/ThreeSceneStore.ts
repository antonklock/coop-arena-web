import { create } from 'zustand';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

interface ThreeSceneStore {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    arena: GLTF | null;
}

export const useThreeSceneStore = create<ThreeSceneStore>()((set) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(-150, 50, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.localClippingEnabled = true;

    const arena = null;

    return { scene, camera, renderer, arena };
});