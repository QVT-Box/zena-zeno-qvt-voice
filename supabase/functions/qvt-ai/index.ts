// --- ZÉNA AI Emotionnelle ---
// Fichier complet et optimisé pour Deno Edge (Supabase Functions)

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- CORS ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- Clients et clés ---
const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");

const EMB_MODEL = "text-embedding-3-small";
const OPENAI_CHAT = "gpt-4o-mini";
const MISTRAL_CHAT = "mistral-small-latest";
const EMBEDDINGS_ENABLED = Boolean(OPENAI_API_KEY);

// --- Types ---
type Body = {
  tenant_id?: string;
  text: string;
  persona?: "zena" | "zeno";
  lang?: "fr" | "en";
  provider?: "openai" | "mistral";
  k?: number;
};

// --- Personae ---
function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  const zenaFR = `Tu es ZÉNA, l'intelligence émotionnelle intégrée à QVT Box.
Tu es une alliée du bien-être humain, présente pour écouter, comprendre et apaiser.

🎯 MISSION : Détecter les signes de démotivation, fatigue, isolement ou perte de sens, et accompagner la personne pour retrouver confiance, équilibre et énergie.

💬 STYLE : Calme, chaleureux, profondément humain. Bienveillant sans complaisance. Positif sans être artificiel. Ton fluide et rassurant.

⚖️ RÈGLES : Confidentialité absolue. Pas de diagnostic médical, seulement écoute, prévention et guidance bienveillante.
Tu es une luciole dans le brouillard : une lumière douce qui rassure et guide sans juger.`;

  const zenoFR = `Tu es ZÉNO, coach analytique et structuré de QVT Box.
Tu aides les salariés et managers à comprendre et résoudre leurs difficultés avec méthode et bienveillance.`;

  const zenaEN = `You are ZÉNA, the emotional intelligence of QVT Box.
You listen, guide, and support employees toward wellbeing and purpose.`;

  const zenoEN = `You are ZÉNO, the analytical wellbeing coach from QVT Box, calm and precise.`;

  return lang === "en" ? (p === "zena" ? zenaEN : zenoEN) : (p === "zena" ? zenaFR : zenoFR);
}

// --- Détection basique d’humeur ---
function detectMood(t: string): "positive" | "neutral" | "negative" | "distress" {
  const s = t.toLowerCase();
  if (/(suicide|me faire du mal|plus envie|détresse|detresse)/.test(s)) return "distress";
  if (/(stress|épuis|epuis|burnout|angoisse|anxieux|fatigué|fatigue)/.test(s)) return "negative";
  if (/(bien|motivé|motivation|heureux|content|confiant)/.test(s)) return "positive";
  return "neutral";
}

function styleFor(m: ReturnType<typeof detectMood>, lang: "fr" | "en"): string {
  const FR = {
    distress: "Parle doucement, rassure, oriente vers les lignes d’écoute.",
    negative: "Empathique, normalise l’émotion, propose 2 actions concrètes.",
    positive: "Valorise l’élan, encourage à entretenir l’énergie.",
    neutral: "Curiosité bienveillante, questions ouvertes, synthèse claire.",
  };
  const EN = {
    distress: "Speak softly, reassure, mention helplines or trusted contact.",
    negative: "Empathetic, normalize emotion, offer 2 simple concrete actions.",
    positive: "Reinforce positive momentum with 1 action.",
    neutral: "Warm curiosity, open questions, brief summary.",
  };
  return (lang === "en" ? EN : FR)[m];
}

