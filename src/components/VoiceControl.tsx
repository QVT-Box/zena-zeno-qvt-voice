import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useEffect } from "react";

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage: string;
  gender?: "female" | "male";
  language?: "fr-FR" | "en-US";
}

/**
 * 🎙️ VoiceControl – ZÉNA QVT Box (version corrigée)
 * -----------------------------------------------------------
 * ✅ Intègre useVoiceInput (SpeechRecognition API)
 * ✅ Fonctionne sur mobile, desktop & PWA
 * ✅ Halo animé (turquoise/violet)
 * ✅ Détection active / arrêt + transcript temps réel
 */
export default function VoiceControl({
  onSpeechRecognized,
  isSpeaking,
  currentMessage,
  gender = "female",
  language = "fr-FR",
}: VoiceControlProps) {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    detectedLang,
  } = useVoiceInput({
    lang: language,
    continuous: false,
    interimResults: true,
    onResult: (text) => {
      if (text.trim()) {
        console.log("✅ Texte reconnu :", text);
        onSpeechRecognized(text.trim());
      }
    },
    onError: (error) => {
      console.error("❌ Erreur de reconnaissance vocale :", error);
      alert("Erreur micro : " + error);
    },
  });

  const handleToggleListening = async () => {
    try {
      if (isListening) {
        console.log("🛑 Arrêt de l'écoute");
        stopListening();
      } else {
        console.log("▶️ Démarrage de l'écoute");
        await startListening();
      }
    } catch (e) {
      console.error("🎤 Erreur au démarrage de l'écoute :", e);
    }
  };

  // 🔍 Debug console pour vérifier l’état de la capture
  useEffect(() => {
    console.log("🎧 Transcript actuel :", transcript);
    console.log("🎧 État d’écoute :", isListening);
    console.log("🌍 Langue détectée :", detectedLang);
  }, [transcript, isListening, detectedLang]);

  // 🌈 Couleur du halo selon le genre de la voix
  const auraColor =
    gender === "female"
      ? "from-[#5B4B8A]/60 to-[#4FD1C5]/40"
      : "from-[#4FD1C5]/60 to-[#5B4B8A]/40";

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full text-center">
      {/* ==== HALO ANIMÉ ==== */}
      <div className="relative flex items-center justify-center">
        {/* Halo lumineux */}
        <motion.div
          className={`absolute w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl bg-gradient-to-br ${auraColor}`}
          animate={{
            scale: isListening ? [1, 1.25, 1] : [1, 1.05, 1],
            opacity: isListening ? [0.8, 1, 0.9] : [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Onde pulsée */}
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

        {/* Bouton principal micro */}
        <motion.button
          onClick={handleToggleListening}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none 
            ${
              isListening
                ? "bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] text-white"
                : "bg-white text-[#005B5F] border border-[#4FD1C5]/40"
            }`}
          animate={{
            scale: isListening ? [1, 1.08, 1] : [1, 0.98, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          aria-label={isListening ? "Arrêter l’écoute" : "Démarrer l’écoute"}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </motion.button>
      </div>

      {/* ==== TRANSCRIPTION EN DIRECT ==== */}
      <motion.div
        className="w-full max-w-md min-h-[50px] mt-4 px-4 py-2 bg-white/80 rounded-2xl shadow-inner text-sm text-[#212121]/80 border border-[#EAF4F3]/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {transcript || currentMessage ? (
          <p className="leading-relaxed">{transcript || currentMessage}</p>
        ) : (
          <p className="italic text-gray-400">Votre voix s’affichera ici...</p>
        )}
      </motion.div>

      {/* ==== STATUT MICRO ==== */}
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
