// src/components/ZenaFaceParticles.tsx
import React, { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type FacePointsProps = {
  intensity?: number;
};

function FacePoints({ intensity = 1 }: FacePointsProps) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/zena-face-base.png";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const targetWidth = 220;
      const ratio = img.height / img.width;
      canvas.width = targetWidth;
      canvas.height = targetWidth * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const step = 4;
      const pts: number[] = [];

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const i = (y * canvas.width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 40) continue;

          const brightness = (r + g + b) / 3;
          if (brightness < 40) continue;

          const nx = (x / canvas.width) * 2 - 1;
          const ny = -(y / canvas.height) * 2 + 1;
          const nz = ((255 - brightness) / 255) * 0.4 * intensity;

          pts.push(nx, ny, nz);
        }
      }

      setPositions(new Float32Array(pts));
    };
  }, [intensity]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    pointsRef.current.rotation.x = Math.cos(t * 0.15) * 0.15;
  });

  if (!positions) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color="#FFEFD2"
        transparent
        opacity={0.96}
      />
    </points>
  );
}

function GlowDisc() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1.05 + Math.sin(t * 0.8) * 0.03;
    meshRef.current.scale.set(s, s, s);
  });

  return (
    <mesh ref={meshRef}>
      <circleGeometry args={[1.15, 80]} />
      <meshBasicMaterial
        color={"#F5D9AE"}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function ParticlesScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 3, 4]} intensity={1.2} color={"#FFD59A"} />
      <group rotation={[0, 0.2, 0]}>
        <GlowDisc />
        <FacePoints intensity={1.1} />
      </group>
    </>
  );
}

const ZenaFaceParticles: React.FC = () => {
  return (
    <div className="relative w-full max-w-[320px] aspect-square rounded-full shadow-[0_40px_120px_rgba(124,88,36,0.55)]">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_0%,#FFF7EB_0%,#F5D4A6_40%,#BFA4FF_90%)] opacity-80" />
      <div className="pointer-events-none absolute inset-[10%] rounded-full border border-white/80 shadow-[0_0_60px_rgba(255,255,255,0.8)]" />

      <Canvas
        camera={{ position: [0, 0, 2.4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="rounded-full"
      >
        <color attach="background" args={["#00000000"]} />
        <ParticlesScene />
      </Canvas>
    </div>
  );
};

export default ZenaFaceParticles;
