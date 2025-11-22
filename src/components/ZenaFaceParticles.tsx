// src/components/ZenaFaceParticles.tsx

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Nuage de particules autour du visage
 * Version B : ~20 000 particules, fluide mais visuellement riche
 */
function ZenaParticles() {
  const count = 20000;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // petite sphère autour du visage
      const r = 1.2 + Math.random() * 0.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * 0.6; // un peu écrasé, plus "disque"

      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }

    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.8}
        color={new THREE.Color("#FFE6B8")}
      />
    </points>
  );
}

function ZenaFace() {
  const texture = useTexture("/zena-face-base.png");

  return (
    <Float
      speed={1}
      rotationIntensity={0.4}
      floatIntensity={0.5}
      floatingRange={[-0.05, 0.05]}
    >
      <mesh>
        {/* Proportions portrait */}
        <planeGeometry args={[1.4, 1.9]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function ZenaFaceParticles() {
  return (
    <div className="zena-face-wrapper">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 35 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Fond très sombre mais caché par la bulle CSS */}
        <color attach="background" args={["#050505"]} />

        {/* Lumière douce dorée */}
        <ambientLight intensity={0.7} />
        <spotLight
          position={[3, 4, 3]}
          angle={0.5}
          penumbra={0.8}
          intensity={1.6}
          color={"#FFD9A0"}
        />
        <spotLight
          position={[-3, -2, -2]}
          angle={0.6}
          penumbra={0.8}
          intensity={0.8}
          color={"#BBA4FF"}
        />

        <Suspense fallback={null}>
          <ZenaParticles />
          <ZenaFace />
        </Suspense>

        {/* Rotation auto très lente */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}
