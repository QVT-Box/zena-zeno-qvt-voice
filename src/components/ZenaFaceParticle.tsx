import { useEffect, useRef } from "react";

export default function ZenaFaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = 400;
    canvas.height = 400;

    const particles: any[] = [];
    const particleCount = 260;

    // Zones principales du visage à dessiner
    const faceMap = [
      { x: 200, y: 90 },   // front
      { x: 160, y: 160 },  // joue gauche
      { x: 240, y: 160 },  // joue droite
      { x: 200, y: 210 },  // nez
      { x: 200, y: 260 },  // bouche
      { x: 140, y: 120 },  // tempes
      { x: 260, y: 120 },
      { x: 180, y: 140 },  // yeux
      { x: 220, y: 140 }
    ];

    for (let i = 0; i < particleCount; i++) {
      const point = faceMap[Math.floor(Math.random() * faceMap.length)];
      particles.push({
        x: point.x + (Math.random() * 30 - 15),
        y: point.y + (Math.random() * 30 - 15),
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 215, 150, ${p.opacity})`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(240, 200, 120, 0.9)";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded-full shadow-2xl bg-[#F9F5EC]"
      />
    </div>
  );
}
