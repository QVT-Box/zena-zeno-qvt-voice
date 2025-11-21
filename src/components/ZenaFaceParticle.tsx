// src/components/ZenaFaceParticles.tsx
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

function randomInSphere(radius: number) {
  const v = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2
  ).normalize();
  const r = radius * Math.cbrt(Math.random());
  return v.multiplyScalar(r);
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const count = 5000;
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const v = randomInSphere(1.4);
      array[i * 3] = v.x;
      array[i * 3 + 1] = v.y;
      array[i * 3 + 2] = v.z;
    }

    return array;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.06;
    ref.current.rotation.x += delta * 0.015;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled
      rotation={[0.2, 0.4, 0]}
    >
      <PointMaterial
        transparent
        color="#FBE6B5"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function ZenaFaceParticles() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        {/* fond très sombre, pour le contraste des particules */}
        <color attach="background" args={["#050308"]} />
        <ambientLight intensity={0.5} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
