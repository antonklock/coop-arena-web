import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CoopArenaGLTF from "./models/CoopArenaGLTF";

type SceneProps = {
  iceVideoRef: React.RefObject<HTMLVideoElement>;
  upperCubeVideoRef: React.RefObject<HTMLVideoElement>;
  lowerCubeVideoRef: React.RefObject<HTMLVideoElement>;
  a7VideoRef: React.RefObject<HTMLVideoElement>;
  yttreOvalVideoRef: React.RefObject<HTMLVideoElement>;
};

export function Scene(props: SceneProps) {
  const {
    iceVideoRef,
    upperCubeVideoRef,
    lowerCubeVideoRef,
    a7VideoRef,
    yttreOvalVideoRef,
  } = props;
  return (
    <Canvas color={undefined} autoFocus={false}>
      <PerspectiveCamera makeDefault position={[0, 14, -35]} fov={90} />
      <OrbitControls />
      <CoopArenaGLTF
        iceVideoRef={iceVideoRef}
        upperCubeVideoRef={upperCubeVideoRef}
        lowerCubeVideoRef={lowerCubeVideoRef}
        a7VideoRef={a7VideoRef}
        yttreOvalVideoRef={yttreOvalVideoRef}
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
