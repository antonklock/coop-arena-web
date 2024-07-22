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
  const [introAnimDone, setIntroAnimDone] = useState(false);
  const animOrbit = useRef(true);

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
      3,
      0.5,
      0.01
    );
    composer.addPass(bloomPass);

    // CLIPPING PLANE
    ///////////////////////////////////
    ///////////////////////////////////

    let yClip = -3;
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
      if (animOrbit.current) {
        // Update the camera's angle
        angle += speed;

        // Calculate the new camera position
        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);

        // Make the camera look at the center of the scene
        camera.lookAt(0, 3, 0);
      }

      if (yClip > 30 && yClip < 100) {
        yClip = 101;

        let blinkCount = 0;
        const stdMat = new THREE.MeshStandardMaterial({ color: 0xdd4444 });
        const wireMat = new THREE.MeshStandardMaterial({
          color: 0xdd4444,
          wireframe: true,
        });

        const interval = setInterval(() => {
          if (blinkCount === 0) {
            bloomPass.strength = 2;
            blinkCount++;
            arena.scene.traverse((child) => {
              (child as THREE.Mesh).material = stdMat;
            });
          }
          if (blinkCount < 3) {
            if (blinkCount % 2 === 1) {
              arena.scene.traverse((child) => {
                (child as THREE.Mesh).material = wireMat;
              });
              blinkCount++;
            } else {
              arena.scene.traverse((child) => {
                (child as THREE.Mesh).material = stdMat;
              });
              blinkCount++;
            }
          } else {
            bloomPass.strength = 0;
            arena.scene.traverse((child) => {
              (child as THREE.Mesh).material = stdMat;
              if (arena)
                applyVideoMaterials({
                  gltf: arena,
                  iceVideoRef,
                  bigmapVideoRef,
                });

              iceVideoRef.current?.play();
              setPlaying(true);
              setIntroAnimDone(true);
            });
            clearInterval(interval);
          }
        }, 100);
      } else {
        // yClip += 0.05;
        yClip += 0.15;
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
  }, []);

  const handleApplyVideoMaterials = () => {
    if (arena)
      applyVideoMaterials({ gltf: arena, iceVideoRef, bigmapVideoRef });
  };

  return (
    <>
      <PlayIntroButton
        introAnimDone={introAnimDone}
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
          marginTop: 4,
          marginBottom: 32,
        }}
        onClick={() => (animOrbit.current = !animOrbit.current)}
      >
        {animOrbit.current ? "Release camera" : "Orbit animation"}
      </button>
      {/* <button
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
      </button> */}
      {/* <p>
        Camera position:
        {`x: ${cameraPosition.x.toFixed(1)} y: ${cameraPosition.y.toFixed(
          1
        )} z: ${cameraPosition.z.toFixed(1)}`}
      </p> */}
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
