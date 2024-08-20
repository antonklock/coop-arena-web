import { GLTFLoader, GLTF } from "three/examples/jsm/Addons.js";

export const loadModel = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {

        loader.load(url, (gltf) => {
            resolve(gltf);
        },
            undefined,
            (error) => {
                reject(error);
            }
        )
    });
}