// src/hooks/useVoiceRecognition.ts
import { useEffect, useState } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    const win = window as any;
    const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      if (text) setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.warn("SpeechRecognition error:", event?.error);
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Cannot start recognition:", err);
        setIsListening(false);
      }
    } else {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [isListening]);

  return { isListening, setIsListening, transcript, supported };
}
