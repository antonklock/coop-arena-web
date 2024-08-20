"use client";

import { Menu } from "@/components/Menu/Menu";
import { StartPage } from "@/components/StartPage/StartPage";
import { ThreeScene } from "@/components/ThreeScene";
import { VideoElements } from "@/components/Videos/VideoElements";
import { useState, useRef, useEffect } from "react";
import CoopArenaScene from "../three/CoopArenaScene";
import { Scene } from "@/src/scene";

export default function Home() {
  const [started, setStarted] = useState(false);
  const fadeElementRef = useRef<HTMLDivElement>(null);
  const [a7Url, setA7Url] = useState("");
  const [iceUrl, setIceUrl] = useState("");
  const [upperCubeUrl, setUpperCubeUrl] = useState("");

  // MAIN MENU //////////////////////////
  const [introAnimDone, setIntroAnimDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const iceVideoRef = useRef<HTMLVideoElement>(null);
  const bigmapVideoRef = useRef<HTMLVideoElement>(null);
  const yttreOvalVideoRef = useRef<HTMLVideoElement>(null);
  //////////////////////////////////////

  const animOrbit = useRef(true);

  const handleStart = () => {
    if (fadeElementRef.current) {
      fadeElementRef.current.classList.add("opacity-0");
      fadeElementRef.current.classList.remove("opacity-100");
    }
    setTimeout(() => {
      setStarted(true);
    }, 1000);
  };

  const handleUnloadArena = () => {
    setStarted(false);
  };

  const setVideoUrls = (ice: string, upperCube: string, a7: string) => {
    setIceUrl(ice);
    setUpperCubeUrl(upperCube);
    setA7Url(a7);
  };

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ICE_URL)
      setIceUrl(process.env.NEXT_PUBLIC_ICE_URL);
  }, []);

  const videos = {
    ice: {
      url: iceUrl,
      ref: iceVideoRef,
    },
    upperCube: {
      url: upperCubeUrl,
      ref: bigmapVideoRef,
    },
    a7: {
      url: a7Url,
      ref: yttreOvalVideoRef,
    },
    bigMap: {
      url: "",
      ref: bigmapVideoRef,
    },
    yttreOval: {
      url: "",
      ref: yttreOvalVideoRef,
    },
  };

  return (
    <>
      {started ? (
        <>
          <Menu
            setVideoUrls={setVideoUrls}
            introAnimDone={introAnimDone}
            playing={playing}
            setPlaying={setPlaying}
            videos={videos}
            animOrbit={animOrbit}
            handleUnload={handleUnloadArena}
          />
          {/* <ThreeScene
            setPlaying={setPlaying}
            setIntroAnimDone={setIntroAnimDone}
            handleUnloadArena={handleUnloadArena}
            videos={videos}
          /> */}

          <div style={{ width: "100vw", height: "100vh" }}>
            {/* <CoopArenaScene /> */}
            <Scene />
          </div>

          <VideoElements videos={videos} />
        </>
      ) : (
        <StartPage handleStart={handleStart} fadeElementRef={fadeElementRef} />
      )}
    </>
  );
}
