import { useEffect, useRef, useState } from "react";

interface UseVoiceInputOptions {
  lang?: "fr-FR" | "en-US" | "auto";
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, detectedLang?: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook vocal multilingue (FR/EN)
 * Compatible desktop, mobile et Capacitor
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
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onError?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
    recognition.lang = lang === "auto" ? "fr-FR" : lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0].transcript.trim();

      // Détection simple FR/EN selon les mots clés
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
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [lang, continuous, interimResults, onResult, onError, detectedLang]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      onError?.("Impossible de démarrer la reconnaissance vocale.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return {
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  };
}
