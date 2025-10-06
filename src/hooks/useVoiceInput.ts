import { useEffect, useRef, useState } from "react";

interface UseVoiceInputOptions {
  lang?: string; // ex: "fr-FR"
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string) => void;
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
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError?.("La reconnaissance vocale n’est pas supportée sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0].transcript.trim();
      setTranscript(text);

      if (lastResult.isFinal) {
        onResult?.(text);
        setTranscript("");
      }
    };

    recognition.onerror = (event) => {
      onError?.(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [lang, continuous, interimResults, onResult, onError]);

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
    startListening,
    stopListening,
  };
}
