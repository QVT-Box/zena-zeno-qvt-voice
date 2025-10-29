let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * 🔈 Fait parler Zéna + callback de mouvement labial
 */
export async function speakWithZena(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
) {
  return new Promise<void>((resolve) => {
    if (!window.speechSynthesis) {
      console.warn("Synthèse vocale non disponible.");
      resolve();
      return;
    }

    stopSpeaking(); // stop toute voix active

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 1;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    currentUtterance = utterance;

    utterance.onstart = () => onProgress?.("start");
    utterance.onend = () => {
      onProgress?.("end");
      resolve();
    };
    utterance.onboundary = () => onProgress?.("tick");

    synth.speak(utterance);
  });
}

/**
 * ✋ Stoppe immédiatement la parole
 */
export function stopSpeaking() {
  if (window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}
