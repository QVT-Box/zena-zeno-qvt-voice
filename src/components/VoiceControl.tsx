import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage: string;
  gender?: "female" | "male";
  language?: "fr-FR" | "en-US";
}

/**
 * 🎙️ VoiceControl – ZÉNA QVT Box
 * -----------------------------------------------------------
 * - Reconnaissance vocale hybride (locale + cloud)
 * - Compatible desktop, mobile et PWA
 * - Design avec halo animé turquoise/violet
 * - Texte capté en direct
 */
export default function VoiceControl({
  onSpeechRecognized,
  isSpeaking,
  currentMessage,
  gender = "female",
  language = "fr-FR",
}: VoiceControlProps) {
  const { isListening, startListening, stopListening } = useVoiceInput({
    lang: language,
    onResult: (text) => {
      if (text.trim()) {
        console.log("🗣️ ZÉNA a entendu :", text);
        onSpeechRecognized(text.trim());
      }
    },
    onError: (err) => {
      console.error("🎤 Erreur micro :", err);
      alert("Erreur microphone : " + err);
    },
  });

  const handleToggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  };

  // 🌈 Couleur du halo selon le genre
  const auraColor =
    gender === "female"
      ? "from-[#5B4B8A]/60 to-[#4FD1C5]/40"
      : "from-[#4FD1C5]/60 to-[#5B4B8A]/40";

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
      {/* ==== HALO ANIMÉ ==== */}
      <div className="relative flex items-center justify-center">
        {/* Halo pulsant */}
        <motion.div
          className={`absolute w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
          animate={{
            scale: isListening ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: isListening ? [0.8, 1, 0.8] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Onde visuelle */}
        {isListening && (
          <motion.div
            className="absolute rounded-full border-2 border-[#4FD1C5]/50 w-24 h-24 md:w-32 md:h-32"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.9, 0.1, 0.9],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Micro bouton */}
        <motion.button
          onClick={handleToggleListening}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none ${
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

      {/* ==== STATUT DU MICRO ==== */}
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
