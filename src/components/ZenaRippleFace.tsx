// src/components/ZenaRippleFace.tsx
import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface Props {
  imageUrl: string;
  size?: number;
  targetUrl?: string;
}

export default function ZenaRippleFace({
  imageUrl,
  size = 380,
  targetUrl,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState(false);

  // Mouse ripple
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const scale = useTransform(hover ? 1 : 0, [0, 1], [1, 1.05]);

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const posX = e.clientX - (rect.left + rect.width / 2);
    const posY = e.clientY - (rect.top + rect.height / 2);

    x.set(posX);
    y.set(posY);
  }

  function onClick() {
    if (targetUrl) window.open(targetUrl, "_blank");
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: size,
        height: size,
        perspective: 1000,
      }}
      className="cursor-pointer select-none"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
        }}
        className="relative w-full h-full rounded-full shadow-2xl transition-all"
      >
        {/* Halo or lumineux */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-80"
          style={{
            background:
              "radial-gradient(circle at 60% 30%, #ffe9c7 0%, #d2b48c 60%, #c3a878 100%)",
            filter: "blur(55px)",
          }}
        />

        {/* Cercle principal */}
        <div className="absolute inset-0 rounded-full overflow-hidden border border-[#f8e9c5] shadow-xl">
          <img
            src={imageUrl}
            alt="Zena"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Effet d’eau (ripple) */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
            opacity: hover ? 0.5 : 0,
          }}
          animate={{
            scale: hover ? [1, 1.15, 1] : 1,
          }}
          transition={{
            duration: 1.2,
            repeat: hover ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
