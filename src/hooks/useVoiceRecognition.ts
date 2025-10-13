import { useEffect, useRef, useState } from "react";

interface UseVoiceRecognitionProps {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
}

export function useVoiceRecognition({
  lang = "fr-FR",
  continuous = false,
  interimResults = true,
  onResult,
}: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Vérifie compatibilité navigateur
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("❌ SpeechRecognition non supporté sur ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      console.log("🎤 ZÉNA écoute...");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("🛑 Fin d'écoute");
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("⚠️ Erreur SpeechRecognition:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + " ";
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);

      if (onResult) {
        onResult(fullTranscript.trim(), !!finalTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      setIsListening(false);
    };
  }, [lang, continuous, interimResults, onResult]);

  const start = async () => {
    try {
      if (!recognitionRef.current) {
        console.error("⚠️ Recognition non initialisé");
        return;
      }

      console.log("▶️ Démarrage écoute (demande permission micro)...");
      await recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error("🚫 Erreur lors du démarrage de l'écoute:", err);
      setIsListening(false);
    }
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      console.log("🛑 Arrêt manuel de l'écoute");
      setIsListening(false);
    }
  };

  return { isListening, transcript, start, stop };
}
