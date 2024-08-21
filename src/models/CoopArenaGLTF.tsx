import React, { RefObject, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const url = process.env.NEXT_PUBLIC_ARENA_MODEL as string;

type ArenaScreen = {
  name: string;
  videoElementRef: HTMLVideoElement;
  arenaMesh: THREE.Mesh;
};

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

type CoopArenaGLTFProps = {
  iceVideoRef: React.RefObject<HTMLVideoElement>;
  upperCubeVideoRef: React.RefObject<HTMLVideoElement>;
  lowerCubeVideoRef: React.RefObject<HTMLVideoElement>;
  a7VideoRef: React.RefObject<HTMLVideoElement>;
  yttreOvalVideoRef: React.RefObject<HTMLVideoElement>;
};

export default function CoopArenaGLTF(props: CoopArenaGLTFProps) {
  const arenaGroupRef = useRef<THREE.Group>(null);
  const a7Group = useRef<THREE.Group>(null);
  const iceMesh = useRef<THREE.Mesh>(null);
  const upperCubeMesh = useRef<THREE.Mesh>(null);
  const lowerCubeMesh = useRef<THREE.Mesh>(null);
  const yttreOvalMesh = useRef<THREE.Mesh>(null);

  const { nodes } = useLoader(GLTFLoader, url) as GLTFResult;
  const {
    iceVideoRef,
    upperCubeVideoRef,
    lowerCubeVideoRef,
    a7VideoRef,
    yttreOvalVideoRef,
  } = props;

  // Fix initial rotation
  useEffect(() => {
    if (arenaGroupRef.current) {
      arenaGroupRef.current.rotation.set(0, Math.PI / -2, 0);
    }
  }, []);

  const applyVideoMaterials = (arenaScreens: ArenaScreen[]) => {
    arenaScreens.map((arenaScreen) => {
      if (!arenaScreen.videoElementRef)
        return console.warn(
          `videoElementRef for ${arenaScreen.name} not found!`
        );
      const videoTexture = new THREE.VideoTexture(arenaScreen.videoElementRef);
      videoTexture.format = THREE.RGBFormat;

      const videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
      });

      if (!arenaScreen.arenaMesh)
        return console.warn(`arenaMesh for ${arenaScreen.name} not found!`);
      arenaScreen.arenaMesh.material = videoMaterial;
    });

    handleStartVideo();
  };

  useEffect(() => {
    // if (!iceVideoRef.current)
    //   return console.error("iceVideRef.current not found");
    // if (!upperCubeVideoRef.current)
    //   return console.error("upperCubeRef.current not found");
    // if (!lowerCubeVideoRef.current)
    //   return console.error("lowerCubeRef.current not found");
    // if (!a7Group.current) return console.error("a7Group.current not found");
    // if (!yttreOvalVideoRef.current)
    //   return console.error("yttreOvalVideoRef.current not found");

    // if (iceMesh.current?.type !== "Mesh")
    //   return console.error("iceMesh.current is not a mesh");
    // if (upperCubeMesh.current?.type !== "Mesh")
    //   return console.error("upperCubeMesh.current is not a mesh");
    // if (lowerCubeMesh.current?.type !== "Mesh")
    //   return console.error("lowerCubeMesh.current is not a mesh");
    // if (yttreOvalMesh.current?.type !== "Mesh")
    //   return console.error("yttreOvalMesh.current is not a mesh");

    const arenaScreens = [
      {
        name: "ICE",
        videoElementRef: iceVideoRef.current as HTMLVideoElement,
        arenaMesh: iceMesh.current as THREE.Mesh,
      },
      {
        name: "Upper cube",
        videoElementRef: upperCubeVideoRef.current as HTMLVideoElement,
        arenaMesh: upperCubeMesh.current as THREE.Mesh,
      },
      {
        name: "Lower cube",
        videoElementRef: lowerCubeVideoRef.current as HTMLVideoElement,
        arenaMesh: lowerCubeMesh.current as THREE.Mesh,
      },
      {
        name: "Yttre oval",
        videoElementRef: yttreOvalVideoRef.current as HTMLVideoElement,
        arenaMesh: yttreOvalMesh.current as THREE.Mesh,
      },
    ];

    a7Group.current?.traverse((child) => {
      if (child.type !== "Mesh") return;
      if (!a7VideoRef.current) return;

      const a7ArenaScreen = {
        name: `A7_${child.id}`,
        videoElementRef: a7VideoRef.current,
        arenaMesh: child as THREE.Mesh,
      };

      arenaScreens.push(a7ArenaScreen);
    });

    applyVideoMaterials(arenaScreens);
  });

  const handleStartVideo = () => {
    // if (!iceVideoRef.current) return;
    // if (!upperCubeVideoRef.current) return;
    // if (!lowerCubeVideoRef.current) return;
    // if (!a7VideoRef.current) return;

    iceVideoRef.current?.play();
    upperCubeVideoRef.current?.play();
    lowerCubeVideoRef.current?.play();
    a7VideoRef.current?.play();
    yttreOvalVideoRef.current?.play();
  };

  return (
    <group ref={arenaGroupRef} dispose={null}>
      <group ref={a7Group} dispose={null}>
        <mesh
          name={"A71"}
          castShadow
          receiveShadow
          geometry={nodes.A71.geometry}
          material={nodes.A71.material}
        />
        <mesh
          name={"A72"}
          castShadow
          receiveShadow
          geometry={nodes.A72.geometry}
          material={nodes.A72.material}
        />
        <mesh
          name={"A73"}
          castShadow
          receiveShadow
          geometry={nodes.A73.geometry}
          material={nodes.A73.material}
        />
        <mesh
          name={"A74"}
          castShadow
          receiveShadow
          geometry={nodes.A74.geometry}
          material={nodes.A74.material}
        />
        <mesh
          name={"A75"}
          castShadow
          receiveShadow
          geometry={nodes.A75.geometry}
          material={nodes.A75.material}
        />
        <mesh
          name={"A76"}
          castShadow
          receiveShadow
          geometry={nodes.A76.geometry}
          material={nodes.A76.material}
        />
        <mesh
          name={"A77"}
          castShadow
          receiveShadow
          geometry={nodes.A77.geometry}
          material={nodes.A77.material}
        />
        <mesh
          name={"A78"}
          castShadow
          receiveShadow
          geometry={nodes.A78.geometry}
          material={nodes.A78.material}
        />
        <mesh
          name={"A79"}
          castShadow
          receiveShadow
          geometry={nodes.A79.geometry}
          material={nodes.A79.material}
        />
        <mesh
          name={"A710"}
          castShadow
          receiveShadow
          geometry={nodes.A710.geometry}
          material={nodes.A710.material}
        />
        <mesh
          name={"A711"}
          castShadow
          receiveShadow
          geometry={nodes.A711.geometry}
          material={nodes.A711.material}
        />
      </group>
      <mesh
        name={"A0"}
        castShadow
        receiveShadow
        geometry={nodes.A0.geometry}
        material={nodes.A0.material}
      />
      <mesh
        name={"A6"}
        castShadow
        receiveShadow
        geometry={nodes.A6.geometry}
        material={nodes.A6.material}
      />
      <mesh
        name={"A8"}
        castShadow
        receiveShadow
        geometry={nodes.A8.geometry}
        material={nodes.A8.material}
      />
      <mesh
        name={"A9"}
        castShadow
        receiveShadow
        geometry={nodes.A9.geometry}
        material={nodes.A9.material}
      />
      <mesh
        name={"Chairs"}
        castShadow
        receiveShadow
        geometry={nodes.Chairs.geometry}
        material={nodes.Chairs.material}
      />
      <mesh
        name={"Glass"}
        castShadow
        receiveShadow
        geometry={nodes.Glass.geometry}
        material={nodes.Glass.material}
      />
      <mesh
        name={"ICE"}
        castShadow
        receiveShadow
        geometry={nodes.ICE.geometry}
        material={nodes.ICE.material}
        ref={iceMesh}
      />
      <mesh
        name={"K1"}
        castShadow
        receiveShadow
        geometry={nodes.K1.geometry}
        material={nodes.K1.material}
      />
      <mesh
        name={"K1001"}
        castShadow
        receiveShadow
        geometry={nodes.K1001.geometry}
        material={nodes.K1001.material}
      />
      <mesh
        name={"Lower_cube"}
        castShadow
        receiveShadow
        geometry={nodes.Lower_cube.geometry}
        material={nodes.Lower_cube.material}
        ref={lowerCubeMesh}
      />
      <mesh
        name={"Goal_H"}
        castShadow
        receiveShadow
        geometry={nodes.Goal_H.geometry}
        material={nodes.Goal_H.material}
      />
      <mesh
        name={"Goal_J"}
        castShadow
        receiveShadow
        geometry={nodes.Goal_J.geometry}
        material={nodes.Goal_J.material}
      />
      <mesh
        name={"Oval_inside"}
        castShadow
        receiveShadow
        geometry={nodes.Oval_inside.geometry}
        material={nodes.Oval_inside.material}
      />
      <mesh
        name={"Oval_outside"}
        castShadow
        receiveShadow
        geometry={nodes.Oval_outside.geometry}
        material={nodes.Oval_outside.material}
        ref={yttreOvalMesh}
      />
      <mesh
        name={"Rink"}
        castShadow
        receiveShadow
        geometry={nodes.Rink.geometry}
        material={nodes.Rink.material}
      />
      <mesh
        name={"Skeptrons_Inside"}
        castShadow
        receiveShadow
        geometry={nodes.Skeptrons_Inside.geometry}
        material={nodes.Skeptrons_Inside.material}
      />
      <mesh
        name={"Skeptrons_Outside"}
        castShadow
        receiveShadow
        geometry={nodes.Skeptrons_Outside.geometry}
        material={nodes.Skeptrons_Outside.material}
      />
      <mesh
        name={"Upper_cube"}
        castShadow
        receiveShadow
        geometry={nodes.Upper_cube.geometry}
        material={nodes.Upper_cube.material}
        ref={upperCubeMesh}
      />
      <mesh
        name={"Ceiling"}
        castShadow
        receiveShadow
        geometry={nodes.Ceiling.geometry}
        material={nodes.Ceiling.material}
      />
    </group>
  );
}

if (url) useLoader.preload(GLTFLoader, url);
else console.warn("Can't find arena model. Check import url.");
