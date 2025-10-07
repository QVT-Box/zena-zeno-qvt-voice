import { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useAudioAnalyzer } from "@/hooks/useAudioAnalyzer";

interface UseZenaVoiceOptions {
  lang?: "fr-FR" | "en-US";
  gender?: "female" | "male";
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * 🌿 useZenaVoice
 * -------------------------------------------------------
 * Hook combiné : synthèse vocale + halo émotionnel
 * - Fait parler ZÉNA ou ZÉNO
 * - Anime automatiquement le halo ou les lèvres pendant la parole
 * - Supporte français / anglais
 */
export function useZenaVoice({
  lang = "fr-FR",
  gender = "female",
  rate = gender === "female" ? 1 : 0.95,
  pitch = gender === "female" ? 1.1 : 0.9,
  volume = 1,
}: UseZenaVoiceOptions = {}) {
  const { speak, stop, speaking } = useSpeechSynthesis();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastText, setLastText] = useState<string | null>(null);
  const audioLevel = useAudioAnalyzer(isSpeaking);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsSpeaking(speaking);
  }, [speaking]);

  /**
   * 🔊 Fait parler ZÉNA / ZÉNO
   */
  const say = (text: string, onEnd?: () => void) => {
    if (!text) return;
    clearTimeout(timeoutRef.current);
    setLastText(text);
    setIsSpeaking(true);

    speak({
      text,
      lang,
      gender,
      rate,
      pitch,
      volume,
      onEnd: () => {
        setIsSpeaking(false);
        onEnd?.();
      },
    });

    // Sécurité : forcer la fin après 15s max
    timeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
    }, 15000);
  };

  /**
   * ⏹️ Stoppe la parole immédiatement
   */
  const stopSpeaking = () => {
    stop();
    setIsSpeaking(false);
  };

  return {
    say,
    stopSpeaking,
    isSpeaking,
    audioLevel,
    lastText,
  };
}
