import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { analyzeEmotion, Emotion } from "@/hooks/useEmotionAnalysis";
import zenaPoster from "@/assets/zena-poster.webp";
import zenaVideo from "@/assets/zena-avatar.mp4";
import zenaImage from "@/assets/zena-avatar.png";

interface ZenaAvatarProps {
  textToSpeak?: string; // texte que Zéna doit dire
}

export default function ZenaAvatar({ textToSpeak = "" }: ZenaAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>("neutral");
  const lastTextRef = useRef<string>("");

  // 🔊 Parle et analyse le ton dès que textToSpeak change
  useEffect(() => {
    // ⚙️ Ne rien faire si texte vide ou identique au précédent
    if (!textToSpeak || textToSpeak === lastTextRef.current) return;

    // Sauvegarde du dernier texte parlé
    lastTextRef.current = textToSpeak;

    // Analyse du ton émotionnel
    const detected = analyzeEmotion(textToSpeak);
    setEmotion(detected);

    // Empêche la double lecture
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }

    // Lance la lecture
    setIsSpeaking(true);
    speakWithZena(textToSpeak)
      .catch((err) => console.warn("Erreur de parole Zéna :", err))
      .finally(() => {
        setIsSpeaking(false);
      });

    // 🧹 Nettoyage si le composant se démonte
    return () => {
      stopSpeaking();
      setIsSpeaking(false);
    };
  }, [textToSpeak]);

  // 🌈 Couleur du halo selon l’émotion détectée
  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full mx-auto select-none text-center overflow-visible"
      style={{ maxHeight: "min(56vh, 520px)" }}
    >
      {/* 💫 Halo émotionnel respirant */}
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? [1, 1.2, 1.1, 1] : [1, 1.05, 1],
          opacity: isSpeaking ? [0.7, 1, 0.9, 0.8] : [0.5, 0.7, 0.5],
          rotate: isSpeaking ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: isSpeaking ? 2 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Cercle pulsant supplémentaire pendant la parole */}
      {isSpeaking && (
        <motion.div
          className={`absolute w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full blur-2xl bg-gradient-to-br ${auraColor}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}

      {/* 🎥 Avatar vidéo */}
      <motion.div
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 bg-[#F2F7F6] overflow-hidden"
        animate={{
          scale: isSpeaking ? [1, 1.05, 1.02, 1] : 1,
          boxShadow: isSpeaking
            ? [
                "0 10px 30px rgba(91, 75, 138, 0.3)",
                "0 20px 60px rgba(79, 209, 197, 0.6)",
                "0 15px 45px rgba(91, 75, 138, 0.4)",
                "0 10px 30px rgba(91, 75, 138, 0.3)",
              ]
            : "0 10px 30px rgba(91, 75, 138, 0.3)",
        }}
        transition={{
          duration: isSpeaking ? 1.5 : 0.3,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
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
            const target = e.currentTarget;
            target.style.display = "none";
            const img = target.parentElement?.querySelector("img");
            if (img) img.style.display = "block";
          }}
        />
        <img
          src={zenaImage}
          alt="ZÉNA"
          className="hidden w-full h-full object-cover rounded-full"
        />
      </motion.div>

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
