import { useEffect, useMemo, useRef, useState } from "react";

type Lang = "fr-FR" | "en-US";
type Gender = "female" | "male";

interface SpeakOptions {
  text: string;
  lang?: Lang;
  gender?: Gender;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
}

interface UseSpeechSynthesis {
  speak: (options: SpeakOptions) => void;
  stop: () => void;
  speaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
  isSupported: boolean;
}

export function useSpeechSynthesis(): UseSpeechSynthesis {
  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // charge les voix (arrivent souvent en retard)
  useEffect(() => {
    if (!isSupported) return;

    const load = () => setVoices(window.speechSynthesis.getVoices() || []);
    load();

    const handler = load;
    window.speechSynthesis.addEventListener?.("voiceschanged", handler as any);
    // fallback propriété (anciens navigateurs)
    const prev = (window.speechSynthesis as any).onvoiceschanged;
    (window.speechSynthesis as any).onvoiceschanged = handler;

    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", handler as any);
      (window.speechSynthesis as any).onvoiceschanged = prev ?? null;
    };
  }, [isSupported]);

  const pickVoice = useMemo(() => {
    return (lang: Lang, gender: Gender) => {
      // 1) même langue exacte
      const langVoices = voices.filter(v => v.lang === lang);
      // 2) fallback même code langue
      const prefixVoices = voices.filter(v => v.lang.startsWith(lang.slice(0, 2)));

      const pool = langVoices.length ? langVoices : prefixVoices;

      // heuristique simple sur le nom
      const gendered = pool.find(v =>
        gender === "female"
          ? /female|woman|fémin|Google.*(fran|en)/i.test(v.name)
          : /male|man|mascul|Google.*(fran|en)/i.test(v.name)
      );

      return gendered || pool[0] || voices[0] || null;
    };
  }, [voices]);

  const speak = ({
    text,
    lang = "fr-FR",
    gender = "female",
    rate = 1,
    pitch = 1,
    volume = 1,
    onEnd,
  }: SpeakOptions) => {
    if (!isSupported || !text) return;

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      u.pitch = pitch;
      u.volume = volume;
      u.voice = pickVoice(lang, gender);

      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        onEnd?.();
      };
      u.onerror = () => setSpeaking(false);

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    } catch {
      setSpeaking(false);
    }
  };

  const stop = () => {
    if (!isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } finally {
      setSpeaking(false);
    }
  };

  return { speak, stop, speaking, availableVoices: voices, isSupported };
}
