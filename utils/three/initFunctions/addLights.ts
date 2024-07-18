import * as THREE from 'three';

const addDirectionalLightWithTarget = (lightConfig: { position: THREE.Vector3, color: THREE.Color, castShadow: boolean }, targetConfig: { position: THREE.Vector3 }): { light: THREE.DirectionalLight, target: THREE.Object3D } => {
    const light = new THREE.DirectionalLight(lightConfig.color, 1);
    light.position.set(lightConfig.position.x, lightConfig.position.y, lightConfig.position.z);
    light.castShadow = lightConfig.castShadow;

    const target = new THREE.Object3D();
    target.position.set(targetConfig.position.x, targetConfig.position.y, targetConfig.position.z);
    light.target = target;

    return { light, target };
}

const initLights = (): THREE.DirectionalLight[] => {
    const light01 = addDirectionalLightWithTarget(
        {
            position: new THREE.Vector3(0, 5, 5),
            color: new THREE.Color(0xff4444),
            castShadow: true,
        },
        { position: new THREE.Vector3(0, 0, 0) }
    )
    const light02 = addDirectionalLightWithTarget(
        {
            position: new THREE.Vector3(5, 5, 5),
            color: new THREE.Color(0xdd4444),
            castShadow: true,
        },
        { position: new THREE.Vector3(-5, 0, 0) }
    );

    return [light01.light, light02.light];
}

export { initLights };