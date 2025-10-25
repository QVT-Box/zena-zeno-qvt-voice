// ===========================================================
// 🌿 ZÉNA - IA ÉMOTIONNELLE QVT BOX (v2)
// Triple fallback + mémoire émotionnelle (Supabase)
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
// ❤️ ANALYSE ÉMOTIONNELLE LOCALE
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
  } else if (/(motivé|heureux|bien|content|serein|inspiré)/.test(t)) {
    emotion = "joie"; besoin = "partage"; intensité = 0.6; ton = "positif";
  }

  return { emotion_dominante: emotion, intensité, besoin, ton_recommandé: ton };
}

// ===========================================================
// 🎭 PERSONA SYSTEM
// ===========================================================
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  const zenaFR = `Tu es ZÉNA, intelligence émotionnelle de QVT Box.
Tu écoutes avec douceur, identifies les émotions et aides la personne à retrouver du sens et du calme.
Ton ton est humain, fluide, sincère et lumineux.`;
  const zenoFR = `Tu es ZÉNO, coach analytique QVT, calme et logique.`;
  const zenaEN = `You are ZÉNA, the emotional intelligence of QVT Box. You listen deeply and respond with empathy.`;

  return lang === "en" ? zenaEN : p === "zena" ? zenaFR : zenoFR;
}

// ===========================================================
// 🧠 ANALYSE ÉMOTIONNELLE (OpenAI → Mistral → locale)
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

  // 1️⃣ OpenAI
  if (OPENAI_API_KEY) {
    try {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.3 }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      try {
        return JSON.parse(raw);
      } catch {
        return localEmotionAnalysis(text);
      }
    } catch (err) {
      console.warn("[ZENA] ⚠️ OpenAI failed:", err.message);
    }
  }

  // 2️⃣ Mistral
  if (MISTRAL_API_KEY) {
    try {
      const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({ model: MISTRAL_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.4 }),
      });
      const j = await r.json();
      const raw = j.choices?.[0]?.message?.content || "";
      try {
        return JSON.parse(raw);
      } catch {
        return localEmotionAnalysis(text);
      }
    } catch (err) {
      console.warn("[ZENA] ⚠️ Mistral failed:", err.message);
    }
  }

  // 3️⃣ Fallback local
  return localEmotionAnalysis(text);
}

// ===========================================================
// 💬 GÉNÉRATION DE RÉPONSE
// ===========================================================
async function generateResponse(text: string, analysis: any, persona: string, lang: string) {
  const prompt = lang === "fr"
    ? `${personaSystem(persona, lang)}

Message : "${text}"
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
      const reply = j.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
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
      const reply = j.choices?.[0]?.message?.content?.trim();
      if (reply) return reply;
    } catch (e) {
      console.warn("[ZENA] Mistral reply failed → fallback local");
    }
  }

  // 3️⃣ Réponse locale améliorée
  const table = {
    fatigue: "Je sens que tu as besoin de repos. Accorde-toi un moment de calme, même court 🌙",
    stress: "Respire un peu. Tu fais déjà ton maximum, et c’est suffisant pour aujourd’hui 💫",
    tristesse: "Parle-moi, tu n’es pas seul(e). Les émotions ne durent pas toujours 🌧️→🌤️",
    colère: "Ta colère dit quelque chose d’important. On peut la comprendre sans se blesser 🔥",
    joie: "Quel beau moment ! Profite et partage ce sentiment, il t’appartient ☀️",
    neutre: "Je t’écoute, raconte-moi ce qui te traverse 🌿",
  };

  return table[analysis.emotion_dominante] || table.neutre;
}

// ===========================================================
// 🧩 MÉMOIRE ÉMOTIONNELLE
// ===========================================================
async function saveMemory(text: string, emotional: any, reply: string) {
  try {
    await supa.from("zena_memory").insert({
      message: text,
      emotion: emotional?.emotion_dominante || "inconnue",
      intensity: emotional?.intensité || 0,
      need: emotional?.besoin || "non défini",
      tone: emotional?.ton_recommandé || "calme",
      reply,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[ZENA] ⚠️ Memory save failed:", e.message);
  }
}

// ===========================================================
// 🚀 HANDLER PRINCIPAL
// ===========================================================
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();
    if (!text?.trim()) return new Response(JSON.stringify({ error: "missing text" }), { status: 400, headers: corsHeaders });

    const emotional = await analyzeEmotion(text, lang);
    const reply = await generateResponse(text, emotional, persona, lang);
    await saveMemory(text, emotional, reply);

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
