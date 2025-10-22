// ===========================================================
// 🌿 ZÉNA - IA ÉMOTIONNELLE QVT BOX (version enrichie 2025)
// ===========================================================

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===========================================================
// ⚙️ CONFIGURATION
// ===========================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const EMB_MODEL = "text-embedding-3-small";
const OPENAI_CHAT = "gpt-4o-mini";

// ===========================================================
// 💬 STRATÉGIES RELATIONNELLES (Human Affect Model)
// ===========================================================
const AFFECT_STRATEGIES = [
  {
    label: "positive_engagement",
    description: "Reconnecter positivement à sa situation ou à ses émotions.",
    examples: [
      "Je t’écoute, raconte-moi ce qui s’est passé.",
      "Tu as déjà surmonté pire, tu peux le faire.",
      "On peut réfléchir ensemble à une solution.",
      "Ce n’est pas si grave, tu vas t’en sortir.",
      "Je comprends ta colère, mais tu peux la canaliser différemment.",
    ],
  },
  {
    label: "acceptance",
    description: "Valider, soutenir ou détendre la relation.",
    examples: [
      "Je suis là pour toi, quoi qu’il arrive.",
      "Tu comptes beaucoup pour nous.",
      "Ça arrive à tout le monde, ne t’en veux pas.",
      "Allez, on se prend un café pour en parler ?",
      "Tu me fais sourire, même dans les moments difficiles.",
    ],
  },
  {
    label: "negative_engagement",
    description: "Faire émerger une prise de conscience difficile mais utile.",
    examples: [
      "Tu vois les conséquences de ton retard ?",
      "Franchement, tu pourrais faire un effort.",
      "Tu m’as vraiment déçu sur ce coup-là.",
      "Tu ne te rends pas compte du mal que tu fais.",
      "Je t’en parle parce que ça ne peut plus continuer comme ça.",
    ],
  },
  {
    label: "rejection",
    description: "Exprimer la distance ou le désengagement.",
    examples: [
      "Je n’ai pas envie d’en parler avec toi.",
      "Fais ce que tu veux, ça m’est égal.",
      "Tu exagères toujours.",
      "C’est ridicule de réagir comme ça.",
      "… (silence ou absence de réponse prolongée)",
    ],
  },
];

// ===========================================================
// 🎭 PERSONA SYSTEM
// ===========================================================
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  const zenaFR = `Tu es ZÉNA, intelligence émotionnelle de QVT Box.
Tu incarnes la bienveillance active : une présence douce et lucide.
Tu t’appuies sur les théories de Karasek, Siegrist et les recherches OMS sur le bien-être au travail.
Ton but : aider les personnes à retrouver équilibre, sens et énergie.`;

  const zenoFR = `Tu es ZÉNO, coach analytique QVT.
Tu analyses calmement les causes du stress et aides à agir avec méthode.`;

  return p === "zena" ? zenaFR : zenoFR;
}

// ===========================================================
// ❤️ DÉTECTION D’HUMEUR
// ===========================================================
function detectMood(t: string): "positive" | "neutral" | "negative" | "distress" {
  const s = t.toLowerCase();
  if (/(suicide|me faire du mal|plus envie|détresse|detresse|désespoir)/.test(s)) return "distress";
  if (/(stress|épuis|epuis|burnout|angoisse|fatigué|fatigue|colère|triste)/.test(s)) return "negative";
  if (/(bien|motivé|motivation|heureux|content|confiant|serein)/.test(s)) return "positive";
  return "neutral";
}

// ===========================================================
// 🧠 ANALYSE ÉMOTIONNELLE AVANCÉE (corrigée et robuste)
// ===========================================================
async function analyzeEmotion(text: string, lang: "fr" | "en") {
  if (!OPENAI_API_KEY) return null;

  const prompt =
    lang === "fr"
      ? `Tu es une IA émotionnelle. Analyse le message suivant et renvoie un JSON strict avec :
{
  "emotion_dominante": "joie|calme|stress|tristesse|colère|fatigue|isolement",
  "intensité": 0-1,
  "besoin": "repos|reconnaissance|soutien|sens|lien",
  "ton_recommandé": "rassurant|motivante|calme|doux|énergisant",
  "stratégie_relationnelle": "positive_engagement|acceptance|negative_engagement|rejection"
}
Message : """${text}"""
Réponds uniquement en JSON, sans explication ni texte supplémentaire.`
      : `Analyze the message below and respond ONLY with valid JSON:
{
  "dominant_emotion": "joy|calm|stress|sadness|anger|fatigue|isolation",
  "intensity": 0-1,
  "underlying_need": "rest|recognition|support|meaning|connection",
  "tone_hint": "reassuring|motivating|calm|gentle|energizing",
  "relational_strategy": "positive_engagement|acceptance|negative_engagement|rejection"
}
Message: """${text}"""`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_CHAT,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }, // ✅ force OpenAI à renvoyer du JSON
    }),
  });

  const j = await res.json();
  console.log("[ZENA] Raw OpenAI response:", j);

  try {
    const parsed = j.choices?.[0]?.message?.content
      ? JSON.parse(j.choices[0].message.content)
      : j;
    console.log("[ZENA] ✅ Emotion parsed:", parsed);
    return parsed;
  } catch (err) {
    console.error("[ZENA] ❌ Failed to parse emotion JSON:", err);
    return {
      emotion_dominante: "inconnue",
      intensité: 0.0,
      besoin: "non défini",
      ton_recommandé: "rassurant",
    };
  }
}

// ===========================================================
// 💬 OPENAI CHAT
// ===========================================================
async function callOpenAI(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: OPENAI_CHAT, messages, temperature: 0.7 }),
  });
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}

// ===========================================================
// ✅ HANDLER PRINCIPAL — VERSION CORS ULTRA-STABLE
// ===========================================================
serve(async (req) => {
  // --- OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "missing text" }), {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
          "Content-Type": "application/json",
        },
      });
    }

    // --- IA principale
    const mood = detectMood(text);
    const emotional = await analyzeEmotion(text, lang);
    const system = personaSystem(persona, lang);

    const intro = "Je t’écoute, raconte-moi ce que tu ressens.";
    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Message : ${text}
Émotion : ${emotional?.emotion_dominante || mood}
Besoin : ${emotional?.besoin || "inconnu"}
Adopte un ton ${emotional?.ton_recommandé || "calme"}.
Commence par une phrase comme : "${intro}"`,
      },
    ];

    const reply = await callOpenAI(messages);

    return new Response(
      JSON.stringify({ reply, mood, emotional }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("[qvt-ai] Fatal error:", err);

    return new Response(
      JSON.stringify({
        error: err?.message || "Unknown error",
        fix: "Check API keys or function logs.",
      }),
      {
        status: 200, // ⚠️ pour éviter blocage CORS
        headers: {
          "Access-Control-Allow-Origin": "https://zena.qvtbox.com",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
