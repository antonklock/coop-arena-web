"use client";

import ThreeScene from "@/components/ThreeScene";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  const fadeElementRef = useRef<HTMLDivElement>(null);

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
  return (
    <>
      {started ? (
        <ThreeScene handleUnloadArena={handleUnloadArena} />
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-between p-12">
          <div className="flex flex-1 h-full">
            <div
              ref={fadeElementRef}
              id="fadeElement"
              className="flex flex-col justify-center transition-opacity duration-500 ease-out opacity-100"
            >
              <h1 className="text-4xl font-bold mb-2">LHF Intro 24/25</h1>
              <button
                className="bg-red-800 px-8 py-4 rounded-md hover:bg-red-600"
                onClick={handleStart}
              >
                Load arena
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
