// src/hooks/useVoiceRecognition.ts
import { useEffect, useRef, useState } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as any;
    const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Reconnaissance vocale non supportée par ce navigateur.");
      setSupported(false);
      return;
    }

    // Création de l’instance une seule fois
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "fr-FR";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      if (text) setTranscript(text);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.warn("Erreur reconnaissance vocale :", event?.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      // Permet de détecter la fin de la dictée
      setIsListening(false);
    };

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const startListening = () => {
    if (!supported) return;
    if (isListening) return; // évite les doublons
    try {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript("");
    } catch (err) {
      console.warn("Impossible de démarrer la reconnaissance :", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!supported) return;
    try {
      recognitionRef.current?.stop();
      setIsListening(false);
    } catch (err) {
      console.warn("Erreur lors de l’arrêt :", err);
    }
  };

  return {
    isListening,
    transcript,
    supported,
    startListening,
    stopListening,
  };
}
