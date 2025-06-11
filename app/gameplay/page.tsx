'use client';

import { useRef, useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from 'three';

type CarProps = {
  position: [number, number, number];
};

function LoaderOverlay({ onFinish }: { onFinish: () => void }) {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onFinish();
      }, 500); // Give a slight delay for smoother transition
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinish]);

  return (
    <div className="loader-screen">
      <div className="loader-content">
        <h2>Loading...</h2>
        <div className="loader-bar">
          <div className="loader-fill" style={{ width: `${progress}%` }} />
        </div>
        <p>{Math.floor(progress)}%</p>
      </div>

     <style jsx>{`
  .loader-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/forza3.jpg') no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 80px;
    z-index: 9999;
    flex-direction: column;
    transition: opacity 0.5s ease;
  }

  .loader-content {
    background: rgba(0, 0, 0, 0);
    padding: 20px 30px;
    border-radius: 12px;
    color: white;
    width: 90%;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .loader-bar {
    width: 100%;
    height: 15px;
    background: #444;
    border-radius: 7.5px;
    overflow: hidden;
    margin: 10px auto;
  }

  .loader-fill {
    height: 100%;
    background: #00cc88;
    transition: width 0.2s ease;
  }

  h2 {
    margin: 0 0 5px 0;
    font-weight: 600;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-weight: 500;
    font-size: 1rem;
  }
`}</style>
    </div>
  );
}

function City() {
  const { scene } = useGLTF("/models/road.glb");
  return <primitive object={scene} />;
}

function Car({ position }: CarProps) {
  const { scene } = useGLTF("/models/car_scene.glb");
  const ref = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(...position);
    }
  });

  return <primitive ref={ref} object={scene} />;
}

function GameScene() {
  const [carPos, setCarPos] = useState<[number, number, number]>([0, 0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setCarPos(([x, y, z]) => {
        switch (e.key) {
          case "ArrowUp": return [x, y, z - 1];
          case "ArrowDown": return [x, y, z + 1];
          case "ArrowLeft": return [x - 1, y, z];
          case "ArrowRight": return [x + 1, y, z];
          default: return [x, y, z];
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {!isLoaded && <LoaderOverlay onFinish={() => setIsLoaded(true)} />}

      <Canvas
        camera={{ position: [0, 10, 20], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <City />
          <Car position={carPos} />
          <OrbitControls />
        </Suspense>
      </Canvas>

      {/* On-screen buttons */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button onClick={() => setCarPos(([x, y, z]) => [x, y, z - 1])}>⬆️</button>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setCarPos(([x, y, z]) => [x - 1, y, z])}>⬅️</button>
          <button onClick={() => setCarPos(([x, y, z]) => [x + 1, y, z])}>➡️</button>
        </div>
        <button onClick={() => setCarPos(([x, y, z]) => [x, y, z + 1])}>⬇️</button>
      </div>
    </div>
  );
}

const NoSSRGameScene = dynamic(() => Promise.resolve(GameScene), { ssr: false });

export default function HomePage() {
  return <NoSSRGameScene />;
}
