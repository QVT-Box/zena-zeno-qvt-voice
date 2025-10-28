// src/lib/tts.ts
// ======================================================
// 🔊 Synthèse vocale pour ZÉNA (voix IA + contrôle Stop)
// Compatible ElevenLabs et Vercel
// ======================================================

let currentAudio: HTMLAudioElement | null = null;

/**
 * Fait parler ZÉNA avec une voix humaine (API ElevenLabs)
 * @param text - Le texte à prononcer
 */
export async function speakWithZena(text: string) {
  // 🧹 On arrête tout son en cours avant d’en jouer un nouveau
  stopSpeaking();

  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId =
    import.meta.env.VITE_ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // voix par défaut

  if (!apiKey) {
    console.warn("⚠️ Aucune clé ElevenLabs trouvée dans .env");
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API ElevenLabs: ${response.status}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);

    // 🎧 Lecture du son
    currentAudio = new Audio(audioUrl);
    await currentAudio.play();

    currentAudio.onended = () => {
      // 🧹 Nettoyage automatique une fois terminé
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };
  } catch (err) {
    console.error("❌ Erreur TTS ZÉNA :", err);
    stopSpeaking();
  }
}

/**
 * ✋ Stoppe immédiatement toute lecture audio en cours
 * (utile si ZÉNA parle trop longtemps ou si l’utilisateur appuie sur Stop)
 */
export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch (err) {
      console.warn("Erreur lors de l'arrêt du son :", err);
    }
  }
}
