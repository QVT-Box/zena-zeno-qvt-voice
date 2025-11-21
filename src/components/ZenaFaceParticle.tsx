// src/components/ZenaFaceParticle.tsx
import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  alpha: number;
  alphaOffset: number;
}

const ZenaFaceParticle: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    // Ajuste la taille du canvas
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    resizeCanvas();

    // Image visage ZÉNA utilisée comme "masque"
    const img = new Image();
    img.src = "/zena-face.png"; // ⚠️ adapte le chemin à ton image
    img.crossOrigin = "anonymous";

    const SAMPLE_GAP = 6; // plus petit = plus de particules

    img.onload = () => {
      // On dessine l’image dans un canvas temporaire pour lire les pixels
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      const targetSize = Math.min(width * 0.45, height * 0.7);
      tempCanvas.width = targetSize;
      tempCanvas.height = targetSize;

      tempCtx.drawImage(img, 0, 0, targetSize, targetSize);
      const imageData = tempCtx.getImageData(0, 0, targetSize, targetSize);
      const { data } = imageData;

      const centerX = width * 0.68;
      const centerY = height * 0.48;

      particles = [];

      for (let y = 0; y < targetSize; y += SAMPLE_GAP) {
        for (let x = 0; x < targetSize; x += SAMPLE_GAP) {
          const index = (y * targetSize + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          // On ne garde que les pixels "assez présents"
          if (a > 80) {
            const brightness = (r + g + b) / 3;
            // plus c'est clair, plus on a de chance de créer une particule
            if (brightness > 60 && Math.random() > 0.35) {
              const offsetX = x - targetSize / 2;
              const offsetY = y - targetSize / 2;

              const px = centerX + offsetX;
              const py = centerY + offsetY;

              particles.push({
                x: px + (Math.random() - 0.5) * 30,
                y: py + (Math.random() - 0.5) * 30,
                baseX: px,
                baseY: py,
                radius: 1.4 + Math.random() * 1.2,
                alpha: 0.25 + Math.random() * 0.45,
                alphaOffset: Math.random() * Math.PI * 2,
              });
            }
          }
        }
      }

      animate();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      const time = performance.now() / 1000;

      for (const p of particles) {
        // légère respiration + micro tremblement
        const breathing = Math.sin(time * 1.3 + p.alphaOffset) * 0.8;
        const jitterX = (Math.random() - 0.5) * 0.6;
        const jitterY = (Math.random() - 0.5) * 0.6;

        const x = p.baseX + jitterX;
        const y = p.baseY + jitterY;

        const alpha = p.alpha + breathing * 0.08;

        const gradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          p.radius * 3
        );
        gradient.addColorStop(0, `rgba(243, 229, 171, ${alpha})`); // doré clair
        gradient.addColorStop(0.5, `rgba(237, 211, 158, ${alpha * 0.6})`);
        gradient.addColorStop(1, "rgba(250, 246, 238, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  );
};

export default ZenaFaceParticle;
