// src/components/ZenaFaceParticle.tsx
import React, { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";

// --- Shader material : particules du visage de Zéna ---

const FaceParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uColor: new THREE.Color("#F9D48A"), // doré / sable lumineux
  },
  // vertex shader
  /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    // on fait légèrement "respirer" les particules
    vec3 pos = position;
    float wave = sin((position.x + position.y) * 12.0 + uTime * 2.5) * 0.015;
    pos.z += wave;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // taille des particules (plus grande au centre quand ça scintille)
    gl_PointSize = (1.5 + wave * 20.0) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  // fragment shader
  /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    // on utilise la luminosité de l'image pour savoir où garder la particule
    vec4 tex = texture2D(uTexture, vUv);
    float brightness = tex.r * 0.6 + tex.g * 0.3 + tex.b * 0.1;

    // on enlève les points qui ne font pas partie du visage
    if (brightness < 0.25) discard;

    // forme ronde (disque) pour chaque particule
    vec2 p = gl_PointCoord - vec2(0.5);
    float dist = length(p);
    float circleMask = smoothstep(0.5, 0.0, dist);
    if (circleMask <= 0.0) discard;

    // couleur dorée modulée par la luminosité de l'image
    vec3 color = uColor * (0.4 + brightness * 0.9);

    gl_FragColor = vec4(color, circleMask * brightness);
  }
  `
);

extend({ FaceParticleMaterial });

type FaceParticlesProps = {
  textureUrl?: string;
};

function FaceParticles({ textureUrl = "/zena-face.png" }: FaceParticlesProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const texture = useTexture(textureUrl);
  // réglages de la texture pour un rendu propre
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points scale={[1.6, 2.4, 1]}>
      {/* plan de points très dense pour dessiner le visage */}
      <planeGeometry args={[1.6, 2.4, 320, 320]} />
      {/* @ts-ignore – élément JSX custom généré par shaderMaterial */}
      <faceParticleMaterial ref={materialRef} uTexture={texture} />
    </points>
  );
}

// halo doux autour du visage (lumière sable)
function SoftHalo() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 2.4 + Math.sin(t * 0.6) * 0.04;
    meshRef.current.scale.set(scale, scale, 1);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.1, -0.4]}>
      <circleGeometry args={[1.2, 64]} />
      <meshBasicMaterial
        color="#FFDE9E"
        transparent
        opacity={0.3}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

export default function ZenaFaceParticle() {
  return (
    <div
      className="relative w-full h-screen"
      style={{
        background:
          "radial-gradient(circle at 20% 0%, #FFEFCC 0%, #F2C98F 28%, #1B1208 80%, #050308 100%)",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["transparent"]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[1, 2, 3]} intensity={0.8} />
          <FaceParticles />
          <SoftHalo />
        </Suspense>
      </Canvas>

      {/* Optionnel : tu peux overlay ton texte / boutons ici */}
      {/* 
      <div className="pointer-events-none absolute inset-0 flex items-end md:items-center">
        <div className="pointer-events-auto p-6 md:p-12 text-left text-[#1B1A18] max-w-xl">
          <p className="uppercase tracking-[0.25em] text-xs mb-3 text-[#9C7C4A]">
            Zéna, IA attentionnée
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
            Faire jaillir la lumière<br />des cicatrices du quotidien.
          </h1>
        </div>
      </div>
      */}
    </div>
  );
}
