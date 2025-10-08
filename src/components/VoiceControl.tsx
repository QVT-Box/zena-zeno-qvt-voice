import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage: string;
  gender?: "female" | "male";
}

/**
 * 🎙️ VoiceControl
 * -------------------------------------------------------------
 * Composant d’enregistrement vocal stylisé et animé.
 * - Gère un micro central avec halo lumineux.
 * - Affiche le texte transcrit en temps réel.
 * - Montre une onde visuelle quand ZÉNA écoute.
 */
export default function VoiceControl({
  onSpeechRecognized,
  isSpeaking,
  currentMessage,
  gender = "female",
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);

  // Simule un déclenchement local (en attendant Web Speech API intégrée)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // On pourrait ici appeler startListening() d’un hook SpeechRecognition
    }
  };

  const auraColor =
    gender === "female"
      ? "from-[#5B4B8A]/60 to-[#4FD1C5]/40"
      : "from-[#4FD1C5]/60 to-[#5B4B8A]/40";

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
      {/* ==== HALO ANIMÉ AUTOUR DU MICRO ==== */}
      <div className="relative flex items-center justify-center">
        {/* Halo pulsant */}
        <motion.div
          className={`absolute w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
          animate={{
            scale: isListening ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: isListening ? [0.7, 1, 0.8] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Onde visuelle */}
        {isListening && (
          <motion.div
            className="absolute rounded-full border-2 border-[#4FD1C5]/50 w-24 h-24 md:w-32 md:h-32"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 0.1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icône micro */}
        <motion.button
          onClick={toggleListening}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg transition-all 
            ${
              isListening
                ? "bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] text-white"
                : "bg-white text-[#005B5F] border border-[#4FD1C5]/40"
            }`}
          animate={{
            scale: isListening ? [1, 1.05, 1] : [1, 0.98, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          aria-label={isListening ? "Arrêter l’écoute" : "Démarrer l’écoute"}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </motion.button>
      </div>

      {/* ==== TEXTE TRANSCRIT ==== */}
      <motion.div
        className="w-full max-w-md min-h-[50px] mt-4 px-4 py-2 bg-white/70 rounded-2xl shadow-inner text-sm text-[#212121]/80 border border-[#EAF4F3]/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {currentMessage ? (
          <p className="leading-relaxed">{currentMessage}</p>
        ) : (
          <p className="italic text-gray-400">Votre voix s’affichera ici...</p>
        )}
      </motion.div>

      {/* ==== ÉTAT DE PAROLE ==== */}
      <p className="text-xs text-gray-500 mt-1">
        {isSpeaking
          ? "🔊 ZÉNA parle..."
          : isListening
          ? "🎧 ZÉNA vous écoute..."
          : "Appuyez sur le micro pour parler"}
      </p>
    </div>
  );
}
