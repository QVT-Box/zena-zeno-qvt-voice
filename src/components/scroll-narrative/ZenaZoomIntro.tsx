import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

interface ZenaZoomIntroProps {
  onComplete: () => void;
  skipable?: boolean;
}

function Particle({ position, delay }: { position: [number, number, number]; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [target] = useState(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Converge vers le centre après le délai
    if (t > delay) {
      const convergeFactor = Math.min((t - delay) / 1.5, 1);
      meshRef.current.position.lerp(target, convergeFactor * 0.08);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#F5D091" transparent opacity={0.8} />
    </mesh>
  );
}

function ParticleField() {
  const particles = useRef<Array<[number, number, number]>>([]);

  if (particles.current.length === 0) {
    for (let i = 0; i < 500; i++) {
      particles.current.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ]);
    }
  }

  return (
    <>
      {particles.current.map((pos, i) => (
        <Particle key={i} position={pos} delay={0.5 + i * 0.0005} />
      ))}
    </>
  );
}

function ZenaCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    
    // Scale animation
    const scale = Math.min(1 + Math.sin(t * 2) * 0.05, 1.1);
    meshRef.current.scale.set(scale, scale, scale);
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        color="#F5D091"
        emissive="#C89A53"
        emissiveIntensity={0.5}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  );
}

function AnimatedCamera({ onZoomComplete }: { onZoomComplete: () => void }) {
  const [zoomStarted, setZoomStarted] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (t > 0.5 && !zoomStarted) {
      setZoomStarted(true);
    }

    if (zoomStarted) {
      const zoomProgress = Math.min((t - 0.5) / 2, 1);
      const z = THREE.MathUtils.lerp(50, 3.5, zoomProgress);
      state.camera.position.z = z;
      state.camera.updateProjectionMatrix();

      if (zoomProgress >= 1 && t > 3.5) {
        onZoomComplete();
      }
    }
  });

  return null;
}

export default function ZenaZoomIntro({ onComplete, skipable = true }: ZenaZoomIntroProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Timeout de sécurité : forcer la transition après 5 secondes
    const safetyTimer = setTimeout(() => {
      console.warn("Intro timeout - forçage de la transition");
      handleZoomComplete();
    }, 5000);

    // Marquer comme chargé après 100ms
    const loadTimer = setTimeout(() => setIsLoading(false), 100);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  const handleZoomComplete = () => {
    setFadeOut(true);
    setTimeout(onComplete, 500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sandbar-warm-gold text-lg font-medium animate-pulse">
            Chargement de l'expérience...
          </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#F5D091" />
        <ParticleField />
        <ZenaCore />
        <AnimatedCamera onZoomComplete={handleZoomComplete} />
      </Canvas>

      {skipable && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onComplete}
          className="absolute top-8 right-8 px-6 py-3 rounded-full bg-sandbar-warm-gold/20 backdrop-blur-sm text-sandbar-text-light border-2 border-sandbar-warm-gold/40 hover:bg-sandbar-warm-gold/30 hover:border-sandbar-warm-gold/60 transition-all text-sm font-semibold shadow-lg"
        >
          Passer l'intro
        </motion.button>
      )}
    </motion.div>
  );
}
