// src/components/ZenaAvatar.tsx
import { motion } from "framer-motion";
import zenaAvatar from "@/assets/zena-avatar.png";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

interface ZenaAvatarProps {
  isSpeaking?: boolean;
  emotion?: "positive" | "neutral" | "negative";
}

export default function ZenaAvatar({ isSpeaking = false, emotion = "neutral" }: ZenaAvatarProps) {
  const audioLevel = useAudioAnalyzer(isSpeaking);

  // Aura émotionnelle selon le ton
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/50 to-teal-400/30"
      : emotion === "negative"
      ? "from-rose-400/50 to-red-400/30"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none">
      {/* Halo d’ambiance */}
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? 1.1 : 1,
          opacity: isSpeaking ? 0.8 : 0.6,
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Avatar principal */}
      <motion.img
        src={zenaAvatar}
        alt="ZÉNA - IA émotionnelle QVT Box"
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/20"
        animate={{
          scale: 1 + audioLevel * 0.05,
          rotate: audioLevel * 3,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
      />

      {/* Nom et tagline */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-widest">
          ZÉNA
        </h2>
        <p className="text-sm text-muted-foreground">La voix qui veille sur vos émotions</p>
      </div>
    </div>
  );
}
