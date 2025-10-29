/**
 * 🎥 Génération vidéo ZÉNA via l'API D-ID
 * Utilise ta clé API personnelle : c2FidWxsZWxhbUBnbWFpbC5jb20:3SJA1zel0r5bv4JqgNads
 *
 * ⚠️ Ne partage pas cette clé publiquement.
 * Pour plus de sécurité, déplace-la dans un fichier .env :
 * VITE_DID_API_KEY="c2FidWxsZWxhbUBnbWFpbC5jb20:3SJA1zel0r5bv4JqgNads"
 */

const API_KEY = import.meta.env.VITE_DID_API_KEY || "c2FidWxsZWxhbUBnbWFpbC5jb20:3SJA1zel0r5bv4JqgNads";

/**
 * Génère une vidéo animée à partir d’un texte.
 * Retourne l’URL du MP4 hébergé par D-ID.
 */
export async function generateZenaVideo(text: string): Promise<string | null> {
  try {
    console.log("🎬 Génération vidéo ZÉNA...");

    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(API_KEY)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_url: "https://qvtbox.com/images/zena-face.png", // ton avatar (image fixe)
        script: {
          type: "text",
          input: text,
          provider: {
            type: "elevenlabs",
            voice_id: "Rachel", // voix réaliste FR
          },
        },
        config: {
          result_format: "mp4",
          stitch: true,
        },
      }),
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(`Erreur D-ID (${response.status}): ${msg}`);
    }

    const data = await response.json();
    console.log("✅ Réponse D-ID :", data);

    // Récupération de la vidéo finale
    const videoUrl = data.result_url || data?.result?.url || null;
    if (!videoUrl) {
      console.warn("⚠️ Aucune URL de vidéo retournée :", data);
      return null;
    }

    console.log("🎞️ Vidéo ZÉNA prête :", videoUrl);
    return videoUrl;
  } catch (err) {
    console.error("❌ Erreur génération vidéo ZÉNA :", err);
    return null;
  }
}
