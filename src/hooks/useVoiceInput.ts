import { useEffect, useRef, useState } from "react";

interface UseVoiceInputOptions {
  lang?: "fr-FR" | "en-US" | "auto";
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, detectedLang?: string) => void;
  onError?: (error: string) => void;
}

export function useVoiceInput({
  lang = "fr-FR",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState<"fr" | "en" | "unknown">("unknown");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      onError?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition;
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      console.log("🎤 ZÉNA écoute activée !");
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const text = result?.[0]?.transcript?.trim() || "";
      if (!text) return;

      const isEnglish = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const isFrench = /\b(bonjour|salut|merci|oui|non|comment|ça va)\b/i.test(text);
      if (isEnglish) setDetectedLang("en");
      else if (isFrench) setDetectedLang("fr");
      else setDetectedLang("unknown");

      setTranscript(text);
      if (result.isFinal && text.trim()) {
        console.log("✅ Texte final reconnu :", text);
        onResult?.(text, detectedLang);
        setTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("⚠️ Erreur SpeechRecognition :", event.error);
      setIsListening(false);

      // Relance douce en cas de "aborted"
      if (event.error === "aborted" && !continuous) {
        console.log("🔁 Redémarrage auto de l'écoute…");
        if (restartTimeout.current) clearTimeout(restartTimeout.current);
        restartTimeout.current = setTimeout(() => recognition.start(), 800);
      } else {
        onError?.(event.error);
      }
    };

    recognition.onaudioend = () => {
      console.log("🎧 Fin audio");
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("🔚 Session d’écoute terminée");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      if (restartTimeout.current) clearTimeout(restartTimeout.current);
      recognition.stop();
    };
  }, [lang, continuous, interimResults, onResult, onError, detectedLang]);

  const startListening = async () => {
    try {
      if (!recognitionRef.current) throw new Error("API vocale non initialisée");
      console.log("▶️ Démarrage de l'écoute via SpeechRecognition");
      recognitionRef.current.start();
    } catch (err) {
      console.error("❌ Erreur startListening :", err);
      onError?.("Impossible de démarrer la reconnaissance vocale.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    console.log("🛑 Écoute arrêtée");
  };

  return {
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  };
}
