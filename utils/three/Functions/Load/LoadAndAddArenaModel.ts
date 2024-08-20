import { useThreeSceneStore } from "@/stores/ThreeSceneStore";
import { loadModel } from "./LoadModel";
import * as THREE from "three";
import { useIntroAnimStore } from "@/stores/IntroAnimStore";

export const loadAndAddArenaModel = () => {
    if (!process.env.NEXT_PUBLIC_ARENA_MODEL)
        return console.error("Invalid arena model url");

    const url = process.env.NEXT_PUBLIC_ARENA_MODEL;

    const { scene } = useThreeSceneStore.getState();
    const { clippingPlane } = useIntroAnimStore.getState();

    const material = new THREE.MeshBasicMaterial({ color: 0x660000, wireframe: true, clippingPlanes: [clippingPlane] });

    loadModel(url).then((arena) => {
        useThreeSceneStore.setState({ arena });

        arena.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });

        scene.add(arena.scene);
    }).catch((error) => {
        console.error("Failed to load arena model", error);
    });
}