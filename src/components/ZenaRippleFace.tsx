// src/components/ZenaRippleFace.tsx

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface Props {
  imageUrl: string;
  size?: number;
  targetUrl?: string;
}

/**
 * ZenaRippleFace
 * - Visage de Zéna dans une bulle dorée
 * - Nuage de poussière lumineuse autour
 * - Effet eau + zoom 3D au survol
 * - Clic : ouvre la page Zéna (zena-chat)
 */
export default function ZenaRippleFace({
  imageUrl,
  size = 360,
  targetUrl = "/zena-chat",
}: Props) {
  const [hover, setHover] = useState(false);

  // valeurs pour l'effet 3D (tilt en fonction de la souris)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-120, 120], [12, -12]);
  const rotateY = useTransform(x, [-120, 120], [-12, 12]);
  const scale = useTransform(x, [-100, 100], [1, 1.06]);

  const handleClick = () => {
    if (!targetUrl) return;
    window.location.href = targetUrl;
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        width: size,
        height: size,
        rotateX,
        rotateY,
        scale,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        x.set(0);
        y.set(0);
      }}
      onClick={handleClick}
    >
      {/* Aura dorée principale */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        animate={{
          opacity: hover ? 0.95 : 0.6,
          scale: hover ? 1.25 : 1.05,
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,236,207,0.95), rgba(214,178,120,0.5), transparent 70%)",
        }}
      />

      {/* Bulle douce autour du visage */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/30"
        animate={{
          opacity: hover ? 1 : 0.8,
          boxShadow: hover
            ? "0 0 40px rgba(255, 220, 160, 0.9)"
            : "0 0 26px rgba(255, 220, 160, 0.55)",
        }}
        transition={{ duration: 0.5 }}
        style={{
          background:
            "radial-gradient(circle at 30% 10%, rgba(255,255,255,0.65), transparent 55%)",
        }}
      />

      {/* Effet eau / reflets internes */}
      <motion.div
        className="absolute inset-0 rounded-full mix-blend-soft-light"
        animate={{
          opacity: hover ? [0.25, 0.55, 0.3] : [0.18, 0.3, 0.2],
          scale: hover ? [1, 1.04, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 70% 80%, rgba(186,148,255,0.55), transparent 60%)",
        }}
      />

      {/* Poussière lumineuse / particules autour */}
      {Array.from({ length: 40 }).map((_, i) => {
        // distribution stable des particules
        const angle = (i / 40) * Math.PI * 2;
        const radius = size * 0.52 + (i % 5) * 4; // autour de la bulle
        const baseX = Math.cos(angle) * radius;
        const baseY = Math.sin(angle) * radius;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + (i % 3),
              height: 4 + (i % 3),
              left: "50%",
              top: "50%",
              x: baseX,
              y: baseY,
              background:
                i % 7 === 0
                  ? "radial-gradient(circle, #ffffff, #ffe9c4)"
                  : "radial-gradient(circle, #ffe9c4, #f1c27d)",
              filter: "blur(0.2px)",
            }}
            animate={{
              opacity: hover
                ? [0.2, 0.8, 0.4]
                : [0.15, 0.6, 0.25],
              y: [baseY, baseY - 6, baseY],
              x: [baseX, baseX + (i % 2 === 0 ? 3 : -3), baseX],
            }}
            transition={{
              duration: 4 + (i % 5) * 0.5,
              repeat: Infinity,
              delay: i * 0.07,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Visage de Zéna */}
      <div
        className="relative overflow-hidden rounded-full shadow-xl"
        style={{
          width: size * 0.86,
          height: size * 0.86,
          left: size * 0.07,
          top: size * 0.07,
        }}
      >
        <img
          src={imageUrl}
          alt="Zéna"
          className="w-full h-full object-cover"
        />
      </div>
    </motion.div>
  );
}
