// src/components/ZenaFaceParticles.tsx
import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

function ParticleHalo() {
  const ref = useRef<THREE.Points>(null!);

  // Nuage de points autour du visage
  const positions = useMemo(() => {
    const count = 1500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Point dans une sphère (un peu aplatie pour le visage)
      const r = 1.2 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (r * Math.cos(phi)) * 0.9; // léger aplatissement
      const z = r * Math.sin(phi) * Math.sin(theta) * 0.7;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
      ref.current.rotation.x += delta * 0.04;
    }
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        color="#FFE7B5"
      />
    </Points>
  );
}

export default function ZenaFaceParticles() {
  return (
    <div className="relative w-[260px] h-[260px] md:w-[300px] md:h-[300px]">
      {/* Glow et halo de base */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FCE8B2] via-[#F4D3FF] to-[#F5EFE5] shadow-[0_0_80px_rgba(227,191,140,0.85)]" />

      {/* Canvas 3D des particules */}
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        className="absolute inset-0 !bg-transparent"
      >
        <ambientLight intensity={0.9} />
        <ParticleHalo />
      </Canvas>

      {/* Visage de ZÉNA au centre */}
      <div className="pointer-events-none absolute inset-[18%] rounded-full overflow-hidden border border-white/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* ⚠️ adapte le chemin si ton image a un autre nom */}
        <img
          src="/zena-face.png"
          alt="ZÉNA"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      </div>

      {/* Lueurs de surface */}
      <div className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen opacity-80 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.95),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(194,168,234,0.9),transparent_60%)]" />
    </div>
  );
}
