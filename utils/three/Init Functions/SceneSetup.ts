import * as THREE from 'three';
import { loadModel } from '../Load Functions/LoadModel';
import { applyMaterialToGltf } from '../Material Functions/ApplyMaterialToGLTF';
import { initLights } from './InitLights';

export const sceneSetup = async (scene: THREE.Scene) => {
    if (!process.env.NEXT_PUBLIC_ARENA_MODEL)
        return console.error("Invalid arena model url");

    const url = process.env.NEXT_PUBLIC_ARENA_MODEL;

    const arena = await loadModel(url);
    if (!arena) return console.error("Failed to load arena model");
    scene.add(arena.scene);

    let yClip = -5;
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), yClip);

    applyMaterialToGltf(arena, new THREE.MeshBasicMaterial({
        color: 0x660000,
        wireframe: true,
        clippingPlanes: [clippingPlane]
    }));

    const lights = initLights().forEach((light) => scene.add(light));

    return { arena, clippingPlane, yClip };
}