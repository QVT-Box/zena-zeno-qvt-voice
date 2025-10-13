import { useEffect, useRef, useState } from "react";

interface UseVoiceInputOptions {
  lang?: "fr-FR" | "en-US" | "auto";
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, detectedLang?: string) => void;
  onError?: (error: string) => void;
}

/**
 * 🎧 useVoiceInput – Hook vocal stable multilingue
 * Corrigé pour Chrome / Safari / Vercel (SSR safe)
 */
export function useVoiceInput({
  lang = "auto",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState<"fr" | "en" | "unknown">("unknown");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // sécurité SSR

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onError?.("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
    recognition.lang = lang === "auto" ? "fr-FR" : lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event: any) => {
      if (!event.results || !event.results[event.resultIndex]) return;

      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0].transcript.trim();

      // Détection automatique de la langue
      const isEnglish = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const isFrench = /\b(bonjour|salut|merci|oui|non|comment|ça va)\b/i.test(text);
      if (isEnglish) setDetectedLang("en");
      else if (isFrench) setDetectedLang("fr");
      else setDetectedLang("unknown");

      setTranscript(text);

      if (lastResult.isFinal) {
        onResult?.(text, detectedLang);
        setTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      console.error("🎤 Erreur SpeechRecognition:", event.error);
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🎧 Fin d'écoute");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [lang, continuous, interimResults, onResult, onError, detectedLang]);

  const startListening = () => {
    try {
      if (!recognitionRef.current) throw new Error("API vocale non initialisée");
      recognitionRef.current.start();
      setIsListening(true);
      console.log("🎤 Démarrage de l'écoute via SpeechRecognition");
    } catch (err) {
      console.error("❌ Erreur startListening :", err);
      onError?.("Impossible de démarrer la reconnaissance vocale.");
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
      console.log("🛑 Écoute arrêtée");
    } catch (err) {
      console.error("❌ Erreur stopListening :", err);
    }
  };

  return {
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  };
}
