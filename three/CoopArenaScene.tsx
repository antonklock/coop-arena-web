import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";

function CoopArenaScene() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh visible={true} scale={1} rotation={[0, 0, 0]} castShadow={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#1f2eff"} />
      </mesh>
      <mesh
        rotation={[
          0.14276793281313616, 0.15323990832510212, 0.36791540632040465,
        ]}
        scale={1}
        position={[0.72, 1.6, 0]}
      >
        <sphereGeometry args={[1, 0, 1, 1, 1, 1, 1]} />
        <meshStandardMaterial color={"#fa0000"} />
      </mesh>
    </Canvas>
  );
}

const root = document.getElementById("root");

if (root) createRoot(root).render(<CoopArenaScene />);

export default CoopArenaScene;
