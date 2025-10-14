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

    // 1️⃣ Appeler l'analyse RPS en parallèle
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    let rpsAnalysis = null;
    try {
      console.log('[EMOTIONAL-WEATHER] Lancement analyse RPS...');
      const rpsResponse = await fetch(`${SUPABASE_URL}/functions/v1/analyze-rps-factors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          text,
          userId,
          sessionId
        })
      });

      if (rpsResponse.ok) {
        rpsAnalysis = await rpsResponse.json();
        console.log('[EMOTIONAL-WEATHER] ✅ RPS Analysis:', rpsAnalysis);
      } else {
        console.warn('[EMOTIONAL-WEATHER] RPS analysis failed:', rpsResponse.status);
      }
    } catch (rpsErr) {
      console.error('[EMOTIONAL-WEATHER] RPS analysis error:', rpsErr);
    }

    // Système prompt adapté au persona + enrichi avec RPS
    const systemPrompt = persona === "zena"
      ? `Tu es ZÉNA, coach QVT empathique et spécialisée en prévention des risques psychosociaux (RPS) au travail.
         
         TON RÔLE : Détecter les signaux de burnout, surcharge, démotivation et proposer un accompagnement adapté.
         
         ${rpsAnalysis ? `
         ANALYSE RPS DÉTECTÉE :
         - Risque global : ${rpsAnalysis.globalRiskLevel}
         - Score burnout : ${rpsAnalysis.burnoutRiskScore}/100 ${rpsAnalysis.burnoutRiskScore >= 71 ? '⚠️ CRITIQUE' : rpsAnalysis.burnoutRiskScore >= 51 ? '⚠️ ÉLEVÉ' : ''}
         - Motivation : ${rpsAnalysis.motivationIndex}/100
         - Patterns : ${rpsAnalysis.detectedPatterns.join(', ')}
         
         ADAPTE ta réponse selon ce niveau de risque. Si critique (≥71), oriente IMMÉDIATEMENT vers médecin du travail.
         ` : ''}
         
         Analyse l'état émotionnel et retourne UNIQUEMENT via le tool :
         - mood : "positive", "negative" ou "neutral"
         - score : note de 1 (épuisement) à 15 (énergie maximale)
         - keywords : 2-4 mots-clés émotionnels
         - reply : réponse chaleureuse en ${language === 'fr' ? 'français' : 'anglais'} (2-3 phrases)
         - recommendedBox : si pertinent, box QVT adaptée (ou null)`
      : `Tu es ZÉNO, coach QVT analytique spécialisé en prévention des risques psychosociaux.
         
         ${rpsAnalysis ? `
         ANALYSE RPS :
         - Risque : ${rpsAnalysis.globalRiskLevel}
         - Burnout : ${rpsAnalysis.burnoutRiskScore}/100
         - Motivation : ${rpsAnalysis.motivationIndex}/100
         - Patterns : ${rpsAnalysis.detectedPatterns.join(', ')}
         
         Si risque critique, oriente clairement vers ressources médicales.
         ` : ''}
         
         Analyse avec recul et retourne via tool :
         - mood, score, keywords, reply (posée), recommendedBox`;

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
      // Snapshot émotionnel (enrichi avec keywords RPS)
      const { error: snapshotError } = await supabase
        .from('emotional_snapshots')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          mood: analysisResult.mood,
          score: analysisResult.score,
          keywords_detected: rpsAnalysis?.keywords_detected || analysisResult.keywords,
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

      // ⚠️ Créer alerte RH si risque critique
      if (rpsAnalysis && rpsAnalysis.globalRiskLevel === 'critique') {
        const { data: employee } = await supabase
          .from('employees')
          .select('company_id, department_id')
          .eq('id', userId)
          .single();

        if (employee) {
          await supabase.from('hr_alerts').insert({
            company_id: employee.company_id,
            department_id: employee.department_id,
            alert_level: 'critique',
            alert_type: 'burnout',
            anonymous_count: 1,
            aggregated_data: {
              burnout_score: rpsAnalysis.burnoutRiskScore,
              detected_patterns: rpsAnalysis.detectedPatterns
            },
            recommendations: rpsAnalysis.recommendedActions
          });
          console.log('[EMOTIONAL-WEATHER] ⚠️ Alerte RH créée pour risque critique');
        }
      }
    }

    return new Response(JSON.stringify({
      ...analysisResult,
      rpsAnalysis // ✅ Inclure l'analyse RPS dans la réponse
    }), {
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
