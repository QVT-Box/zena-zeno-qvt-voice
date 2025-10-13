import { useCallback, useEffect, useRef, useState } from "react";

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

/** Reconnaissance vocale FR/EN, stable StrictMode + mobile */
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

  const SR =
    (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) ||
    null;

  const isSupported = !!SR;

  const recRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const optionsRef = useRef({ lang, continuous, interimResults });

  // garde les callbacks/options stables sans recréer l'instance
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    optionsRef.current = { lang, continuous, interimResults };
    // si tu veux pouvoir changer la langue “à chaud”,
    // tu peux aussi ajuster recRef.current?.lang ici quand non-listening.
  }, [lang, continuous, interimResults]);

  // instanciation + handlers (une fois)
  useEffect(() => {
    if (!isSupported) {
      onErrorRef.current?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }
    if (recRef.current) return;

    const recognition = new (SR as any)() as SpeechRecognition;
    recognition.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    recognition.continuous = !!optionsRef.current.continuous;
    recognition.interimResults = !!optionsRef.current.interimResults;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const res = event.results[event.resultIndex];
      const text = Array.from(res).map(r => r.transcript).join("").trim();

      // détection locale (pas via l'état)
      const isEnglish = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const isFrench  = /\b(bonjour|salut|merci|oui|non|comment|ça va|ca va)\b/i.test(text);
      const detected: "fr" | "en" | "unknown" = isEnglish ? "en" : isFrench ? "fr" : "unknown";

      setDetectedLang(detected);
      setTranscript(text);

      if ((res as any).isFinal) {
        onResultRef.current?.(text, detected);
        setTranscript(""); // optionnel : garde `text` si tu veux l’historique
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      onErrorRef.current?.(event?.error || "speech_error");
    };

    recognition.onend = () => {
      // auto-restart si continuous demandé et on était en écoute
      if (optionsRef.current.continuous && isListening) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recRef.current = recognition;

    return () => {
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
    };
  // ⛔️ ne mets PAS detectedLang dans les deps !
  }, [SR, isSupported, isListening]);

  const startListening = useCallback(() => {
    const rec = recRef.current;
    if (!rec || !isSupported) return;

    // (ré)applique options récentes si besoin
    rec.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    rec.continuous = !!optionsRef.current.continuous;
    rec.interimResults = !!optionsRef.current.interimResults;

    try {
      // éviter InvalidStateError si déjà démarré
      if (!(rec as any)._starting) {
        (rec as any)._starting = true;
        rec.start();
        setIsListening(true);
        setTimeout(() => ((rec as any)._starting = false), 0);
      }
    } catch (e) {
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
