import { create } from 'zustand';
import * as THREE from 'three';

interface IntroAnimStore {
    yClip: number;
    clippingPlane: THREE.Plane;
}

export const useIntroAnimStore = create<IntroAnimStore>()((set) => ({
    yClip: 0,
    clippingPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
}));