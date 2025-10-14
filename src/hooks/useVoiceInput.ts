// src/hooks/useVoiceInput.ts
import { useCallback, useEffect, useRef, useState } from "react";

// --- shim local minimal ---
type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onaudiostart: (() => void) | null;
  onsoundstart: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onsoundend: (() => void) | null;
  onaudioend: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
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
  startListening: () => Promise<void>;
  stopListening: () => void;
}

/** Petit helper: demande la permission micro avant SpeechRecognition.start() */
async function ensureMicPermission(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch (e) {
    console.warn("[ZÉNA] getUserMedia a échoué:", e);
    return false;
  }
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

  // Instancie et câble les events une fois
  useEffect(() => {
    if (!isSupported || recRef.current) {
      if (!isSupported) console.warn("[ZÉNA] SpeechRecognition non supporté par ce navigateur.");
      return;
    }

    const recognition = new (SR as Required<typeof SR>)();
    recognition.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    recognition.continuous = !!optionsRef.current.continuous;
    recognition.interimResults = !!optionsRef.current.interimResults;

    // Logs détaillés
    recognition.onstart = () => console.log("🎙️ onstart");
    recognition.onaudiostart = () => console.log("🔊 onaudiostart (audio capturé)");
    recognition.onsoundstart = () => console.log("🎵 onsoundstart (son détecté)");
    recognition.onspeechstart = () => console.log("🗣️ onspeechstart (parole détectée)");
    recognition.onspeechend = () => console.log("🛑 onspeechend (fin de la parole)");
    recognition.onsoundend = () => console.log("🔇 onsoundend (fin du son)");
    recognition.onaudioend = () => console.log("🔌 onaudioend (fin capture audio)");

    recognition.onresult = (event: any) => {
      const res = event.results[event.resultIndex];
      const text = Array.from(res).map((r: any) => r.transcript).join("").trim();

      const en = /\b(hi|hello|how|you|thanks|please|okay|yes|no)\b/i.test(text);
      const fr = /\b(bonjour|salut|merci|oui|non|comment|ça va|ca va)\b/i.test(text);
      const detected: "fr" | "en" | "unknown" = en ? "en" : fr ? "fr" : "unknown";

      setDetectedLang(detected);
      setTranscript(text);
      console.log("📝 onresult:", { text, isFinal: res.isFinal });

      if (res.isFinal) {
        onResultRef.current?.(text, detected);
        setTranscript("");
      }
    };

    recognition.onerror = (event: any) => {
      const code = event?.error || "speech_error";
      console.error("❌ onerror:", code, event);
      setIsListening(false);

      // messages plus parlants
      const nice =
        code === "not-allowed" ? "Permission micro refusée."
        : code === "audio-capture" ? "Aucun micro détecté."
        : code === "no-speech" ? "Aucune parole détectée."
        : code === "aborted" ? "Reconnaissance interrompue."
        : code === "network" ? "Erreur réseau."
        : code === "service-not-allowed" ? "Service de reco non autorisé."
        : `Erreur reco: ${code}`;

      onErrorRef.current?.(nice);
    };

    recognition.onend = () => {
      console.log("🏁 onend");
      if (optionsRef.current.continuous && isListening) {
        // auto-restart si on est censé écouter en continu
        try { recognition.start(); console.log("↩️ restart auto"); }
        catch (e) { console.warn("⚠️ restart échoué:", e); setIsListening(false); }
      } else {
        setIsListening(false);
      }
    };

    recRef.current = recognition;
    return () => { try { recRef.current?.stop(); } catch {} recRef.current = null; };
  // ne pas dépendre de detectedLang/transcript
  }, [isSupported, isListening]);

  const startListening = useCallback(async () => {
    const rec = recRef.current;
    if (!isSupported || !rec) {
      onErrorRef.current?.("La reconnaissance vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    // Pré-autorise le micro pour éviter not-allowed silencieux
    const ok = await ensureMicPermission();
    if (!ok) {
      onErrorRef.current?.("Accès au micro refusé. Vérifie les permissions du navigateur.");
      return;
    }

    rec.lang = optionsRef.current.lang === "auto" ? "fr-FR" : (optionsRef.current.lang as string);
    rec.continuous = !!optionsRef.current.continuous;
    rec.interimResults = !!optionsRef.current.interimResults;

    try {
      (rec as any)._starting = true;
      console.log("▶️ Démarrage de l'écoute");
      rec.start();
      setIsListening(true);
    } catch (e: any) {
      console.error("❌ start() a échoué:", e?.message || e);
      onErrorRef.current?.("Impossible de démarrer la reconnaissance vocale.");
      setIsListening(false);
    } finally {
      setTimeout(() => ((rec as any)._starting = false), 0);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    try {
      console.log("🛑 Arrêt de l'écoute");
      rec.stop();
    } finally {
      setIsListening(false);
    }
  }, []);

  return { isSupported, isListening, transcript, detectedLang, startListening, stopListening };
}
