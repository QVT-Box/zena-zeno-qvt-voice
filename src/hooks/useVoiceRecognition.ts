// src/hooks/useVoiceRecognition.ts
import { useEffect } from "react";
export { useVoiceInput as useVoiceRecognition } from "./useVoiceInput";

export function useVoiceRecognitionDeprecationWarning() {
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).__zena_warned_vr) {
      console.warn("[ZÉNA] useVoiceRecognition est déprécié. Utilise useVoiceInput.");
      (window as any).__zena_warned_vr = true;
    }
  }, []);
}
