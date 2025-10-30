/**
 * 🎬 Heygen API integration for ZÉNA avatar
 * -----------------------------------------
 * - generateZenaVideo(text, { fallbackUrl })
 * - returns a final mp4 URL or fallback video
 *
 * Env:
 *   VITE_HEYGEN_API_KEY=sk_V2_...
 */

const API_KEY = import.meta.env.VITE_HEYGEN_API_KEY || "";
const BASE = "https://api.heygen.com/v1";

export type HeygenOptions = {
  fallbackUrl?: string; // local video fallback
  actorId?: string;     // optional custom avatar id
  voiceId?: string;     // optional custom voice id
  signal?: AbortSignal;
};

/**
 * Call Heygen to generate talking video from text
 */
export async function generateZenaVideo(
  text: string,
  opts: HeygenOptions = {}
): Promise<string> {
  // 🎥 Si pas de clé API, on retourne simplement la vidéo par défaut
  if (!API_KEY) {
    console.warn("⚠️ Pas de clé Heygen. Utilisation du fallback local.");
    return opts.fallbackUrl || "/videos/zena_default.mp4";
  }

  const controller = opts.signal || new AbortController();
  const body = {
    video_inputs: [
      {
        actor_id: opts.actorId || "aLuhZ4q0qQFQX7GgkzqM5", // 🧠 ton avatar Heygen
        voice_id: opts.voiceId || "21m00Tcm4TlvDq8ikWAM", // ElevenLabs par défaut
        text,
      },
    ],
  };

  try {
    const res = await fetch(`${BASE}/video/generate`, {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller,
    });

    const data = await res.json();
    if (!data?.data?.video_id) {
      throw new Error("Aucune vidéo Heygen générée");
    }

    const videoId = data.data.video_id;

    // Polling jusqu’à ce que la vidéo soit prête
    for (let i = 0; i < 40; i++) {
      const check = await fetch(`${BASE}/video/status?video_id=${videoId}`, {
        headers: { "X-Api-Key": API_KEY },
      }).then((r) => r.json());

      if (check.data?.status === "completed") {
        console.log("🎥 Vidéo Heygen prête :", check.data.video_url);
        return check.data.video_url;
      }
      if (check.data?.status === "failed") {
        throw new Error("Erreur Heygen : " + check.data.error);
      }

      await new Promise((r) => setTimeout(r, 2000)); // poll 2s
    }

    throw new Error("Timeout Heygen");
  } catch (err) {
    console.error("❌ Heygen error:", err);
    return opts.fallbackUrl || "/videos/zena_default.mp4";
  }
}
