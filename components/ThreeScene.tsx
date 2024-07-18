"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GLTF, OrbitControls } from "three/examples/jsm/Addons.js";
import PlayIntroButton from "./PlayIntroButton";
import dotenv from "dotenv";
import playVideo from "../utils/video/playVideo";
import stopVideo from "../utils/video/stopVideo";
import threeSetup from "../utils/three/threeSetup";
import { initLights } from "../utils/three/initFunctions/addLights";
import applyVideoMaterials from "@/utils/three/applyMaterials";

dotenv.config();

let angle = 100;
const radius = 30;
const speed = 0.0005;

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iceVideoRef = useRef<HTMLVideoElement>(null);
  const bigmapVideoRef = useRef<HTMLVideoElement>(null);
  const yttreOvalVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<THREE.Vector3>(
    new THREE.Vector3()
  );
  const [arena, setArena] = useState<GLTF>();
  const [animOrbit, setAnimOrbit] = useState(true);

  useEffect(() => {
    let controls: OrbitControls;

    const { scene, camera, renderer, loader } = threeSetup(containerRef);

    // COMPOSER / BLOOM PASS
    ///////////////////////////////////
    ///////////////////////////////////

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      3, // strength
      0.5, // radius
      0.01 // threshold
    );
    composer.addPass(bloomPass);

    // CLIPPING PLANE
    ///////////////////////////////////
    ///////////////////////////////////

    renderer.localClippingEnabled = true;

    let yClip = -2;
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), yClip);

    ///////////////////////////////////
    ///////////////////////////////////

    setCameraPosition(camera.position);
    initLights().forEach((light) => scene.add(light));

    let arena: GLTF;

    if (process.env.NEXT_PUBLIC_ARENA_MODEL) {
      loader.load(process.env.NEXT_PUBLIC_ARENA_MODEL, (gltf) => {
        gltf.scene.traverse((child) => {
          const material = new THREE.MeshBasicMaterial({
            color: 0x660000,
            wireframe: true,
            clippingPlanes: [clippingPlane],
          });
          (child as THREE.Mesh).material = material;
        });
        arena = gltf;
        scene.add(arena.scene);
        setArena(arena);
      });
    } else {
      console.error("Failed to load arena model");
    }

    // applyWireframeMaterial();

    const renderScene = () => {
      if (animOrbit) {
        // Update the camera's angle
        angle += speed;

        // Calculate the new camera position
        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);

        // Make the camera look at the center of the scene
        camera.lookAt(0, 0, 0);
      }

      if (yClip > 70 && yClip < 100) {
        yClip = 101;
        arena.scene.traverse((child) => {
          const mat = new THREE.MeshStandardMaterial({ color: 0xdd4444 });
          (child as THREE.Mesh).material = mat;
        });
        bloomPass.strength = 0.25;
      } else {
        yClip += 0.05;
        clippingPlane.constant = yClip;
      }

      composer.render();
      requestAnimationFrame(renderScene);
    };

    renderScene();

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    const handleControlsChange = () => {
      setCameraPosition(camera.position.clone());
    };
    controls.addEventListener("change", handleControlsChange);
    controls.update();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("change", handleControlsChange);
      containerRef.current?.removeChild(renderer.domElement);
      controls.dispose();
      renderer.dispose();
    };
  }, [animOrbit]);

  const handleApplyVideoMaterials = () => {
    if (arena)
      applyVideoMaterials({ gltf: arena, iceVideoRef, bigmapVideoRef });
  };

  useEffect(() => {
    console.log(animOrbit);
  }, [animOrbit]);

  return (
    <>
      <PlayIntroButton
        playing={playing}
        playVideo={() =>
          playVideo({
            iceVideoRef,
            bigmapVideoRef,
            yttreOvalVideoRef,
            setPlaying,
          })
        }
        stopVideo={() =>
          stopVideo({
            iceVideoRef,
            bigmapVideoRef,
            yttreOvalVideoRef,
            setPlaying,
          })
        }
      />
      <button
        style={{
          backgroundColor: "blue",
          color: "white",
          paddingRight: 4,
          paddingLeft: 4,
          paddingTop: 2,
          paddingBottom: 2,
          borderRadius: 4,
        }}
        onClick={() => setAnimOrbit(!animOrbit)}
      >
        {animOrbit ? "No orbit animation" : "Orbit animation"}
      </button>
      <button
        style={{
          backgroundColor: "yellow",
          color: "black",
          paddingRight: 4,
          paddingLeft: 4,
          paddingTop: 2,
          paddingBottom: 2,
          borderRadius: 4,
        }}
        onClick={handleApplyVideoMaterials}
      >
        Apply video materials
      </button>
      <p>
        Camera position:
        {`x: ${cameraPosition.x.toFixed(1)} y: ${cameraPosition.y.toFixed(
          1
        )} z: ${cameraPosition.z.toFixed(1)}`}
      </p>
      <div ref={containerRef} />

      <video
        ref={iceVideoRef}
        style={{ display: "none" }}
        loop={false}
        muted={false}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_ICE_URL}
      ></video>

      <video
        ref={bigmapVideoRef}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_BIGMAP_URL}
      ></video>

      <video
        ref={yttreOvalVideoRef}
        style={{ display: "none" }}
        loop={false}
        muted={true}
        playsInline={true}
        crossOrigin="anonymous"
        src={process.env.NEXT_PUBLIC_YTTRE_OVAL_URL}
      ></video>
    </>
  );
};

export default ThreeScene;
