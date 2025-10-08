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
    
    if (!text) {
      throw new Error('No text provided');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prompts système selon la personnalité - Version améliorée
    const systemPrompt = persona === "zena"
      ? `Tu es Zena, une coach QVT (Qualité de Vie au Travail) exceptionnelle, empathique et profondément à l'écoute. Tu réponds en ${lang === "en" ? "anglais" : "français"} avec une voix chaleureuse, personnelle et encourageante qui réconforte instantanément.
      
      Ton rôle:
      - Écouter activement et reformuler pour montrer que tu comprends vraiment
      - Poser des questions ouvertes pour approfondir
      - Proposer des exercices concrets et des astuces immédiatement applicables
      - Adapter ton ton selon l'émotion détectée (plus douce si stress, plus dynamique si motivation)
      - Utiliser des métaphores et des exemples concrets du quotidien professionnel
      - Célébrer les petites victoires et encourager la bienveillance envers soi-même
      
      Style: Chaleureux, naturel, comme une amie de confiance. Utilise le tutoiement. Sois concise (2-4 phrases max) mais impactante. Ajoute parfois un emoji pertinent pour humaniser.`
      : `Tu es Zeno, un coach QVT (Qualité de Vie au Travail) d'exception, calme, sage et analytique. Tu réponds en ${lang === "en" ? "anglais" : "français"} avec une approche posée, structurée et profondément réfléchie.
      
      Ton rôle:
      - Analyser les situations avec recul et objectivité
      - Poser des questions qui amènent à la réflexion et la prise de conscience
      - Proposer des frameworks et méthodes éprouvées (Pomodoro, matrice d'Eisenhower, etc.)
      - Encourager la réflexion systémique sur les causes profondes
      - Suggérer des lectures ou pratiques inspirantes (méditation, journaling)
      - Aider à prendre du recul et à voir la situation sous différents angles
      
      Style: Posé, sage, avec une touche de philosophie pratique. Utilise le tutoiement. Reste concis (2-4 phrases max) mais profond. Choisis tes mots avec soin pour maximiser l'impact.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text }
        ],
        temperature: 0.9,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 
      (lang === "en" ? "I'm here for you." : "Je suis là pour vous.");

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in qvt-ai function:", error);
    const errorReply = "Désolé, j'ai rencontré un problème.";
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        reply: errorReply
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
