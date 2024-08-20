import * as THREE from 'three';
import { useThreeSceneStore } from '@/stores/ThreeSceneStore';

export const addFadePlate = () => {
    const material = new THREE.ShaderMaterial({
        uniforms: {
            opacity: { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position.xy, 0.9999, 1.0);
            }
        `,
        fragmentShader: `
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
            }
        `,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;

    // Add the mesh directly to the scene
    useThreeSceneStore.getState().scene.add(mesh);

    return { mesh, material };
};


export const updateFadePlate = (fadePlate: THREE.Object3D, camera: THREE.Camera) => {
    // Position the fade plate in front of the camera
    camera.getWorldPosition(fadePlate.position);
    camera.getWorldQuaternion(fadePlate.quaternion);

    // Move it slightly in front of the camera
    const offset = new THREE.Vector3(0, 0, -0.1);
    offset.applyQuaternion(fadePlate.quaternion);
    fadePlate.position.add(offset);

    let width, height;

    if (camera instanceof THREE.PerspectiveCamera) {
        const distance = 0.1; // Distance from camera to fade plate
        const vFov = camera.fov * Math.PI / 180; // Convert vertical fov to radians
        height = 2 * Math.tan(vFov / 2) * distance; // Calculate height of the plane
        width = height * camera.aspect; // Calculate width of the plane
    } else if (camera instanceof THREE.OrthographicCamera) {
        width = camera.right - camera.left;
        height = camera.top - camera.bottom;
    } else {
        console.error('Unsupported camera type');
        return;
    }

    // Scale the fade plate to cover the calculated size
    fadePlate.scale.set(width, height, 1);
}

export const fadeToTransparent = (deltaTime: number, fadePlate: THREE.Mesh) => {
    if (fadePlate.material instanceof THREE.ShaderMaterial) {
        const currentOpacity = fadePlate.material.uniforms.opacity.value;
        if (currentOpacity > 0) {
            fadePlate.material.uniforms.opacity.value = Math.max(currentOpacity - deltaTime * 0.25, 0);
            console.log("Fading to transparent: ", fadePlate.material.uniforms.opacity.value);
        } else if (currentOpacity != 0) {
            fadePlate.material.uniforms.opacity.value = 0;
            console.log("Faded to transparent");
        }
        // Ensure the fade plate is visible when opacity > 0
        fadePlate.visible = fadePlate.material.uniforms.opacity.value > 0;
    } else {
        console.error('Material is not ShaderMaterial');
    }
};