import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utilitaire pour normaliser les émotions → score QVT
function getEmotionScore(mood: string): number {
  const map: Record<string, number> = {
    "épuisement": 2,
    "stress": 5,
    "tristesse": 6,
    "inquiet": 7,
    "fatigue": 8,
    "neutre": 10,
    "motivé": 12,
    "positif": 14,
    "enthousiaste": 15,
  };
  return map[mood.toLowerCase()] || 10;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();

    if (!text || text.trim().length < 2) {
      throw new Error("Aucun texte à analyser");
    }

    const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Priorité : Mistral (RGPD), fallback vers OpenAI puis Lovable
    let provider = "mistral";
    let endpoint = "https://api.mistral.ai/v1/chat/completions";
    let apiKey = MISTRAL_API_KEY;
    let model = "mistral-large-latest";

    if (!MISTRAL_API_KEY && OPENAI_API_KEY) {
      provider = "openai";
      endpoint = "https://api.openai.com/v1/chat/completions";
      apiKey = OPENAI_API_KEY;
      model = "gpt-4o-mini";
    } else if (!MISTRAL_API_KEY && !OPENAI_API_KEY && LOVABLE_API_KEY) {
      provider = "lovable";
      endpoint = "https://ai.gateway.lovable.dev/v1/chat/completions";
      apiKey = LOVABLE_API_KEY;
      model = "google/gemini-2.5-flash";
    }

    console.log(`🤖 Provider sélectionné : ${provider}`);

    const personaPrompt =
      persona === "zena"
        ? `Tu es Zéna, une IA émotionnelle empathique et bienveillante spécialisée en qualité de vie au travail. 
          Tu écoutes avec attention, tu reformules avec douceur et tu proposes des pistes concrètes pour aider à se sentir mieux.
          Réponds en ${lang === "en" ? "anglais" : "français"}, avec un ton humain, clair et apaisant (2 à 4 phrases max). 
          Termine parfois ta réponse par un emoji subtil adapté à l’émotion détectée.`
        : `Tu es Zéno, un coach calme et réfléchi spécialisé en équilibre professionnel et gestion du stress. 
          Réponds en ${lang === "en" ? "anglais" : "français"}, avec sagesse et structure. 
          Sois concis mais profond, et ajoute parfois une touche de sérénité 🌿.`;

    // Appel IA
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: personaPrompt },
          {
            role: "user",
            content: `Analyse ce message pour détecter l'émotion principale 
            (comme stress, fatigue, motivation, tristesse, enthousiasme, etc.), 
            puis formule une réponse bienveillante adaptée : "${text}"`,
          },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error:", response.status, errorText);
      throw new Error(`Erreur API IA : ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Je suis là pour toi 💜";

    // Tentative d'extraction de l'émotion
    const emotionMatch = reply.match(/(stress|fatigue|motivation|tristesse|enthousiasme|positif|neutre|épuisement)/i);
    const mood = emotionMatch ? emotionMatch[1].toLowerCase() : "neutre";
    const score = getEmotionScore(mood);

    console.log("✅ Analyse émotionnelle :", { mood, score });

    return new Response(
      JSON.stringify({ reply, mood, score, provider }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("❌ Erreur dans zena-analyze:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