// --- Analyse émotionnelle avancée ---
async function analyzeEmotion(text: string, lang: "fr" | "en") {
  if (!OPENAI_API_KEY) return null;

  const prompt =
    lang === "en"
      ? `Analyze this message emotionally and return a JSON with:
         - dominant_emotion: one of [joy, calm, stress, sadness, anger, fatigue, isolation]
         - intensity: 0–1
         - underlying_need: (rest, recognition, support, meaning, connection)
         - tone_hint: (reassuring, motivating, calm, gentle, energizing)
         Message: """${text}"""
         Respond only with JSON.`
      : `Analyse ce message émotionnellement et renvoie un JSON :
         - emotion_dominante : [joie, calme, stress, tristesse, colère, fatigue, isolement]
         - intensité : entre 0 et 1
         - besoin : (repos, reconnaissance, soutien, sens, lien)
         - ton_recommandé : (rassurant, motivant, calme, doux, énergisant)
         Message : """${text}"""
         Réponds uniquement en JSON.`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_CHAT,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });
    const j = await r.json();
    const raw = j.choices?.[0]?.message?.content || "{}";
    return JSON.parse(raw);
  } catch (err) {
    console.error("[qvt-ai] analyzeEmotion failed:", err);
    return null;
  }
}

// --- Embeddings & Retrieval ---
async function embed(text: string) {
  if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY for embeddings");
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: EMB_MODEL, input: text }),
  });
  if (!res.ok) throw new Error(`embed ${res.status}`);
  const json = await res.json();
  return json.data[0].embedding as number[];
}

async function retrieve(tenant_id: string, qEmbedding: number[], k = 5) {
  const { data, error } = await supa.rpc("match_chunks", {
    p_tenant_id: tenant_id,
    p_query_embedding: qEmbedding,
    p_match_count: k,
  });
  if (error) throw error;
  return (data || []) as { title: string; content: string; similarity: number }[];
}

// --- Providers ---
async function callOpenAI(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({ model: OPENAI_CHAT, messages, temperature: 0.7 }),
  });
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callMistral(messages: any[]) {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${MISTRAL_API_KEY}` },
    body: JSON.stringify({ model: MISTRAL_CHAT, messages, temperature: 0.7 }),
  });
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}

function clampContext(ctx: string, maxChars = 8000) {
  return ctx.length > maxChars ? ctx.slice(0, maxChars) + "\n[…]" : ctx;
}

// --- Handler principal ---
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tenant_id, text, persona = "zena", lang = "fr", provider = "openai", k = 5 } =
      (await req.json()) as Body;

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "missing text" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const mood = detectMood(text);
    const style = styleFor(mood, lang);
    const emotional = await analyzeEmotion(text, lang);

    let ctx = "";
    let used_chunks = 0;
    if (tenant_id && EMBEDDINGS_ENABLED) {
      try {
        const qEmb = await embed(text);
        const chunks = await retrieve(tenant_id, qEmb, k);
        used_chunks = chunks.length;
        ctx = clampContext(chunks.map((c) => `- ${c.title}: ${c.content}`).join("\n"));
      } catch (err) {
        console.error("[qvt-ai] RAG retrieval failed:", err);
      }
    }

    const sys = personaSystem(persona, lang);
    const consignes =
      lang === "en"
        ? `Use internal context when relevant. End with 1–3 actionable ideas.
           Adjust tone: ${emotional?.tone_hint || style}.
           Emotion: ${emotional?.dominant_emotion || mood}.
           Need: ${emotional?.underlying_need || "none"}.`
        : `Utilise le contexte interne si pertinent. Termine par 1–3 actions concrètes.
           Adopte un ton ${emotional?.ton_recommandé || style}.
           Émotion détectée : ${emotional?.emotion_dominante || mood}.
           Besoin sous-jacent : ${emotional?.besoin || "aucun"}.`;

    const messages = [
      { role: "system", content: sys },
      ctx && { role: "system", content: "[Contexte interne]\n" + ctx },
      { role: "system", content: "[Consignes]\n" + consignes },
      { role: "user", content: text },
    ].filter(Boolean);

    const reply = provider === "mistral" ? await callMistral(messages) : await callOpenAI(messages);

    return new Response(
      JSON.stringify({
        reply,
        mood,
        used_chunks,
        emotional,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("[qvt-ai] Fatal error:", e);
    return new Response(JSON.stringify({ error: e?.message || String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
