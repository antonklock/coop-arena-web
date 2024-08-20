import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CoopArenaGLTF from "./models/CoopArenaGLTF";

type SceneProps = {
  iceVideoRef: React.RefObject<HTMLVideoElement>;
};

export function Scene(props: SceneProps) {
  const { iceVideoRef } = props;
  return (
    <Canvas color={undefined} autoFocus={false}>
      <PerspectiveCamera makeDefault position={[-35, 14, 0]} fov={90} />
      <OrbitControls />
      <CoopArenaGLTF iceVideoRef={iceVideoRef} />
      <pointLight
        visible={true}
        args={[undefined, 100, 0, 1.58]}
        position={[1.2, 0.96, 0.96]}
        scale={2}
      />
    </Canvas>
  );
}
