import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import zenaPoster from "@/assets/zena-poster.webp";
import zenaVideo from "@/assets/zena-avatar.mp4";
import zenaImage from "@/assets/zena-avatar.png";

interface ZenaAvatarProps {
  textToSpeak?: string;
  mouthLevel?: number;
  emotion?: "positive" | "neutral" | "negative";
}

export default function ZenaAvatar({
  textToSpeak = "",
  mouthLevel = 0,
  emotion = "neutral",
}: ZenaAvatarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [blink, setBlink] = useState(false);

  // Active le clignement
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textToSpeak) setIsSpeaking(true);
    const timeout = setTimeout(() => setIsSpeaking(false), textToSpeak.length * 50);
    return () => clearTimeout(timeout);
  }, [textToSpeak]);

  const auraColor =
    emotion === "positive"
      ? "from-emerald-300/60 to-teal-300/40"
      : emotion === "negative"
      ? "from-rose-400/60 to-red-400/40"
      : "from-[#5B4B8A]/40 to-[#4FD1C5]/30";

  return (
    <div className="relative flex flex-col items-center justify-center w-full mx-auto text-center overflow-visible">
      <motion.div
        className={`absolute w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : [1, 1.03, 1],
          opacity: isSpeaking ? [0.8, 1, 0.9] : [0.5, 0.7, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full shadow-lg border-4 border-white/10 bg-[#F2F7F6] overflow-hidden"
        animate={{
          y: isSpeaking ? [0, -3, 0, 2, 0] : [0, 1.5, 0],
          scale: isSpeaking ? [1, 1.05, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <video
          className={`w-full h-full object-cover rounded-full ${blink ? "opacity-40" : "opacity-100"}`}
          src={zenaVideo}
          poster={zenaPoster}
          playsInline
          autoPlay
          muted
          loop
        />
        {/* Bouche animée */}
        <motion.div
          className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-16 h-6 bg-[#212121]/40 rounded-full"
          animate={{ scaleY: 1 + mouthLevel * 0.6 }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
          ZÉNA
        </h2>
        <p className="text-sm text-[#212121]/80">Coach émotionnel d’entreprise</p>
      </div>
    </div>
  );
}
