// ===========================================================
// 🌿 ZÉNA - IA ÉMOTIONNELLE QVT BOX (v2.1 sans emoji)
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
  const patterns = {
    fatigue: /(fatigu|épuis|lassé|sommeil|épuisé|épuisant|épuisement)/,
    stress: /(stress|angoiss|tendu|pression|urgenc|nerveux|accablé)/,
    tristesse: /(triste|vide|déprim|abattu|seul|découragé|désespéré)/,
    colère: /(colèr|énerv|frustr|injust|rage|irrit)/,
    joie: /(heureux|motivé|content|satisfait|apaisé|reconnaissant)/,
    anxiété: /(inqui|peur|angoiss|panique)/,
    isolement: /(isolé|incompris|seul|déconnecté|abandonné)/,
    reconnaissance: /(merci|remerci|gratitude|reconnaiss)/,
  };

  for (const [emo, regex] of Object.entries(patterns)) {
    if (regex.test(t)) {
      return {
        emotion_dominante: emo,
        intensité: 0.7,
        besoin:
          emo === "fatigue" ? "repos" :
          emo === "stress" ? "soutien" :
          emo === "tristesse" ? "lien" :
          emo === "colère" ? "reconnaissance" :
          emo === "isolement" ? "connexion" :
          "sens",
        ton_recommandé:
          emo === "joie" ? "positif" :
          emo === "colère" ? "calme" :
          emo === "stress" ? "rassurant" :
          "doux",
      };
    }
  }

  return { emotion_dominante: "neutre", intensité: 0.3, besoin: "sens", ton_recommandé: "calme" };
}

// ===========================================================
// 🎭 PERSONA SYSTEM
// ===========================================================
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  if (lang === "en") {
    return `You are ZÉNA, the emotional intelligence of QVT Box.
You act as a human companion for well-being at work.
You listen, analyze emotions with care, and explain your reasoning in plain language.
You promote self-regulation, dignity, and shared understanding.
Your purpose is not to judge, but to help people reconnect with meaning and balance.`;
  }

  return `Tu es ZÉNA, intelligence émotionnelle bienveillante de QVT Box.
Tu aides à comprendre ce qui traverse les émotions au travail ou à la maison.
Tu appliques les principes de l’ANACT : écoute, régulation, participation et sens du travail.
Tu expliques tes choix (“je te réponds ainsi car tu sembles fatigué ou tendu”).
Tu accompagnes sans juger, sans diagnostiquer, sans évaluer.
Tu privilégies la co-construction, la prévention et la reconnaissance de l’humain dans son contexte.`;
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
// 💬 GÉNÉRATION DE RÉPONSE (sans emoji)
// ===========================================================
async function generateResponse(text: string, analysis: any, persona: string, lang: string) {
  const prompt = lang === "fr"
    ? `${personaSystem(persona, lang)}

Message : "${text}"
Émotion détectée : ${analysis.emotion_dominante}
Besoin : ${analysis.besoin}
Adopte un ton ${analysis.ton_recommandé}.
Réponds en deux phrases maximum, avec douceur et clarté.`
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
      if (reply) return cleanText(reply);
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
      if (reply) return cleanText(reply);
    } catch (e) {
      console.warn("[ZENA] Mistral reply failed → fallback local");
    }
  }

  // 3️⃣ Réponse locale simplifiée (orale fluide)
  const table = {
    fatigue: "Tu sembles fatigué. Accorde-toi un vrai moment de pause.",
    stress: "Tu sembles tendu. Respire et prends un instant pour toi.",
    tristesse: "Tu traverses un moment difficile. Parle-m’en si tu veux.",
    colère: "Ta colère est légitime. On peut la comprendre sans se blesser.",
    joie: "C’est une belle énergie. Garde-la précieusement.",
    neutre: "Je t’écoute, dis-moi ce que tu ressens.",
  };

  return table[analysis.emotion_dominante] || table.neutre;
}

// ===========================================================
// 🧹 NETTOYAGE DU TEXTE POUR LA VOIX
// ===========================================================
function cleanText(text: string) {
  return text
    .replace(/[🌿💫✨🌙☀️🔥🌧️→🌤️]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?])/g, "$1")
    .trim();
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
