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
import { SettingsMenu } from "./SettingsMenu";

dotenv.config();

type ThreeSceneProps = {
  handleUnloadArena: () => void;
};

let angle = 2.6;
const radius = 30;
const speed = 0.011;

const ThreeScene = (props: ThreeSceneProps) => {
  const { handleUnloadArena } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const iceVideoRef = useRef<HTMLVideoElement>(null);
  const bigmapVideoRef = useRef<HTMLVideoElement>(null);
  const yttreOvalVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [arena, setArena] = useState<GLTF>();
  const [introAnimDone, setIntroAnimDone] = useState(false);
  const animOrbit = useRef(true);
  const [iceUrl, setIceUrl] = useState("");
  const [upperCubeUrl, setUpperCubeUrl] = useState("");
  const [a7Url, setA7Url] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // Show settings menu
  const [showSettings, setShowSettings] = useState(false);

  const setVideoUrls = (ice: string, upperCube: string, a7: string) => {
    setIceUrl(ice);
    setUpperCubeUrl(upperCube);
    setA7Url(a7);
  };

  const handleUnload = () => {
    window.location.reload();
    handleUnloadArena();
  };

  useEffect(() => {
    let controls: OrbitControls;

    if (process.env.NEXT_PUBLIC_ICE_URL)
      setIceUrl(process.env.NEXT_PUBLIC_ICE_URL);

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

    let yClip = -5;
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), yClip);

    ///////////////////////////////////
    ///////////////////////////////////

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

    const fog = (scene.fog = new THREE.FogExp2(0x000000, 0.1));

    let fadeTime = 0;
    const fadeDuration = 100;

    const animate = (timestamp: number): void => {
      const time = timestamp * 0.001;
      const deltaTime = time - lastTime;
      lastTime = time;

      // Update fade
      if (fadeTime < fadeDuration) {
        fadeTime += deltaTime * 40;
        const t = fadeTime / fadeDuration;
        const easedT = easeInOutCubic(t);

        // Start with high density (black) and decrease to 0 (clear)
        const fogDensity = 0.1 * (1 - easedT);
        console.log("fogDensity: ", fogDensity);
        fog.density = fogDensity;
      }

      if (animOrbit.current) {
        // Update the camera's angle
        angle += speed * deltaTime;

        // Reset the angle when it reaches 2*PI
        if (angle > 2 * Math.PI) {
          angle = 0;
          console.log("Resetting angle");
          console.log("speed: ", speed);
        }

        // Calculate the new camera position
        camera.position.x = radius * Math.cos(angle);
        camera.position.z = radius * Math.sin(angle);

        // Make the camera look at the center of the scene
        camera.lookAt(0, 3, 0);
      }

      if (yClip > 30 && yClip < 100) {
        yClip = 101;

        const stdMat = new THREE.MeshLambertMaterial({ color: 0xdd4444 });

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
      } else {
        yClip += 0.01 * deltaTime * 300;
        clippingPlane.constant = yClip;
      }

      if (yClip < 100) updateCamera(deltaTime);

      if (yClip >= 100 && !controls) {
        // Add orbit controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
      }

      composer.render();
      requestAnimationFrame(animate);
    };

    let lastTime = 0;
    requestAnimationFrame(animate);

    const animTarget = 10;
    const startY = camera.position.y;
    const duration = 6000;
    let animationTime = 0;

    function updateCamera(deltaTime: number) {
      if (yClip > 15 && camera.position.y > animTarget) {
        animationTime += deltaTime * 1000;
        const t = Math.min(animationTime / duration, 1);
        const smoothT = easeInOutCubic(t);

        const { x, z } = camera.position;
        const newY = startY + (animTarget - startY) * smoothT;
        camera.position.set(x, newY, z);
      }
    }

    function easeInOutCubic(t: number): number {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      scene.clear();
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, []);

  const handleApplyVideoMaterials = () => {
    if (arena)
      applyVideoMaterials({ gltf: arena, iceVideoRef, bigmapVideoRef });
  };

  return (
    <>
      <div
        style={showMenu ? { backgroundColor: "#121212", borderRadius: 10 } : {}}
        className="absolute top-[2%] right-[2%] flex flex-col justify-end items-end gap-3"
      >
        <div
          onClick={() => setShowMenu(!showMenu)}
          className="flex flex-col gap-1 justify-center items-center w-10 h-10 m-4 rounded-full bg-red-600 border-2 border-red-200 opacity-75 hover:opacity-100 drop-shadow-xl"
        >
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
          <div className="w-5 h-[3px] bg-red-200 rounded-full"></div>
        </div>
        {showMenu ? (
          <>
            <div className="flex flex-col justify-start m-4">
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
                }}
                onClick={() => (animOrbit.current = !animOrbit.current)}
              >
                {animOrbit.current ? "Release camera" : "Orbit animation"}
              </button>
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
                }}
                onClick={() => setShowSettings(!showSettings)}
              >
                Settings
              </button>
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
                }}
                onClick={handleUnload}
              >
                Unload arena
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <SettingsMenu
        setShowMenu={setShowSettings}
        showMenu={showSettings}
        setUrls={setVideoUrls}
        currentA7Url={a7Url}
        currentIceUrl={iceUrl}
        currentUpperCubeUrl={upperCubeUrl}
      />

      <div ref={containerRef} />

      <video
        ref={iceVideoRef}
        style={{ display: "none" }}
        loop={false}
        muted={false}
        playsInline={true}
        crossOrigin="anonymous"
        src={iceUrl}
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
