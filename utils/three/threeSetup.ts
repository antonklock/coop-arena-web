import * as THREE from "three";

const threeSetup = (containerRef: React.RefObject<HTMLDivElement>) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // Position camera to look at the origin
    camera.position.set(-25, 8, 0);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);
    camera.position.z = 5;

    return { scene, camera, renderer };
};

export default threeSetup;