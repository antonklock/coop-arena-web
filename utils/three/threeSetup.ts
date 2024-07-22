import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const threeSetup = (containerRef: React.RefObject<HTMLDivElement>) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(-110, 6, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 1.25, window.innerHeight / 1.25);
    containerRef.current?.appendChild(renderer.domElement);
    const loader = new GLTFLoader();
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.localClippingEnabled = true;

    return { scene, camera, renderer, loader };
};

export default threeSetup;