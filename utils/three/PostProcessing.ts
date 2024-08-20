import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';

type PostProcessingProps = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
};

export const initPostProcessing = (props: PostProcessingProps) => {
    const { renderer, scene, camera } = props;

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        3,
        0.5,
        0.01
    );
    composer.addPass(bloomPass);

    return { composer, renderPass, bloomPass };
}