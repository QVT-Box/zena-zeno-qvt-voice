import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, persona = "zena", lang = "fr" } = await req.json();

    if (!text) throw new Error("Aucun texte fourni");

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("LOVABLE_API_KEY");
    const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");

    if (!OPENAI_API_KEY && !MISTRAL_API_KEY) {
      throw new Error("Aucune clé IA (OpenAI/Mistral) configurée");
    }

    const prompt = persona === "zena"
      ? `Analyse ce message de manière émotionnelle et synthétique. Donne :
        1️⃣ l'humeur détectée (positive, neutre, négative)
        2️⃣ une note émotionnelle sur 15
        3️⃣ une recommandation QVT concrète.
        Message: "${text}"`
      : `Analyse ce message avec recul et méthode (Zéno).
        Donne :
        1️⃣ la tonalité émotionnelle
        2️⃣ une évaluation sur 15
        3️⃣ un conseil pratique de gestion pro ou perso.
        Message: "${text}"`;

    // Utilisation préférentielle de Mistral si dispo
    const apiUrl = MISTRAL_API_KEY
      ? "https://api.mistral.ai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY || OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_API_KEY ? "mistral-medium" : "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es une IA d'analyse émotionnelle QVT Box." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ API Error:", response.status, error);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Analyse indisponible.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("❌ Erreur analyse:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
