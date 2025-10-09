import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage: string;
  gender?: "female" | "male";
  language?: "fr-FR" | "en-US";
  selectedLanguage?: "fr-FR" | "en-US";
}

/**
 * 🎙️ VoiceControl – ZÉNA QVT Box
 * -----------------------------------------------------------
 * - Reconnaissance vocale réelle (Web Speech API)
 * - Halo animé QVT Box turquoise/violet
 * - Texte capté en direct
 * - Design doux, professionnel et fluide
 */
export default function VoiceControl({
  onSpeechRecognized,
  isSpeaking,
  currentMessage,
  gender = "female",
  language = "fr-FR",
  selectedLanguage = "fr-FR",
}: VoiceControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // 🎤 Initialisation du micro (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️ Web Speech API non supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    
    console.log("🎤 Reconnaissance vocale initialisée avec la langue:", language);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        newTranscript += event.results[i][0].transcript;
      }
      setTranscript(newTranscript);
      
      // N'envoyer que les résultats finaux (quand l'utilisateur a fini de parler)
      if (event.results[event.results.length - 1].isFinal && newTranscript.trim()) {
        console.log("✅ Texte final capté:", newTranscript.trim());
        onSpeechRecognized(newTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Erreur SpeechRecognition :", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onSpeechRecognized, language]);

  // 🚀 Actions : démarrer / arrêter
  const startListening = async () => {
    if (!recognitionRef.current) {
      console.error("❌ Reconnaissance vocale non disponible");
      alert(selectedLanguage === "fr-FR" 
        ? "❌ La reconnaissance vocale n'est pas disponible sur ce navigateur"
        : "❌ Speech recognition is not available on this browser");
      return;
    }
    
    try {
      // Demander explicitement les permissions du microphone
      console.log("🎤 Demande de permission du microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Permission du microphone accordée");
      
      // Libérer le stream immédiatement (on l'utilise juste pour les permissions)
      stream.getTracks().forEach(track => track.stop());
      
      // Maintenant démarrer la reconnaissance
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
      console.log("🎤 Reconnaissance vocale démarrée");
    } catch (err: any) {
      console.error("❌ Erreur démarrage micro :", err);
      const errorMessage = selectedLanguage === "fr-FR"
        ? `❌ Impossible d'accéder au microphone.\n\nVeuillez autoriser l'accès au microphone dans les paramètres de votre navigateur.\n\nErreur: ${err.message || 'Permission refusée'}`
        : `❌ Cannot access microphone.\n\nPlease allow microphone access in your browser settings.\n\nError: ${err.message || 'Permission denied'}`;
      alert(errorMessage);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
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

        {/* Micro bouton */}
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`relative z-10 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none 
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

      {/* ==== TRANSCRIPTION EN DIRECT ==== */}
      <motion.div
        className="w-full max-w-md min-h-[50px] mt-4 px-4 py-2 bg-white/70 rounded-2xl shadow-inner text-sm text-[#212121]/80 border border-[#EAF4F3]/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {transcript || currentMessage ? (
          <p className="leading-relaxed">
            {transcript || currentMessage}
          </p>
        ) : (
          <p className="italic text-gray-400">Votre voix s’affichera ici...</p>
        )}
      </motion.div>

      {/* ==== ÉTAT DU MICRO ==== */}
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
