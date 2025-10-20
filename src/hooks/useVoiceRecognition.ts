import { useEffect, useState } from "react";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>("");

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Reconnaissance vocale non supportée par ce navigateur");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Erreur SpeechRecognition:", event.error);
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
        console.log("🎙️ Micro activé...");
      } catch (err) {
        console.warn("Impossible de démarrer la reconnaissance :", err);
      }
    } else {
      recognition.stop();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening]);

  return { isListening, setIsListening, transcript };
}
