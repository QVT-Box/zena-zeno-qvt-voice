import { motion } from "framer-motion";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";
import zenaAvatar from "@/assets/zena-avatar.png";

interface ZenaAvatarProps {
  isSpeaking?: boolean;
  emotion?: "positive" | "neutral" | "negative";
}

export default function ZenaAvatar({ isSpeaking = false, emotion = "neutral" }: ZenaAvatarProps) {
  const audioLevel = useAudioAnalyzer(isSpeaking);

  // 🌈 Couleur du halo selon l’émotion
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none">
      {/* Halo respirant */}
      <motion.div
        className={`absolute w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isSpeaking ? [0.7, 1, 0.8] : [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Lucioles autour */}
      {Array.from({ length: 10 }).map((_, i) => (
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

      {/* Avatar central */}
      <motion.img
        src={zenaAvatar}
        alt="ZÉNA – Avatar IA émotionnelle QVT Box"
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 object-cover"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{
          opacity: 1,
          scale: 1 + audioLevel * 0.05,
          y: 0,
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
      />

      {/* Nom et tagline */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-widest">
          ZÉNA
        </h2>
        <p className="text-sm text-muted-foreground">La voix qui veille sur vos émotions</p>
      </motion.div>
    </div>
  );
}
