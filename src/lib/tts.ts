// src/lib/tts.ts
// =============================================================
// TTS ZÉNA : ElevenLabs (si dispo) -> sinon Web Speech "meilleure voix FR"
// - speakWithZena(text, onProgress) -> Promise<void>
// - stopSpeaking()
// - garde le callback "tick" pour l'animation de la bouche
// =============================================================

let currentAudio: HTMLAudioElement | null = null;
let tickTimer: number | null = null;
let usingWebSpeech = false;
let currentUtterance: SpeechSynthesisUtterance | null = null;

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || ""; // Mets ta clé si tu veux ElevenLabs
const ELEVEN_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // "Rachel" par défaut
const TTS_PROVIDER = (import.meta.env.VITE_TTS_PROVIDER || "").toLowerCase(); 
// options: "elevenlabs" | "webspeech" | "" (auto)

const PREFERRED_FR_VOICES = [
  // Ordre de préférence : Google, Apple, etc. (varie selon OS)
  "Google français", "Google français (France)", "Google Français", "Google fr-FR",
  "Amélie", "Thomas", "Aurélie", // Apple
  "Google UK English Female", // fallback neutre agréable si FR indispo
];

/**
 * Stoppe toute sortie audio en cours (ElevenLabs ou Web Speech)
 */
export function stopSpeaking() {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      currentAudio = null;
    }
  } catch {}
  if (tickTimer) {
    window.clearInterval(tickTimer);
    tickTimer = null;
  }
  if (usingWebSpeech && window.speechSynthesis?.speaking) {
    window.speechSynthesis.cancel();
  }
  currentUtterance = null;
}

/**
 * Parle avec ZÉNA.
 * - Si ELEVENLABS est configuré (ou VITE_TTS_PROVIDER=elevenlabs), on utilise ElevenLabs (MP3).
 * - Sinon, Web Speech en forçant la meilleure voix FR disponible.
 * onProgress("start" | "tick" | "end") permet d’animer la bouche.
 */
export async function speakWithZena(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
): Promise<void> {
  stopSpeaking();

  // Choix du provider
  const wantEleven =
    (TTS_PROVIDER === "elevenlabs" || TTS_PROVIDER === "") && ELEVEN_API_KEY.length > 0;

  if (wantEleven) {
    try {
      await speakWithElevenLabs(text, onProgress);
      return;
    } catch (e) {
      console.warn("⚠️ ElevenLabs indisponible, bascule sur Web Speech :", e);
      // continue vers Web Speech
    }
  }

  await speakWithWebSpeech(text, onProgress);
}

/* -------------------------------------------
   Implémentation ElevenLabs (MP3 streaming)
-------------------------------------------- */
async function speakWithElevenLabs(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
): Promise<void> {
  // API: https://api.elevenlabs.io/v1/text-to-speech/{voice_id}
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}?optimize_streaming_latency=2`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVEN_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${msg}`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  currentAudio = new Audio(objectUrl);
  currentAudio.onplay = () => {
    onProgress?.("start");
    // Faux "tick" régulier pour animer la bouche pendant l'audio
    tickTimer = window.setInterval(() => onProgress?.("tick"), 90);
  };
  currentAudio.onended = () => {
    if (tickTimer) {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }
    onProgress?.("end");
    // cleanup
    URL.revokeObjectURL(objectUrl);
    currentAudio = null;
  };
  currentAudio.onerror = () => {
    if (tickTimer) {
      window.clearInterval(tickTimer);
      tickTimer = null;
    }
    onProgress?.("end");
    currentAudio = null;
  };

  await currentAudio.play();
}

/* -------------------------------------------
   Implémentation Web Speech (navigateur)
-------------------------------------------- */
async function speakWithWebSpeech(
  text: string,
  onProgress?: (event: "start" | "tick" | "end") => void
): Promise<void> {
  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn("Web Speech non disponible.");
    onProgress?.("end");
    return;
  }
  usingWebSpeech = true;

  const voices = await loadVoices();
  const voice = choosePreferredVoice(voices);

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 1;     // vitesse
  u.pitch = 1.05; // léger aigu naturel
  u.volume = 1;
  if (voice) u.voice = voice;

  currentUtterance = u;

  u.onstart = () => onProgress?.("start");
  u.onend = () => {
    onProgress?.("end");
    currentUtterance = null;
  };
  // onboundary ≈ à chaque mot/syllabe
  u.onboundary = () => onProgress?.("tick");
  u.onerror = () => onProgress?.("end");

  synth.speak(u);
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve([]);

  const existing = synth.getVoices();
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const handle = () => {
      const vs = synth.getVoices();
      resolve(vs);
      synth.removeEventListener("voiceschanged", handle);
    };
    synth.addEventListener("voiceschanged", handle);
    // fallback timeout au cas où l’événement ne se déclenche pas
    setTimeout(() => {
      const vs = synth.getVoices();
      resolve(vs);
      synth.removeEventListener("voiceschanged", handle);
    }, 800);
  });
}

function choosePreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1) prioriser les voix FR
  const frVoices = voices.filter(
    (v) => (v.lang || "").toLowerCase().startsWith("fr") || /fr(-|_)?fr/i.test(v.lang || "")
  );

  // 2) parmi FR, prendre celles dont le nom matche la liste préférée
  for (const pref of PREFERRED_FR_VOICES) {
    const found = frVoices.find((v) => v.name.toLowerCase().includes(pref.toLowerCase()));
    if (found) return found;
  }

  // 3) sinon, prendre n'importe quelle voix FR disponible
  if (frVoices.length > 0) return frVoices[0];

  // 4) dernier recours : une Google Voice en EN (souvent plus “humaine” que Microsoft FR)
  const google = voices.find((v) => v.name.toLowerCase().includes("google"));
  if (google) return google;

  // 5) sinon, première voix dispo (peut être Microsoft)
  return voices[0] || null;
}
