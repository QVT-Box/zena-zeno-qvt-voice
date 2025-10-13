import { useState, useRef } from "react";

interface UseVoiceInputOptions {
  lang?: "fr-FR" | "en-US";
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}

/**
 * ✅ Hook de reconnaissance vocale robuste
 * - Compatible desktop, mobile, iOS PWA
 * - Fallback automatique vers Supabase Whisper si le navigateur ne supporte pas SpeechRecognition
 */
export function useVoiceInput({
  lang = "fr-FR",
  onResult,
  onError,
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = async () => {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        console.warn("⚠️ SpeechRecognition non supporté — fallback cloud activé");
        return await startCloudListening();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript.trim();
        if (text) onResult?.(text);
      };

      recognition.onerror = (event: any) => {
        console.error("🎙️ SpeechRecognition error:", event.error);
        onError?.(event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("❌ Erreur démarrage micro:", error);
      onError?.("Impossible d’activer le micro. Vérifie les autorisations.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // ☁️ Fallback : envoi audio vers Supabase Whisper
  const startCloudListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          const resp = await fetch(
            "https://mahmakmfonycckirgtwm.supabase.co/functions/v1/speech-to-text",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                audio: base64Audio,
                mimeType: "audio/webm",
              }),
            }
          );

          const data = await resp.json();
          if (data.text) onResult?.(data.text);
          else onError?.("Aucune parole détectée.");
        };

        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsListening(true);
      setTimeout(() => {
        recorder.stop();
        setIsListening(false);
      }, 5000);
    } catch (err) {
      console.error("🎤 Erreur fallback cloud:", err);
      onError?.("Le micro n’a pas pu démarrer.");
    }
  };

  return { isListening, startListening, stopListening };
}
