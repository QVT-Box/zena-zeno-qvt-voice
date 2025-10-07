import React from "react";

/**
 * 🎞️ Zéna – Avatar animé (vidéo Sora)
 * Affiche la vidéo mp4 générée par Sora avec un halo lumineux réactif.
 */
interface ZenaAvatarProps {
  isSpeaking?: boolean;
}

const ZenaAvatar: React.FC<ZenaAvatarProps> = ({ isSpeaking = false }) => {
  return (
    <div className="relative flex justify-center items-center">
      {/* Halo animé */}
      <div
        className={`absolute w-64 h-64 rounded-full blur-3xl transition-all duration-700 ${
          isSpeaking ? "animate-halo opacity-80 scale-105" : "animate-breathe opacity-60"
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(79,209,197,0.5), rgba(91,75,138,0.3), transparent 70%)",
        }}
      />

      {/* Vidéo Zéna */}
      <video
        src="/src/assets/zena-animated.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-48 h-48 md:w-56 md:h-56 rounded-full shadow-soft border-2 border-white/20 object-cover z-10"
      />

      {/* Nom animé */}
      <h1 className="absolute bottom-[-3rem] text-4xl md:text-5xl font-bold tracking-wide gradient-primary bg-clip-text text-transparent animate-breathe">
        ZÉNA
      </h1>
    </div>
  );
};

export default ZenaAvatar;
