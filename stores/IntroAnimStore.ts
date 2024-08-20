import { create } from 'zustand';
import * as THREE from 'three';

interface IntroAnimStore {
    introAnimDone: boolean;
    yClip: number;
    clippingPlane: THREE.Plane;
}

export const useIntroAnimStore = create<IntroAnimStore>()((set) => ({
    introAnimDone: false,
    yClip: 0,
    clippingPlane: new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
}));