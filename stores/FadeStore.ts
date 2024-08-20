// import { create } from 'zustand';
// import * as THREE from 'three';

// interface FadeStore {
//     fog: THREE.Fog;
//     fogDensity: number;
//     fadeTime: number;
//     fadeDuration: number;
// }

// export const useFadeStore = create<FadeStore>()((set) => ({
//     fog: new THREE.Fog(0x000000, 0, 0),
//     fogDensity: 0.1,
//     fadeTime: 0,
//     fadeDuration: 100,
// }));

import { create } from 'zustand'
import * as THREE from 'three'

interface Fade {
    mesh: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
    progress: number;
    active: boolean;
    fadeIn: boolean;
    duration: number;
}

interface FadeStore {
    fades: Record<string, Fade>;
    createFade: (id: string, scene: THREE.Scene, camera: THREE.Camera) => void;
    triggerFade: (id: string, fadeIn: boolean, duration?: number) => void;
    updateFades: (deltaTime: number) => void;
}

export const useFadeStore = create<FadeStore>((set, get) => ({
    fades: {},

    createFade: (id: string, scene: THREE.Scene, camera: THREE.Camera) => {
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, -1);
        mesh.visible = false;
        camera.add(mesh);

        set(state => ({
            fades: {
                ...state.fades,
                [id]: { mesh, material, progress: 0, active: false, fadeIn: true, duration: 1 }
            }
        }));
    },

    triggerFade: (id: string, fadeIn: boolean, duration: number = 1) => {
        set(state => {
            const fade = state.fades[id];
            if (fade) {
                fade.mesh.visible = true;
                fade.active = true;
                fade.fadeIn = fadeIn;
                fade.progress = fadeIn ? 0 : 1;
                fade.duration = duration;
            }
            return { fades: { ...state.fades } };
        });
    },

    updateFades: (deltaTime: number) => {
        set(state => {
            const updatedFades = { ...state.fades };
            Object.keys(updatedFades).forEach(id => {
                const fade = updatedFades[id];
                if (fade.active) {
                    fade.progress += (fade.fadeIn ? 1 : -1) * (deltaTime / fade.duration);
                    fade.progress = Math.max(0, Math.min(1, fade.progress));
                    fade.material.opacity = 1 - fade.progress;

                    if ((fade.fadeIn && fade.progress >= 1) || (!fade.fadeIn && fade.progress <= 0)) {
                        fade.active = false;
                        fade.mesh.visible = !fade.fadeIn;
                    }
                }
            });
            return { fades: updatedFades };
        });
    }
}));

export default useFadeStore;