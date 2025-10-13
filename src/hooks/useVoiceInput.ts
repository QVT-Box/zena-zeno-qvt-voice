// src/hooks/useVoiceInput.ts
import { useCallback, useEffect, useRef, useState } from "react";

// --- shim local minimal (évite un global.d.ts) ---
type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecCtor = new () => SpeechRec;

const SR: SpeechRecCtor | null =
  typeof window !== "undefined"
    ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    : null;

type LangOpt = "fr-FR" | "en-US" | "auto";

interface UseVoiceInputOptions {
  lang?: LangOpt;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, detectedLang?: "fr" | "en" | "unknown") => void;
  onError?: (error: string) => void;
}

interface UseVoiceInputReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  detectedLang: "fr" | "en" | "unknown";
  startListening: () => void;
  stopListening: () => void;
}

export function useVoiceInput({
  lang = "auto",
  continuous = false,
  interimResults = true,
  onResult,
  onError,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedLang, setDetectedLang] = useState<"fr" | "en" | "unknown">("unknown");

  const isSupported = !!SR;
  const recRef = useRef<SpeechRec | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const optionsRef = useRef({ lang, continuous, interimResults });

  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { optionsRef.current = { lang, continuous, interimResults }; }, [lang, continuous, interimResults]);

  // Instanciation + handlers (une seule fois)
  useEffect(() => {
    if (!isSupported || recRef.current) return;

    const recognition = new (SR as Required<typeof SR>)();
    recognition.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    recognition.continuous = !!optionsRef.current.continuous;
    recognition.interimResults = !!optionsRef.current.interimResults;

    recognition.onresult = (event: any) => {
      const res = event.results[event.resultIndex];
      const text = Array.from(res).map((r: any) => r.transcript).join("").trim();

      const en = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const fr = /\b(bonjour|salut|merci|oui|non|comment|ça va|ca va)\b/i.test(text);
      const detected: "fr" | "en" | "unknown" = en ? "en" : fr ? "fr" : "unknown";

      setDetectedLang(detected);
      setTranscript(text);

      if (res.isFinal) {
        onResultRef.current?.(text, detected);
        setTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      onErrorRef.current?.(event?.error || "speech_error");
    };

    recognition.onend = () => {
      if (optionsRef.current.continuous && isListening) {
        try { recognition.start(); } catch { setIsListening(false); }
      } else {
        setIsListening(false);
      }
    };

    recRef.current = recognition;

    return () => {
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
    };
  // ⛔️ ne pas dépendre de detectedLang ici !
  }, [isSupported, isListening]);

  const startListening = useCallback(() => {
    const rec = recRef.current;
    if (!rec || !isSupported) return;

    rec.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    rec.continuous = !!optionsRef.current.continuous;
    rec.interimResults = !!optionsRef.current.interimResults;

    try {
      if (!(rec as any)._starting) {
        (rec as any)._starting = true;
        rec.start();
        setIsListening(true);
        setTimeout(() => ((rec as any)._starting = false), 0);
      }
    } catch {
      (rec as any)._starting = false;
      onErrorRef.current?.("Impossible de démarrer la reconnaissance vocale.");
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    try { rec.stop(); } finally { setIsListening(false); }
  }, []);

  return { isSupported, isListening, transcript, detectedLang, startListening, stopListening };
}
