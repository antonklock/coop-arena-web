import ThreeScene from "@/components/ThreeScene";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">LHF Intro 24/25</h1>
      <p>Drag camera to orbit and move</p>
      <ThreeScene />
    </main>
  );
}
