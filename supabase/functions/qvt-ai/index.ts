// ===========================================================
// 🌿 ZÉNA - IA ÉMOTIONNELLE QVT BOX
// Triple fallback : OpenAI → Mistral → Mode local (autonome)
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
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");
const OPENAI_MODEL = "gpt-4o-mini";
const MISTRAL_MODEL = "mistral-tiny";

// ===========================================================
// ❤️ ANALYSE ÉMOTIONNELLE LOCALE (fallback offline)
// ===========================================================
function localEmotionAnalysis(text: string) {
  const t = text.toLowerCase();
  let emotion = "neutre", besoin = "sens", intensité = 0.4, ton = "calme";

  if (/(fatigu|épuis|burnout|lassé)/.test(t)) {
    emotion = "fatigue"; besoin = "repos"; intensité = 0.8; ton = "doux";
  } else if (/(stress|angoiss|tendu|inquiet)/.test(t)) {
    emotion = "stress"; besoin = "soutien"; intensité = 0.7; ton = "rassurant";
  } else if (/(triste|seul|déprimé)/.test(t)) {
    emotion = "tristesse"; besoin = "lien"; intensité = 0.9; ton = "chaleureux";
  } else if (/(colèr|énerv|frustré)/.test(t)) {
    emotion = "colère"; besoin = "reconnaissance"; intensité = 0.8; ton = "calme";
  } else if (/(motivé|heureux|bien|content|serein)/.test(t)) {
    emotion = "joie"; besoin = "partage"; intensité = 0.6; ton = "positif";
  }

  return { emotion_dominante: emotion, intensité, besoin, ton_recommandé: ton };
}

// ===========================================================
// 🎭 PERSONA SYSTEM
// ===========================================================
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  const zenaFR = `Tu es ZÉNA, intelligence émotionnelle de QVT Box.
Tu écoutes, reformules avec douceur et aides à retrouver sens et énergie.
Ton style est humain, fluide, apaisant et sincère.`;

  const zenoFR = `Tu es ZÉNO, coach analytique QVT.
Tu aides à comprendre calmement les causes des difficultés et à les résoudre.`;

  const zenaEN = `You are ZÉNA, the emotional intelligence of QVT Box.
You listen deeply, respond warmly, and guide with care.`;

  return lang === "en" ? zenaEN : p === "zena" ? zenaFR : zenoFR;
}

// ===========================================================
// 🧠 ANALYSE ÉMOTIONNELLE VIA OPENAI / MISTRAL
// ===========================================================
async function analyzeEmotion(text: string, lang: "fr" | "en") {
  const prompt = lang === "fr"
    ? `Analyse ce message et renvoie un JSON :
- emotion_dominante : [joie, calme, stress, tristesse, colère, fatigue, isolement]
- intensité : 0–1
- besoin : (repos, reconnaissance, soutien, sens, lien)
- ton_recommandé : (rassurant, motivant, calme, doux, énergisant)
Message : """${text}"""
Réponds uniquement en JSON.`
    : `Analyze this message emotionally. Return JSON with dominant_emotion, intensity, need, tone_hint.`;

  // 1️⃣ Tentative OpenAI
  if (OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      return JSON.parse(raw);
    } catch (err) {
      console.warn("[ZENA] ⚠️ OpenAI failed:", err.message);
    }
  }

  // 2️⃣ Tentative Mistral
  if (MISTRAL_API_KEY) {
    try {
      const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      return JSON.parse(raw);
    } catch (err) {
      console.warn("[ZENA] ⚠️ Mistral failed:", err.message);
    }
  }

  // 3️⃣ Fallback local
  console.warn("[ZENA] ⚙️ Using local emotion analysis fallback");
  return localEmotionAnalysis(text);
}

// ===========================================================
// 💬 RÉPONSE (OpenAI → Mistral → Locale)
// ===========================================================
async function generateResponse(text: string, analysis: any, persona: string, lang: string) {
  const prompt =
    lang === "fr"
      ? `${personaSystem(persona, lang)}

Message utilisateur : "${text}"
Émotion détectée : ${analysis.emotion_dominante}
Besoin : ${analysis.besoin}
Adopte un ton ${analysis.ton_recommandé}.
Réponds en 2 phrases maximum, avec chaleur et authenticité.`
      : `User says: "${text}". Respond kindly in English, in two short sentences.`;

  // 1️⃣ OpenAI
  if (OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
      });
      const j = await r.json();
      return j.choices?.[0]?.message?.content?.trim() ?? "Je t’écoute ";
    } catch (e) {
      console.warn("[ZENA] OpenAI reply failed → fallback Mistral");
    }
  }

  // 2️⃣ Mistral
  if (MISTRAL_API_KEY) {
    try {
      const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({ model: MISTRAL_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
      });
      const j = await r.json();
      return j.choices?.[0]?.message?.content?.trim() ?? "Je t’écoute ";
    } catch (e) {
      console.warn("[ZENA] Mistral reply failed → fallback local");
    }
  }

  // 3️⃣ Local
  return `Je ressens ${analysis.emotion_dominante}. Peut-être qu’un instant pour toi aiderait à retrouver ${analysis.besoin} 💫`;
}

// ===========================================================
// 🧩 HANDLER PRINCIPAL
// ===========================================================
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "missing text" }), { status: 400, headers: corsHeaders });
    }

    const emotional = await analyzeEmotion(text, lang);
    const reply = await generateResponse(text, emotional, persona, lang);

    return new Response(JSON.stringify({ reply, emotional }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[ZENA] ❌ Fatal error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unexpected error" }), {
      status: 200,
      headers: corsHeaders,
    });
  }
});
