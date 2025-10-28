export async function speakWithZena(text: string) {
  // ⚙️ Méthode ElevenLabs — plus naturelle
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // ex: voix douce FR

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.8 },
      }),
    });

    const blob = await res.blob();
    const audio = new Audio(URL.createObjectURL(blob));
    await audio.play();
  } catch (err) {
    console.error("Erreur TTS Zéna :", err);
  }
}
