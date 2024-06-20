"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";
import PlayIntroButton from "./PlayIntroButton";
import dotenv from "dotenv";

dotenv.config();

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iceVideoRef = useRef<HTMLVideoElement>(null);
  const bigmapVideoRef = useRef<HTMLVideoElement>(null);
  const yttreOvalVideoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Add function that plays the videoRef
  const playVideo = () => {
    if (
      iceVideoRef.current &&
      bigmapVideoRef.current &&
      yttreOvalVideoRef.current
    ) {
      iceVideoRef.current.play();
      bigmapVideoRef.current.play();
      yttreOvalVideoRef.current.play();

      setPlaying(true);
      console.log("Play intro");
    }
  };

  // Add stop video function
  const stopVideo = () => {
    if (
      iceVideoRef.current &&
      bigmapVideoRef.current &&
      yttreOvalVideoRef.current
    ) {
      iceVideoRef.current.pause();
      iceVideoRef.current.currentTime = 0;

      bigmapVideoRef.current.pause();
      bigmapVideoRef.current.currentTime = 0;

      yttreOvalVideoRef.current.pause();
      yttreOvalVideoRef.current.currentTime = 0;

      setPlaying(false);
      console.log("Stop intro");
    }
  };

  useEffect(() => {
    let controls: OrbitControls;

    if (typeof window !== "undefined") {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // Position camera to look at the origin
      camera.position.set(-25, 8, 0);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;

      // Add this inside the useEffect hook after initializing the renderer
      if (typeof window !== "undefined") {
        // Import glb model from /public/models/lhf_2025_arena_01.glb
        const loader = new GLTFLoader();
        let arena;

        if (!process.env.NEXT_PUBLIC_ARENA_MODEL) return;
        loader.load(process.env.NEXT_PUBLIC_ARENA_MODEL, (gltf) => {
          arena = scene.add(gltf.scene);

          // Add materials to the model
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
              });
            }

            // console.log(child.name);
          });

          // Get all the children of the gltf.scene
          gltf.scene.traverse((child) => {
            if (child.name === "ICE") {
              // Create a video texture
              if (iceVideoRef.current) {
                const videoTexture = new THREE.VideoTexture(
                  iceVideoRef.current
                );
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                // Create a material with the video texture
                const videoMaterial = new THREE.MeshBasicMaterial({
                  map: videoTexture,
                });

                // Apply the video material to the object
                (child as THREE.Mesh).material = videoMaterial;
              }
            }

            if (
              child.name === "K1" ||
              child.name === "A8" ||
              child.name === "A6" ||
              child.name === "A9" ||
              child.name === "A0"
            ) {
              if (bigmapVideoRef.current) {
                const videoTexture = new THREE.VideoTexture(
                  bigmapVideoRef.current
                );
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                const videoMaterial = new THREE.MeshBasicMaterial({
                  map: videoTexture,
                });

                (child as THREE.Mesh).material = videoMaterial;
              }
            }

            if (child.name === "Oval_outside") {
              if (yttreOvalVideoRef.current) {
                const videoTexture = new THREE.VideoTexture(
                  yttreOvalVideoRef.current
                );
                videoTexture.minFilter = THREE.LinearFilter;
                videoTexture.magFilter = THREE.LinearFilter;
                videoTexture.format = THREE.RGBFormat;

                const videoMaterial = new THREE.MeshBasicMaterial({
                  map: videoTexture,
                });

                (child as THREE.Mesh).material = videoMaterial;
              }
            }
          });
        });

        // Add a light source
        const light_01 = new THREE.DirectionalLight(0xddffff, 1);
        light_01.position.set(0, 5, 5); // Position above the scene
        light_01.castShadow = true;
        scene.add(light_01);

        // Create a target for light_01
        const target_01 = new THREE.Object3D();
        target_01.position.set(0, 0, 0); // Pointing towards the origin
        scene.add(target_01);
        light_01.target = target_01;

        // Add a light source
        const light_02 = new THREE.DirectionalLight(0xffffdd, 1);
        light_02.position.set(5, 5, 5); // Position above the scene
        light_02.castShadow = true;
        scene.add(light_02);

        // Create a target for light_02
        const target_02 = new THREE.Object3D();
        target_02.position.set(-5, 0, 0); // Pointing towards the opposite side of the origin
        scene.add(target_02);
        light_02.target = target_02;

        // Add shadows
        renderer.shadowMap.enabled = true;

        // Add this function inside the useEffect hook
        const renderScene = () => {
          //   cube.rotation.x += 0.01;
          //   cube.rotation.y += 0.01;
          //   cube.rotation.z += 0.01;
          renderer.render(scene, camera);
          requestAnimationFrame(renderScene);
        };

        // Add orbit controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        // Call the renderScene function to start the animation loop
        renderScene();

        // Anti-aliasing
        renderer.setPixelRatio(window.devicePixelRatio);
      }

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener, animation frame, and renderer when the component is unmounted
      return () => {
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      };
    }
  }, []);

  return (
    <>
      <PlayIntroButton
        playing={playing}
        playVideo={playVideo}
        stopVideo={stopVideo}
      />
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
