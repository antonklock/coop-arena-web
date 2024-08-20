import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";

const applyVideoMaterials = (props: {
    gltf: GLTF;
    iceVideoRef: React.RefObject<HTMLVideoElement>;
    bigmapVideoRef: React.RefObject<HTMLVideoElement>;
}) => {
    const { gltf, iceVideoRef, bigmapVideoRef } = props;

    console.log("Applying video materials...")

    gltf.scene.traverse((child) => {
        if (child.name === "ICE") {
            // Create a video texture
            if (iceVideoRef.current) {
                const videoTexture = new THREE.VideoTexture(iceVideoRef.current);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                // Create a material with the video texture
                const videoMaterial = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                    wireframe: false,
                });

                // Apply the video material to the object
                (child as THREE.Mesh).material = videoMaterial;

                console.log("ICE material applied");
            } else {
                console.log("ICE video ref is not available");
            }
        }

        if (
            child.name === "K1" ||
            child.name === "A8" ||
            child.name === "A6" ||
            child.name === "A9" ||
            child.name === "A0"
        ) {
            if (bigmapVideoRef.current) {
                const videoTexture = new THREE.VideoTexture(bigmapVideoRef.current);
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                const videoMaterial = new THREE.MeshBasicMaterial({
                    map: videoTexture,
                });

                (child as THREE.Mesh).material = videoMaterial;

                console.log("Bigmap material applied");
            } else {
                console.log("Bigmap video ref is not available");
            }
        }
    });
};

export default applyVideoMaterials;