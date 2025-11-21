// src/components/ZenaFaceParticles.tsx

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function FacePoints() {
  const texture = useLoader(THREE.TextureLoader, "/zena-face.png");
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const img = texture.image as HTMLImageElement | HTMLCanvasElement | undefined;
    if (!img) return new Float32Array([]);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = (img as HTMLImageElement).width;
    canvas.height = (img as HTMLImageElement).height;

    if (!ctx) return new Float32Array([]);

    ctx.drawImage(img as CanvasImageSource, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    const tmp: number[] = [];
    const step = 4; // + petit = + de points

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // On garde les pixels "visage" : bons niveaux de lumière + opacité
        const luminance = (r + g + b) / 3;
        if (a > 60 && luminance > 70) {
          const nx = (x / width) * 2 - 1; // -1 à 1
          const ny = -(y / height) * 2 + 1;
          const nz = (1 - luminance / 255) * 0.7; // léger relief

          tmp.push(nx, ny, nz);
        }
      }
    }

    return new Float32Array(tmp);
  }, [texture]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = Math.sin(t * 0.15) * 0.25;
    pointsRef.current.rotation.x = Math.cos(t * 0.1) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        transparent
        color="#FFE6B8"
        opacity={0.95}
      />
    </Points>
  );
}

export default function ZenaFaceParticles() {
  return (
    <div className="relative w-full aspect-square max-w-[360px] mx-auto rounded-full shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden">
      {/* Halo doré autour */}
      <div className="pointer-events-none absolute inset-[-25%] bg-[radial-gradient(circle_at_center,rgba(255,228,186,0.9),transparent_60%)] mix-blend-screen" />

      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 45 }}
        dpr={[1, 2]}
        className="relative"
      >
        <color attach="background" args={["#020008"]} />
        <ambientLight intensity={0.9} />
        <pointLight position={[2, 2, 3]} intensity={18} color="#FFD9A0" />
        <pointLight position={[-2, -2, -3]} intensity={6} color="#A98CFF" />

        <Suspense fallback={null}>
          <FacePoints />
        </Suspense>
      </Canvas>
    </div>
  );
}
