import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export function Scene() {
  return (
    <Canvas color={undefined} autoFocus={false}>
      <OrbitControls />
      <pointLight
        visible={true}
        args={[undefined, 10, 0, 4]}
        position={[1.2, 0.96, 0.96]}
        scale={2}
      />
      <mesh
        castShadow
        receiveShadow
        visible={true}
        frustumCulled={false}
        position={0}
        rotation={[0, 0, 0]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"#8a8a8a"}
          visible={true}
          transparent={true}
        />
      </mesh>
    </Canvas>
  );
}
