"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import dotenv from "dotenv";
import applyVideoMaterials from "@/utils/three/applyMaterials";
import { initPostProcessing } from "../../utils/three/PostProcessing";
import { useThreeSceneStore } from "@/stores/ThreeSceneStore";
import { useIntroAnimStore } from "@/stores/IntroAnimStore";
import { loadAndAddArenaModel } from "@/utils/three/Functions/Load/LoadAndAddArenaModel";

dotenv.config();

type ThreeSceneProps = {
  handleUnloadArena: () => void;
  setPlaying: (playing: boolean) => void;
  videos: Videos;
};

let angle = 2.6;
const radius = 30;
const speed = 0.011;

export const ThreeScene = (props: ThreeSceneProps) => {
  const { handleUnloadArena, videos, setPlaying } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleUnload = () => {
    window.location.reload();
    handleUnloadArena();
  };

  const { scene, camera, renderer, arena } = useThreeSceneStore();

  useEffect(() => {
    if (!arena) return;
    if (scene.children.includes(arena.scene)) return;
    console.log("Adding arena model to scene");
    scene.add(arena.scene);
  }, [arena, scene]);

  useEffect(() => {
    useThreeSceneStore.getState().initializeRenderer();
    useThreeSceneStore.getState().resizeScene();
    const postProcessing = initPostProcessing({ renderer, scene, camera });

    const fog = new THREE.Fog(0x000000, 0, 200);
    scene.fog = fog;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.update();

    containerRef.current?.appendChild(renderer.domElement);

    loadAndAddArenaModel();

    const animate = (timestamp: number): void => {
      const time = timestamp * 0.001;
      const deltaTime = time - lastTime;
      lastTime = time;

      if (!useIntroAnimStore.getState().introAnimDone)
        introAnimation(deltaTime);

      if (useThreeSceneStore.getState().animOrbit) orbitCamera(deltaTime);

      postProcessing.composer.render();
      requestAnimationFrame(animate);
    };

    let lastTime = 0;
    requestAnimationFrame(animate);

    const animTarget = 10;
    const startY = camera.position.y;
    const duration = 6000;
    let animationTime = 0;

    function introAnimation(deltaTime: number) {
      const { yClip, clippingPlane } = useIntroAnimStore.getState();

      if (yClip >= 100) {
        controls.enabled = true;
        controls.update();
      }

      if (yClip < 100) updateCamera(deltaTime);

      if (yClip > 30 && yClip < 100) {
        useIntroAnimStore.setState({ yClip: 101 });

        const stdMat = new THREE.MeshLambertMaterial({ color: 0xdd4444 });

        postProcessing.bloomPass.strength = 0;
        const { arena } = useThreeSceneStore.getState();
        arena?.scene.traverse((child) => {
          (child as THREE.Mesh).material = stdMat;
          if (arena)
            applyVideoMaterials({
              gltf: arena,
              iceVideoRef: videos.ice.ref,
              bigmapVideoRef: videos.bigMap.ref,
            });

          videos.ice.ref.current?.play();
          setPlaying(true);
          useIntroAnimStore.setState({ introAnimDone: true });
        });
      } else {
        if (useThreeSceneStore.getState().arena)
          scene.fog = new THREE.Fog(
            0x000000,
            1 * (yClip * 0.1),
            2 * (yClip * 10)
          );
        const newClip = yClip + 0.01 * deltaTime * 100;
        clippingPlane.constant = newClip;
        useIntroAnimStore.setState({ yClip: newClip, clippingPlane });
      }
    }

    function updateCamera(deltaTime: number) {
      const { yClip } = useIntroAnimStore.getState();
      if (yClip > 15 && camera.position.y > animTarget) {
        animationTime += deltaTime * 1000;
        const t = Math.min(animationTime / duration, 1);
        const smoothT = easeInOutCubic(t);

        const { x, z } = camera.position;
        const newY = startY + (animTarget - startY) * smoothT;
        camera.position.set(x, newY, z);
      }
    }

    function orbitCamera(deltaTime: number) {
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

  return (
    <>
      <div ref={containerRef} />
    </>
  );
};
