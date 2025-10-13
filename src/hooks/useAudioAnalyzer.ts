import { useEffect, useRef, useState } from "react";

/** Simule un niveau audio pendant que ZÉNA parle */
export const useAudioAnalyzer = (isSpeaking: boolean) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      const t = performance.now();
      const level = 0.2 + Math.abs(Math.sin(t / 150)) * 0.8;
      setAudioLevel(level);
      rafRef.current = requestAnimationFrame(loop);
    };

    if (isSpeaking) {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(loop);
    } else {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setAudioLevel(0);
    }

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isSpeaking]);

  return audioLevel;
};
