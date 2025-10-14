import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmotionalAnalysis {
  mood: "positive" | "negative" | "neutral";
  score: number;
  keywords: string[];
  reply: string;
  recommendedBox: {
    name: string;
    theme: string;
    description: string;
  } | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, persona, language, userId, sessionId } = await req.json();
    
    if (!text) {
      throw new Error('Le texte est requis');
    }

    console.log(`[EMOTIONAL-WEATHER] Analyse pour ${persona} (${language}): "${text}"`);

    // Système prompt adapté au persona
    const systemPrompt = persona === "zena"
      ? `Tu es ZÉNA, coach QVT empathique et chaleureuse spécialisée en qualité de vie au travail.
         Analyse l'état émotionnel de l'utilisateur et retourne UNIQUEMENT via le tool :
         - mood : "positive", "negative" ou "neutral"
         - score : note de 1 (épuisement total) à 15 (énergie maximale)
         - keywords : 2-4 mots-clés émotionnels détectés (ex: ["stress", "fatigue"])
         - reply : réponse réconfortante et encourageante en ${language === 'fr' ? 'français' : 'anglais'} (2-3 phrases max)
         - recommendedBox : si pertinent, suggère une box QVT adaptée (sinon null)`
      : `Tu es ZÉNO, coach QVT analytique et posé spécialisé en qualité de vie au travail.
         Analyse l'état émotionnel avec recul et méthode et retourne UNIQUEMENT via le tool :
         - mood : "positive", "negative" ou "neutral"
         - score : note de 1 (épuisement total) à 15 (énergie maximale)
         - keywords : 2-4 mots-clés émotionnels détectés
         - reply : réponse posée et structurée en ${language === 'fr' ? 'français' : 'anglais'} (2-3 phrases max)
         - recommendedBox : si pertinent, suggère une box QVT adaptée (sinon null)`;

    // Tool calling pour extraction structurée
    const tools = [{
      type: "function",
      function: {
        name: "generate_emotional_analysis",
        description: "Analyse émotionnelle structurée pour la qualité de vie au travail",
        parameters: {
          type: "object",
          properties: {
            mood: { type: "string", enum: ["positive", "negative", "neutral"] },
            score: { type: "integer", minimum: 1, maximum: 15 },
            keywords: { type: "array", items: { type: "string" } },
            reply: { type: "string" },
            recommendedBox: {
              type: "object",
              properties: {
                name: { type: "string" },
                theme: { type: "string" },
                description: { type: "string" }
              },
              nullable: true
            }
          },
          required: ["mood", "score", "keywords", "reply"]
        }
      }
    }];

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: text }
    ];

    let analysisResult: EmotionalAnalysis | null = null;
    let errorMsg = "";

    // 1️⃣ Essayer Mistral en priorité
    const MISTRAL_API_KEY = Deno.env.get('MISTRAL_API_KEY');
    if (MISTRAL_API_KEY && !analysisResult) {
      try {
        console.log("[EMOTIONAL-WEATHER] Tentative avec Mistral...");
        const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mistral-medium-latest',
            messages,
            tools,
            tool_choice: "any",
            temperature: 0.7,
          }),
        });

        if (mistralResponse.ok) {
          const mistralData = await mistralResponse.json();
          const toolCall = mistralData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            analysisResult = JSON.parse(toolCall.function.arguments);
            console.log("[EMOTIONAL-WEATHER] ✅ Mistral OK");
          }
        } else {
          errorMsg += `Mistral: ${mistralResponse.status}; `;
        }
      } catch (e) {
        console.error("[EMOTIONAL-WEATHER] Mistral error:", e);
        errorMsg += `Mistral: ${e instanceof Error ? e.message : String(e)}; `;
      }
    }

    // 2️⃣ Fallback ChatGPT
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (OPENAI_API_KEY && !analysisResult) {
      try {
        console.log("[EMOTIONAL-WEATHER] Tentative avec ChatGPT...");
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages,
            tools,
            tool_choice: { type: "function", function: { name: "generate_emotional_analysis" } },
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          const toolCall = openaiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            analysisResult = JSON.parse(toolCall.function.arguments);
            console.log("[EMOTIONAL-WEATHER] ✅ ChatGPT OK");
          }
        } else {
          errorMsg += `ChatGPT: ${openaiResponse.status}; `;
        }
      } catch (e) {
        console.error("[EMOTIONAL-WEATHER] ChatGPT error:", e);
        errorMsg += `ChatGPT: ${e instanceof Error ? e.message : String(e)}; `;
      }
    }

    // 3️⃣ Fallback Lovable AI (Gemini)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!analysisResult) {
      try {
        console.log("[EMOTIONAL-WEATHER] Tentative avec Lovable AI (Gemini)...");
        const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages,
            tools,
            tool_choice: { type: "function", function: { name: "generate_emotional_analysis" } },
          }),
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const toolCall = geminiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall?.function?.arguments) {
            analysisResult = JSON.parse(toolCall.function.arguments);
            console.log("[EMOTIONAL-WEATHER] ✅ Lovable AI OK");
          }
        } else {
          errorMsg += `Lovable AI: ${geminiResponse.status}; `;
        }
      } catch (e) {
        console.error("[EMOTIONAL-WEATHER] Lovable AI error:", e);
        errorMsg += `Lovable AI: ${e instanceof Error ? e.message : String(e)}; `;
      }
    }

    if (!analysisResult) {
      throw new Error(`Tous les modèles ont échoué: ${errorMsg}`);
    }

    // 💾 Sauvegarder dans Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (sessionId) {
      // Snapshot émotionnel
      const { error: snapshotError } = await supabase
        .from('emotional_snapshots')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          mood: analysisResult.mood,
          score: analysisResult.score,
          keywords_detected: analysisResult.keywords,
        });
      
      if (snapshotError) {
        console.error("[EMOTIONAL-WEATHER] Erreur sauvegarde snapshot:", snapshotError);
      }

      // Messages de conversation
      const { error: msgError } = await supabase
        .from('conversation_messages')
        .insert([
          { session_id: sessionId, from_role: 'user', text },
          { session_id: sessionId, from_role: persona, text: analysisResult.reply }
        ]);
      
      if (msgError) {
        console.error("[EMOTIONAL-WEATHER] Erreur sauvegarde messages:", msgError);
      }

      // Box recommandée
      if (analysisResult.recommendedBox) {
        const { error: boxError } = await supabase
          .from('box_recommendations')
          .insert({
            user_id: userId || null,
            session_id: sessionId,
            box_name: analysisResult.recommendedBox.name,
            box_theme: analysisResult.recommendedBox.theme,
            box_description: analysisResult.recommendedBox.description,
          });
        
        if (boxError) {
          console.error("[EMOTIONAL-WEATHER] Erreur sauvegarde box:", boxError);
        }
      }
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[EMOTIONAL-WEATHER] Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
