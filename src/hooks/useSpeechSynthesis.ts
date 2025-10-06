import { useEffect, useState, useRef } from "react";

interface SpeakOptions {
  text: string;
  lang?: "fr-FR" | "en-US";
  gender?: "female" | "male";
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

interface UseSpeechSynthesis {
  speak: (options: SpeakOptions) => void;
  stop: () => void;
  speaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
}

/**
 * Hook universel pour la synthèse vocale multilingue
 * - Gère automatiquement les voix masculine/féminine
 * - Support FR/EN
 * - Compatible Web + Capacitor
 */
export function useSpeechSynthesis(): UseSpeechSynthesis {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Chargement des voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = ({
    text,
    lang = "fr-FR",
    gender = "female",
    rate = 1,
    pitch = 1,
    volume = 1,
    onEnd,
  }: SpeakOptions) => {
    if (!text || typeof window === "undefined") return;

    // Nettoyage avant nouvelle lecture
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Sélection automatique de la voix
    const matchingVoice =
      availableVoices.find((v) =>
        gender === "female"
          ? /female|woman|Google français/i.test(v.name) && v.lang.startsWith(lang.slice(0, 2))
          : /male|man|homme|Google français/i.test(v.name) && v.lang.startsWith(lang.slice(0, 2))
      ) ||
      availableVoices.find((v) => v.lang.startsWith(lang.slice(0, 2)));

    utterance.voice = matchingVoice || null;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      onEnd?.();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking, availableVoices };
}
