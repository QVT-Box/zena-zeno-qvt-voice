import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { analyzeEmotion, Emotion } from "@/hooks/useEmotionAnalysis";
import zenaPoster from "@/assets/zena-poster.webp";
import zenaVideo from "@/assets/zena-avatar.mp4";
import zenaImage from "@/assets/zena-avatar.png";

interface ZenaAvatarProps {
  textToSpeak?: string;
}

export default function ZenaAvatar({ textToSpeak = "" }: ZenaAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const [blink, setBlink] = useState(false); // 👁️ clignement

  // 🔊 Détection de parole et émotion
  useEffect(() => {
    if (textToSpeak) {
      const detected = analyzeEmotion(textToSpeak);
      setEmotion(detected);
      setIsSpeaking(true);
      const timer = setTimeout(() => setIsSpeaking(false), textToSpeak.length * 50);
      return () => clearTimeout(timer);
    }
  }, [textToSpeak]);

  // 👁️ Animation clignement (aléatoire)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // 🎨 Couleurs d’aura selon émotion
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div className="relative flex flex-col items-center justify-center w-full mx-auto select-none text-center overflow-visible">
      {/* 🌫 Halo émotionnel dynamique */}
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? [1, 1.15, 1.05, 1] : [1, 1.03, 1],
          opacity: isSpeaking ? [0.8, 1, 0.9] : [0.5, 0.7, 0.6],
          rotate: isSpeaking ? [0, 5, -5, 0] : [0, 2, -2, 0],
        }}
        transition={{ duration: isSpeaking ? 2 : 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 🫧 Avatar animé */}
      <motion.div
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 overflow-hidden bg-[#F2F7F6]"
        animate={{
          y: isSpeaking ? [0, -4, 0, 2, 0] : [0, 1.5, 0],
          scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
          rotate: isSpeaking ? [0, 1.2, -1.2, 0] : [0, 0.4, -0.4, 0],
        }}
        transition={{
          duration: isSpeaking ? 1.6 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <video
          className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${
            blink ? "opacity-40" : "opacity-100"
          }`}
          src={zenaVideo}
          poster={zenaPoster}
          playsInline
          autoPlay
          muted
          loop
        />
        <img
          src={zenaImage}
          alt="ZÉNA – Avatar IA"
          className={`absolute top-0 left-0 w-full h-full object-cover rounded-full ${
            blink ? "opacity-30" : "opacity-0"
          }`}
        />
      </motion.div>

      {/* 💬 Nom et sous-titre */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-widest">
          ZÉNA
        </h2>
        <p className="text-sm text-[#212121]/80">Votre coach émotionnel bienveillant</p>
      </motion.div>
    </div>
  );
}
