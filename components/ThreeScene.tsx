"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GLTF, OrbitControls } from "three/examples/jsm/Addons.js";
import dotenv from "dotenv";
import threeSetup from "../utils/three/threeSetup";
import { initLights } from "../utils/three/initFunctions/addLights";
import applyVideoMaterials from "@/utils/three/applyMaterials";

dotenv.config();

type ThreeSceneProps = {
  handleUnloadArena: () => void;
  setPlaying: (playing: boolean) => void;
  setIntroAnimDone: (introAnimDone: boolean) => void;
  videos: Videos;
};

let angle = 2.6;
const radius = 30;
const speed = 0.011;

export const ThreeScene = (props: ThreeSceneProps) => {
  const { handleUnloadArena, videos, setPlaying, setIntroAnimDone } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [arena, setArena] = useState<GLTF>();
  const animOrbit = useRef(true);

  const handleUnload = () => {
    window.location.reload();
    handleUnloadArena();
  };

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
        console.log("deltaTime: ", deltaTime);
        const t = fadeTime / fadeDuration;
        const easedT = easeInOutCubic(t);

        // Start with high density (black) and decrease to 0 (clear)
        // const fogDensity = 0.1 * (1 - easedT);
        const fogDensity = 0.1 - fadeTime / fadeDuration;
        fog.density = fogDensity;
      } else if (fog.density !== 0.00001) {
        fog.density = 0.01;
        console.log("Fog density: ", fog.density);
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
              iceVideoRef: videos.ice.ref,
              bigmapVideoRef: videos.bigMap.ref,
            });

          videos.ice.ref.current?.play();
          // iceVideoRef.current?.play();
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

  return <div ref={containerRef} />;
};
