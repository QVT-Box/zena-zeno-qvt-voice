// src/components/ZenaFaceParticles.tsx

import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ZenaFaceParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || containerRef.current.offsetHeight || 520;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Légère lumière ambiante
    const light = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(light);

    // Pour les particules
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];

    const textureLoader = new THREE.TextureLoader();
    const img = new Image();
    img.src = "/zena-face.png"; // -> à placer dans public/
    img.crossOrigin = "anonymous";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let points: THREE.Points | null = null;
    let animationFrameId: number;

    img.onload = () => {
      const scale = 1;
      const baseWidth = 320;
      const baseHeight = (img.height / img.width) * baseWidth;

      canvas.width = baseWidth;
      canvas.height = baseHeight;
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, baseWidth, baseHeight);
      const imageData = ctx.getImageData(0, 0, baseWidth, baseHeight).data;

      // On échantillonne un pixel sur N pour limiter le nombre de points
      const step = 4; // plus petit = plus de particules
      for (let y = 0; y < baseHeight; y += step) {
        for (let x = 0; x < baseWidth; x += step) {
          const idx = (y * baseWidth + x) * 4;
          const r = imageData[idx];
          const g = imageData[idx + 1];
          const b = imageData[idx + 2];
          const a = imageData[idx + 3];

          // luminosité approx
          const brightness = (r + g + b) / 3;

          if (a > 80 && brightness > 60) {
            const nx = x - baseWidth / 2;
            const ny = baseHeight / 2 - y;

            positions.push(nx * scale, ny * scale, (Math.random() - 0.5) * 8);

            // couleur dorée + légère variation
            const color = new THREE.Color("#F2D08A");
            const jitter = (Math.random() - 0.5) * 0.1;
            color.offsetHSL(0, 0, jitter);

            colors.push(color.r, color.g, color.b);
          }
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );

      const material = new THREE.PointsMaterial({
        size: 3.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      // Halo / glow derrière
      const glowGeo = new THREE.SphereGeometry(115, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#F2D08A"),
        transparent: true,
        opacity: 0.12,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.z = -40;
      scene.add(glowMesh);

      let t = 0;

      const animate = () => {
        t += 0.01;

        if (points) {
          const posAttr = points.geometry.getAttribute(
            "position"
          ) as THREE.BufferAttribute;
          const count = posAttr.count;

          for (let i = 0; i < count; i++) {
            const zBase = positions[i * 3 + 2];
            const jitter =
              Math.sin(t * 2 + i * 0.3) * 0.5 + Math.cos(t * 1.5 + i * 0.17) * 0.3;
            posAttr.setZ(i, zBase + jitter);
          }

          posAttr.needsUpdate = true;
          points.rotation.y = Math.sin(t * 0.2) * 0.12;
        }

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    };

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || height;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-b from-[#1A1410] via-[#0F0B08] to-[#050404]"
    >
      {/* petit halo en overlay pour le côté lumineux */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-10 rounded-[40px] border border-[#F2D08A]/20" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#F2D08A]/30 blur-3xl opacity-60" />
      </div>
    </div>
  );
};
