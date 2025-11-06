import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface ZenaAvatarProps {
  textToSpeak?: string;
  emotion?: "positive" | "neutral" | "negative";
  mouthLevel?: number; // intensité du mouvement de la bouche
}

/**
 *  Avatar animé de ZÉNA (version CSS pure)
 * - Bouge légèrement la bouche pendant la parole
 * - Réagit selon l'émotion détectée
 * - Halo émotionnel doux et respirant
 * - Avatar CSS pur (pas de dépendance vidéo/image)
 */
export default function ZenaAvatar({
  textToSpeak = "",
  emotion = "neutral",
  mouthLevel = 0,
}: ZenaAvatarProps) {
  const mouthRef = useRef<HTMLDivElement>(null);

  //  Couleur du halo selon l'émotion dominante
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  //  Animation labiale (réagit à mouthLevel venant du TTS)
  useEffect(() => {
    if (!mouthRef.current) return;
    const mouth = mouthRef.current;
    mouth.style.transform = `scaleY(${1 + mouthLevel * 0.3})`;
    mouth.style.opacity = `${0.5 + mouthLevel * 0.5}`;
  }, [mouthLevel]);

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full mx-auto select-none text-center overflow-visible"
      style={{ maxHeight: "min(56vh, 520px)" }}
    >
      {/*  Halo émotionnel respirant */}
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/*  Lucioles (symbole de la veille bienveillante) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#4FD1C5] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3 + Math.random() * 0.5,
          }}
          animate={{
            y: [0, -8, 0],
            x: [0, 2 - Math.random() * 4, 0],
            opacity: [0.2, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/*  Avatar CSS pur (cercle avec dégradé) */}
      <motion.div
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 bg-gradient-to-br from-[#5B4B8A] to-[#4FD1C5] overflow-hidden flex items-center justify-center"
        animate={{
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 10px 30px rgba(91, 75, 138, 0.3)",
            "0 15px 40px rgba(79, 209, 197, 0.5)",
            "0 10px 30px rgba(91, 75, 138, 0.3)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Visage simplifié */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Yeux */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 flex gap-8">
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scaleY: [1, 0.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            <motion.div
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                scaleY: [1, 0.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </div>

          {/* Bouche animée */}
          <motion.div
            ref={mouthRef}
            className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[30%] h-[6%] bg-white/80 rounded-full origin-center transition-transform duration-150"
          />
        </div>
      </motion.div>

      {/* 🩵 Nom et tagline */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-widest">
          ZÉNA
        </h2>
        <p className="text-sm text-[#212121]/80">
          La voix qui veille sur vos émotions
        </p>
      </motion.div>
    </div>
  );
}
