import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CoopArenaGLTF from "./models/CoopArenaGLTF";

type SceneProps = {
  iceVideoRef: React.RefObject<HTMLVideoElement>;
  upperCubeRef: React.RefObject<HTMLVideoElement>;
  lowerCubeRef: React.RefObject<HTMLVideoElement>;
  a7Ref: React.RefObject<HTMLVideoElement>;
};

export function Scene(props: SceneProps) {
  const { iceVideoRef, upperCubeRef, lowerCubeRef, a7Ref } = props;
  return (
    <Canvas color={undefined} autoFocus={false}>
      <PerspectiveCamera makeDefault position={[0, 14, -35]} fov={90} />
      <OrbitControls />
      <CoopArenaGLTF
        iceVideoRef={iceVideoRef}
        upperCubeRef={upperCubeRef}
        lowerCubeRef={lowerCubeRef}
        a7Ref={a7Ref}
      />
      <pointLight
        visible={true}
        args={[undefined, 100, 0, 1.58]}
        position={[1.2, 0.96, 0.96]}
        scale={2}
      />
    </Canvas>
  );
}
