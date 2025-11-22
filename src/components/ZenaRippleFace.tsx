import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface Props {
  imageUrl: string;
  size?: number;
  targetUrl?: string;
}

export default function ZenaRippleFace({
  imageUrl,
  size = 360,
  targetUrl = "/zena-chat",
}: Props) {
  const [hover, setHover] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const scale = useTransform(x, [-80, 80], [1, 1.06]);

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
      onMouseLeave={() => {
        setHover(false);
        x.set(0);
        y.set(0);
      }}
      onMouseEnter={() => setHover(true)}
      onClick={() => (window.location.href = targetUrl)}
    >
      {/* Halo doré */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        animate={{
          opacity: hover ? 0.9 : 0.5,
          scale: hover ? 1.2 : 1,
        }}
        transition={{ duration: 0.6 }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,240,200,0.7), rgba(210,180,140,0.4), transparent)",
        }}
      />

      {/* Effet eau */}
      <motion.div
        className="absolute inset-0 rounded-full mix-blend-soft-light"
        animate={{
          opacity: hover ? [0.2, 0.5, 0.3] : 0.15,
          scale: hover ? [1, 1.03, 1] : 1,
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 60%)",
        }}
      />

      {/* Cercle principal */}
      <div
        className="relative overflow-hidden rounded-full shadow-xl border border-white/30"
        style={{
          width: size,
          height: size,
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
