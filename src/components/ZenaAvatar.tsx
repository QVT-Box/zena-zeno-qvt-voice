import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import zenaImg from "@/assets/zena-avatar.png";
import zenoImg from "@/assets/zeno-avatar.png";

interface ZenaAvatarProps {
  gender?: "female" | "male";
  audioLevel?: number; // Reçu depuis useZenaZenoBrain
}

/**
 * 💫 ZenaAvatar
 * ------------------------------------------------------
 * Avatar émotionnel réactif :
 * - Halo lumineux qui pulse au rythme de la voix
 * - Lucioles flottantes (symbole de la bienveillance QVT Box)
 * - Animation de respiration (cohérence cardiaque visuelle)
 */
export default function ZenaAvatar({ gender = "female", audioLevel = 0 }: ZenaAvatarProps) {
  const avatarImage = gender === "female" ? zenaImg : zenoImg;
  const mainColor = gender === "female" ? "#5B4B8A" : "#4FD1C5";
  const accentColor = gender === "female" ? "#4FD1C5" : "#5B4B8A";

  const [fireflies, setFireflies] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const ff = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFireflies(ff);
  }, []);

  return (
    <div className="relative flex justify-center items-center py-8">
      {/* 🌌 Halo animé */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        animate={{
          scale: 1 + audioLevel * 0.2,
          opacity: 0.5 + audioLevel * 0.4,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        style={{
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${accentColor}60, ${mainColor}40, transparent 70%)`,
        }}
      />

      {/* ✨ Lucioles */}
      {fireflies.map((f) => (
        <motion.div
          key={f.id}
          className="absolute w-2 h-2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{
            x: `${f.x}%`,
            y: `${f.y}%`,
            opacity: [0, 1, 0.6, 1, 0],
            scale: [0.5, 1.2, 0.8],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 0 12px ${accentColor}`,
          }}
        />
      ))}

      {/* 🧘 Avatar principal */}
      <motion.img
        src={avatarImage}
        alt={gender === "female" ? "Zéna" : "Zéno"}
        className="relative z-10 rounded-full object-cover w-52 h-52 md:w-64 md:h-64 shadow-[0_0_40px_rgba(91,75,138,0.3)] border-4 border-white/10"
        animate={{
          scale: 1 + audioLevel * 0.05,
          rotate: audioLevel * 3,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
      />

      {/* 🩵 Nom */}
      <div className="absolute bottom-[-3.5rem] text-center">
        <p className="text-xl font-semibold tracking-widest bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-transparent bg-clip-text">
          {gender === "female" ? "ZÉNA" : "ZÉNO"}
        </p>
        <p className="text-sm text-gray-500">La voix qui veille sur vos émotions</p>
      </div>
    </div>
  );
}
