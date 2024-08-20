import { create } from 'zustand';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';

interface ThreeSceneStore {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    arena: GLTF | null;
    animOrbit: boolean;
    initializeRenderer: () => void;
    resizeScene: () => void;
}

export const useThreeSceneStore = create<ThreeSceneStore>()((set, get) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(110, 1, 0.1, 1000);
    camera.position.set(-150, 50, 0);
    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.localClippingEnabled = true;

    return {
        scene,
        camera,
        renderer,
        arena: null,
        animOrbit: true,
        initializeRenderer: () => {
            if (typeof window !== 'undefined') {
                const updatedCamera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                );
                updatedCamera.position.set(-150, 50, 0);

                renderer.setPixelRatio(window.devicePixelRatio);

                set({ renderer, camera: updatedCamera });
            }
        },
        resizeScene: () => {
            const { camera, renderer } = get();
            if (camera && renderer && typeof window !== 'undefined') {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }
    };
});