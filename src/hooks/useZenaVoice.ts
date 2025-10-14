// src/hooks/useZenaVoice.ts
import { useCallback, useEffect, useRef } from "react";
import { useVoiceInput } from "./useVoiceInput";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useAudioAnalyzer } from "./useAudioAnalyzer";

type Lang = "fr-FR" | "en-US";
type Gender = "female" | "male";

interface UseZenaVoiceOptions {
  lang?: Lang;                 // langue TTS
  gender?: Gender;             // genre TTS
  sttLang?: "auto" | Lang;     // langue STT
  continuous?: boolean;        // STT: redémarre automatiquement
  interimResults?: boolean;    // STT: résultats intermédiaires
}

/**
 * 🌿 useZenaVoice — Orchestrateur voix
 * - Pause l'écoute (STT) pendant que ça parle (TTS), puis la relance après.
 * - Retourne le niveau audio simulé pour animer un halo/bouche.
 */
export function useZenaVoice({
  lang = "fr-FR",
  gender = "female",
  sttLang = "auto",
  continuous = true,
  interimResults = true,
}: UseZenaVoiceOptions = {}) {
  // STT (écoute micro)
  const {
    isSupported: sttSupported,
    isListening,
    transcript,
    detectedLang,
    startListening,
    stopListening,
  } = useVoiceInput({ lang: sttLang, continuous, interimResults });

  // TTS (parole)
  const {
    isSupported: ttsSupported,
    speak,
    stop: stopTTS,
    speaking: isSpeaking,
  } = useSpeechSynthesis();

  // Niveau audio pour anim (bouche/halo)
  const audioLevel = useAudioAnalyzer(isSpeaking);

  // Faut-il relancer l'écoute après la fin du TTS ?
  const resumeAfterSpeak = useRef(false);

  // Nettoyage au démontage : on arrête tout proprement
  useEffect(() => {
    return () => {
      try { stopTTS(); } catch {}
      try { stopListening(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 🔊 Fait parler (TTS) en évitant l'effet larsen
   * - met en pause le STT pendant la parole
   * - relance l'écoute juste après la fin
   */
  const say = useCallback(
    (text: string, opts?: { lang?: Lang; gender?: Gender }) => {
      if (!ttsSupported || !text) return;

      const wasListening = isListening;
      if (wasListening) stopListening();         // pause micro
      resumeAfterSpeak.current = wasListening;   // relancer après ?

      speak({
        text,
        lang: opts?.lang ?? lang,
        gender: opts?.gender ?? gender,
        // on pourrait aussi exposer rate/pitch/volume ici si besoin
        onEnd: () => {
          if (resumeAfterSpeak.current) {
            resumeAfterSpeak.current = false;
            // petit délai pour laisser le moteur TTS se libérer
            setTimeout(() => startListening(), 150);
          }
        },
      });
    },
    [ttsSupported, isListening, stopListening, speak, lang, gender, startListening]
  );

  /**
   * 🎧 Démarre l'écoute (si TTS en cours, on le stoppe)
   */
  const listen = useCallback(() => {
    if (!sttSupported) return;
    if (isSpeaking) stopTTS();
    startListening();
  }, [sttSupported, isSpeaking, stopTTS, startListening]);

  return {
    // actions
    say,
    listen,
    stopListening,

    // états
    isSpeaking,      // TTS en cours ?
    isListening,     // STT en cours ?
    transcript,      // texte entendu (intermédiaire/vidé au final)
    detectedLang,    // "fr" | "en" | "unknown"
    audioLevel,      // 0..1 pour animer

    // infos de support (utile pour UI/fallback)
    sttSupported,
    ttsSupported,
  };
}
