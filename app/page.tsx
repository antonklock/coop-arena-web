"use client";

import ThreeScene from "@/components/ThreeScene";
import { useState } from "react";

export default function Home() {
  const [started, setStarted] = useState(false);
  return (
    <>
      {started ? (
        <div className="flex min-h-screen flex-col items-center justify-between p-12">
          <h1 className="text-4xl font-bold">LHF Intro 24/25</h1>
          <p>Drag camera to orbit and move</p>
          <ThreeScene />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-between p-12">
          <div className="flex flex-1 h-full">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-2">LHF Intro 24/25</h1>
              <button
                className="bg-red-800 px-8 py-4 rounded-md hover:bg-red-600"
                onClick={() => setStarted(true)}
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
