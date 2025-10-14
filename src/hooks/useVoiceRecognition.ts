// src/hooks/useVoiceRecognition.ts
import { useEffect } from "react";
import { useVoiceInput } from "./useVoiceInput";

// Types utiles (pas besoin que useVoiceInput exporte son interface)
export type UseVoiceRecognitionOptions = Parameters<typeof useVoiceInput>[0];
export type UseVoiceRecognitionReturn = ReturnType<typeof useVoiceInput>;

// Avertissement (une seule fois par session)
let __warned = false;

/**
 * ⚠️ Déprécié : préférez `useVoiceInput`.
 * Wrapper pour compat : même API que `useVoiceInput`, avec un warning auto.
 */
export function useVoiceRecognition(
  options?: UseVoiceRecognitionOptions
): UseVoiceRecognitionReturn {
  useEffect(() => {
    if (!__warned && typeof window !== "undefined") {
      console.warn("[ZÉNA] `useVoiceRecognition` est déprécié. Utilisez `useVoiceInput`.");
      __warned = true;
    }
  }, []);

  return useVoiceInput(options as any);
}
