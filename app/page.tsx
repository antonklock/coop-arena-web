"use client";

import { StartPage } from "@/components/StartPage/StartPage";
import { VideoElements } from "@/components/Videos/VideoElements";
import { useState, useRef, useEffect } from "react";
import { Scene } from "@/src/scene";

export default function Home() {
  const [started, setStarted] = useState(false);
  const fadeElementRef = useRef<HTMLDivElement>(null);
  const iceVideoRef = useRef<HTMLVideoElement>(null);
  const bigmapVideoRef = useRef<HTMLVideoElement>(null);
  const upperCubeVideoRef = useRef<HTMLVideoElement>(null);
  const lowerCubeVideoRef = useRef<HTMLVideoElement>(null);
  const yttreOvalVideoRef = useRef<HTMLVideoElement>(null);
  const a7Ref = useRef<HTMLVideoElement>(null);

  const handleStart = () => {
    if (fadeElementRef.current) {
      fadeElementRef.current.classList.add("opacity-0");
      fadeElementRef.current.classList.remove("opacity-100");
    }
    setTimeout(() => {
      setStarted(true);
    }, 1000);
  };
  const videos = {
    ice: iceVideoRef,
    upperCube: upperCubeVideoRef,
    lowerCube: lowerCubeVideoRef,
    a7: a7Ref,
    bigMap: bigmapVideoRef,
    yttreOval: yttreOvalVideoRef,
  };

  return (
    <>
      {started ? (
        <>
          <div style={{ width: "100vw", height: "100vh" }}>
            <Scene
              iceVideoRef={iceVideoRef}
              upperCubeVideoRef={upperCubeVideoRef}
              lowerCubeVideoRef={lowerCubeVideoRef}
              a7VideoRef={a7Ref}
              yttreOvalVideoRef={yttreOvalVideoRef}
            />
          </div>

          <VideoElements videos={videos} />
        </>
      ) : (
        <StartPage handleStart={handleStart} fadeElementRef={fadeElementRef} />
      )}
    </>
  );
}
