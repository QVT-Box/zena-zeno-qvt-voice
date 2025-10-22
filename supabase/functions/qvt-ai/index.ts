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
// 🧠 ANALYSE ÉMOTIONNELLE AVANCÉE
// ===========================================================
async function analyzeEmotion(text: string, lang: "fr" | "en") {
  if (!OPENAI_API_KEY) return null;

  const prompt =
    lang === "fr"
      ? `Analyse ce message selon les modèles Karasek, Siegrist et la psychologie positive.
Renvoie un JSON avec :
- emotion_dominante : [joie, calme, stress, tristesse, colère, fatigue, isolement]
- intensité : 0–1
- besoin : [repos, reconnaissance, soutien, sens, lien]
- ton_recommandé : [rassurant, motivant, calme, doux, énergisant]
- stratégie_relationnelle : l’une de [positive_engagement, acceptance, negative_engagement, rejection]
Message : """${text}"""
Réponds uniquement en JSON.`
      : `Analyze this message emotionally (Karasek, Siegrist, WHO).
Return JSON:
- dominant_emotion
- intensity
- underlying_need
- tone_hint
- relational_strategy: one of [positive_engagement, acceptance, negative_engagement, rejection]
Message: """${text}"""`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_CHAT,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });

  const j = await res.json();
  try {
    return JSON.parse(j.choices?.[0]?.message?.content || "{}");
  } catch {
    return null;
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
// ✅ HANDLER PRINCIPAL — version CORS STABLE pour Supabase Edge
// ===========================================================
serve(async (req) => {
  // ✅ Autoriser la requête de prévol (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "missing text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Traitement IA
    const mood = detectMood(text);
    const emotional = await analyzeEmotion(text, lang);

    const system = personaSystem(persona, lang);
    const intro = "Je t’écoute, dis-m’en un peu plus.";

    const messages = [
      { role: "system", content: system },
      {
        role: "user",
        content: `Message : ${text}
Émotion : ${emotional?.emotion_dominante || mood}
Besoin : ${emotional?.besoin || "inconnu"}
Adopte un ton ${emotional?.ton_recommandé || "calme"}
Commence par une phrase comme : "${intro}"`,
      },
    ];

    const reply = await callOpenAI(messages);

    return new Response(
      JSON.stringify({
        reply,
        mood,
        emotional,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[qvt-ai] Fatal error:", err);

    // ⚠️ Toujours renvoyer un 200 même en erreur pour éviter le blocage CORS
    return new Response(
      JSON.stringify({
        error: err?.message || String(err),
        fix: "Vérifie la configuration des CORS ou les clés API.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

