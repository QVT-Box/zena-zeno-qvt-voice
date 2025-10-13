// src/hooks/useZenaVoice.ts
import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceInput } from "./useVoiceInput";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

type Status = "idle" | "listening" | "speaking";

interface UseZenaVoiceOptions {
  sttLang?: "fr-FR" | "en-US" | "auto";
  continuous?: boolean;
  interimResults?: boolean;
  ttsLang?: "fr-FR" | "en-US";
  ttsGender?: "female" | "male";
  autoResumeListeningAfterSpeak?: boolean;
}

export function useZenaVoice({
  sttLang = "auto",
  continuous = false,
  interimResults = true,
  ttsLang = "fr-FR",
  ttsGender = "female",
  autoResumeListeningAfterSpeak = true,
}: UseZenaVoiceOptions = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const resumeAfterSpeakRef = useRef(false);

  // STT
  const {
    isSupported: sttSupported,
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  } = useVoiceInput({
    lang: sttLang,
    continuous,
    interimResults,
    onError: () => setStatus("idle"),
  });

  // TTS
  const { speak, stop: stopTTS, speaking, isSupported: ttsSupported } = useSpeechSynthesis();

  // gardes d’orchestration
  useEffect(() => {
    if (speaking) setStatus("speaking");
    else if (isListening) setStatus("listening");
    else setStatus("idle");
  }, [speaking, isListening]);

  // API: dire quelque chose (coupe STT pendant TTS)
  const say = useCallback(
    (text: string, opts?: { lang?: "fr-FR" | "en-US"; gender?: "female" | "male" }) => {
      if (!ttsSupported) return;
      const wasListening = isListening;
      if (wasListening) stopListening();

      if (autoResumeListeningAfterSpeak && wasListening) {
        resumeAfterSpeakRef.current = true;
      }

      speak({
        text,
        lang: opts?.lang ?? ttsLang,
        gender: opts?.gender ?? ttsGender,
        onEnd: () => {
          if (autoResumeListeningAfterSpeak && resumeAfterSpeakRef.current) {
            resumeAfterSpeakRef.current = false;
            // petit délai pour éviter la capture de la fin TTS
            setTimeout(() => startListening(), 150);
          }
        },
      });
    },
    [ttsSupported, isListening, stopListening, speak, ttsLang, ttsGender, autoResumeListeningAfterSpeak, startListening]
  );

  const listen = useCallback(() => {
    if (!sttSupported) return;
    if (speaking) stopTTS();
    startListening();
  }, [sttSupported, speaking, stopTTS, startListening]);

  const stopAll = useCallback(() => {
    stopListening();
    stopTTS();
    resumeAfterSpeakRef.current = false;
  }, [stopListening, stopTTS]);

  return {
    // status global
    status,               // "idle" | "listening" | "speaking"
    // STT
    sttSupported,
    isListening,
    transcript,
    detectedLang,
    listen,
    // TTS
    ttsSupported,
    speaking,
    say,
    // global
    stopAll,
  };
}
