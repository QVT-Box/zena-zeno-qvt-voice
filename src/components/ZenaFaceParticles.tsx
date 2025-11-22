// src/components/ZenaParticleFace.tsx
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

function ZenaParticlesCloud() {
  const positions = useMemo(() => {
    const count = 2500;
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.1 + Math.random() * 0.6; // anneau autour du visage
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * (Math.PI / 3);

      const x = r * Math.cos(theta) * Math.cos(phi);
      const y = r * Math.sin(phi);
      const z = r * Math.sin(theta) * Math.cos(phi);

      pts[i * 3] = x;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = z;
    }
    return pts;
  }, []);

  return (
    <group>
      <Points positions={positions} stride={3}>
        <PointMaterial
          transparent
          size={0.03}
          depthWrite={false}
          sizeAttenuation
          color="#f7d9a8"
        />
      </Points>
    </group>
  );
}

export default function ZenaParticleFace() {
  return (
    <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px]">
      {/* halo doux en CSS */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FBE9C8] via-[#fef6e8] to-[#e4cfff] shadow-[0_0_80px_rgba(205,160,110,0.5)]" />

      {/* visage de Zéna */}
      <div className="absolute inset-[14%] rounded-full overflow-hidden">
        <img
          src="/zena-face.png"
          alt="ZÉNA"
          className="w-full h-full object-cover"
        />
      </div>

      {/* particules 3D autour */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[2, 2, 2]} intensity={0.7} />
          <Suspense fallback={null}>
            <ZenaParticlesCloud />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.7}
          />
        </Canvas>
      </div>
    </div>
  );
}
