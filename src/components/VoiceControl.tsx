import { useState, useEffect, useMemo } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface VoiceControlProps {
  onSpeechRecognized: (text: string, lang?: string) => void;
  isSpeaking: boolean;
  currentMessage?: string;
  gender: "female" | "male";
}

/**
 * 🎙️ Composant de contrôle vocal multilingue (FR/EN)
 * Zena = voix féminine | Zeno = voix masculine
 */
export const VoiceControl = ({
  onSpeechRecognized,
  isSpeaking,
  currentMessage,
  gender,
}: VoiceControlProps) => {
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 🎤 Hook vocal pour écouter l’utilisateur
  const { transcript, detectedLang, isListening, startListening, stopListening } = useVoiceInput({
    lang: "auto",
    onResult: (text, lang) => onSpeechRecognized(text, lang),
    onError: (err) => console.warn("Erreur vocale :", err),
  });

  // 🎨 Palette de couleur dynamique selon le personnage
  const palette = useMemo(
    () => ({
      primary: gender === "female" ? "#5B4B8A" : "#4B5E8A",
      secondary: gender === "female" ? "#4FD1C5" : "#64B5F6",
      label: gender === "female" ? "ZENA" : "ZENO",
    }),
    [gender]
  );

  // 🧠 Sélection automatique de la voix adaptée (langue + genre)
  useEffect(() => {
    const voices = speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((v) =>
        gender === "female"
          ? v.lang.startsWith(detectedLang === "en" ? "en" : "fr") &&
            /female|woman|femme|Google français/i.test(v.name)
          : v.lang.startsWith(detectedLang === "en" ? "en" : "fr") &&
            /male|man|homme|Google français/i.test(v.name)
      ) ||
      voices.find((v) => v.lang.startsWith(detectedLang === "en" ? "en" : "fr"));

    setSelectedVoice(preferredVoice || null);
  }, [gender, detectedLang]);

  // 🗣️ Lecture du message de Zena ou Zeno
  useEffect(() => {
    if (isSpeaking && currentMessage) {
      const utterance = new SpeechSynthesisUtterance(currentMessage);
      utterance.lang = detectedLang === "en" ? "en-US" : "fr-FR";
      utterance.voice = selectedVoice || null;
      utterance.pitch = gender === "female" ? 1.1 : 0.9;
      utterance.rate = gender === "female" ? 1.05 : 0.95;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  }, [isSpeaking, currentMessage, gender, selectedVoice, detectedLang]);

  // 🎛️ Gestion du micro
  const handleToggle = () => {
    isListening ? stopListening() : startListening();
  };

  const glowColor = isListening
    ? `0 0 40px ${palette.secondary}, 0 0 80px ${palette.primary}80`
    : `0 0 15px ${palette.secondary}50`;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      {/* Bouton principal avec halo animé */}
      <div
        onClick={handleToggle}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full cursor-pointer select-none transition-transform duration-300 ${
          isListening ? "scale-110 animate-breathe" : "scale-100"
        }`}
        style={{
          background: `radial-gradient(circle, ${palette.secondary}40, transparent 70%)`,
          boxShadow: glowColor,
        }}
      >
        {isListening ? (
          <Mic className="w-10 h-10 text-white animate-pulse" />
        ) : (
          <MicOff className="w-10 h-10 text-white/80" />
        )}

        {/* Aura lumineuse */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl ${
            isListening
              ? "animate-pulse-glow opacity-90"
              : "opacity-40 transition-opacity duration-700"
          }`}
          style={{
            background: `linear-gradient(135deg, ${palette.primary}60, ${palette.secondary}60)`,
          }}
        />
      </div>

      {/* Texte d'état */}
      <div className="text-center space-y-1">
        <p
          className={`text-sm font-medium tracking-wide ${
            isListening ? "text-secondary" : "text-muted-foreground"
          }`}
        >
          {isListening
            ? detectedLang === "en"
              ? "I'm listening..."
              : "Je vous écoute..."
            : detectedLang === "en"
            ? `Talk to ${palette.label}`
            : `Parlez à ${palette.label}`}
        </p>
        {transcript && (
          <p className="text-xs text-foreground/70 italic">{`“${transcript}”`}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceControl; // ✅ export par défaut requis par Vercel
