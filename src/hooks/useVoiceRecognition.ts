import { useState, useRef } from "react";

export function useVoiceRecognition({ onResult, lang = "fr-FR" }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = async () => {
    try {
      // 🔊 Vérifie la dispo du micro
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn("⚠️ Web Speech API non disponible — fallback cloud.");
        return startCloudListening();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onResult?.(text);
      };

      recognition.onerror = (event) => {
        console.error("🎙️ SpeechRecognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error("❌ Micro non accessible :", error);
      alert("Autorise l’accès au micro dans ton navigateur ou ta PWA.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  // 🌩️ Fallback cloud (Supabase → Whisper)
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
              body: JSON.stringify({ audio: base64Audio, mimeType: "audio/webm" }),
            }
          );

          const data = await resp.json();
          if (data.text) onResult?.(data.text);
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsListening(true);
      setTimeout(() => {
        recorder.stop();
        setIsListening(false);
      }, 5000); // écoute 5 secondes
    } catch (err) {
      console.error("🎤 Fallback cloud error:", err);
    }
  };

  return { isListening, startListening, stopListening };
}
