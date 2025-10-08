import { motion } from "framer-motion";
import zenaPoster from "@/assets/zena-poster.webp";
import zenaVideo from "@/assets/zena-avatar.mp4";
import zenaImage from "@/assets/zena-avatar.png";

interface ZenaAvatarProps {
  isSpeaking?: boolean;
  emotion?: "positive" | "neutral" | "negative";
}

export default function ZenaAvatar({
  isSpeaking = false,
  emotion = "neutral",
}: ZenaAvatarProps) {
  // 🌈 Couleur du halo selon l’émotion
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div
      className="relative flex flex-col items-center justify-center
                 w-full mx-auto select-none text-center overflow-visible"
      style={{ maxHeight: "min(56vh, 520px)" }}
    >
      {/* Halo émotionnel respirant */}
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isSpeaking ? [0.7, 1, 0.8] : [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Lucioles animées */}
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

      {/* 🎥 Avatar vidéo animé avec fallback image */}
      <div
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 bg-[#F2F7F6] overflow-hidden"
      >
        <video
          className="w-full h-full object-cover rounded-full"
          src={zenaVideo}
          poster={zenaPoster}
          playsInline
          autoPlay
          muted
          loop
          preload="auto"
          onError={(e) => {
            // fallback vers l’image si la vidéo échoue
            const target = e.currentTarget;
            target.style.display = "none";
            const img = target.parentElement?.querySelector("img");
            if (img) img.style.display = "block";
          }}
        />
        <img
          src={zenaImage}
          alt="ZÉNA – Avatar IA émotionnelle QVT Box"
          className="hidden w-full h-full object-cover rounded-full"
        />
      </div>

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
        <p className="text-sm text-[#212121]/80">
          La voix qui veille sur vos émotions
        </p>
      </motion.div>
    </div>
  );
}
