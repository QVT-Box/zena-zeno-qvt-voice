import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supa = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const MISTRAL_API_KEY = Deno.env.get("MISTRAL_API_KEY");

const EMB_MODEL = "text-embedding-3-small";
const OPENAI_CHAT = "gpt-4o-mini";
const MISTRAL_CHAT = "mistral-small-latest";

type Body = {
  tenant_id?: string;
  text: string;
  persona?: "zena" | "zeno";
  lang?: "fr" | "en";
  provider?: "openai" | "mistral";
  k?: number;
};

function personaSystem(p: "zena" | "zeno" = "zena", lang: "fr" | "en" = "fr") {
  const zenaFR = `Tu es ZÉNA, coach QVT pour salariés et managers, chaleureuse, empathique, concrète, non médicale.`;
  const zenoFR = `Tu es ZÉNO, coach QVT pour salariés et managers, calme, structuré, concis, non médical.`;
  const zenaEN = `You are ZÉNA, a warm, empathetic workplace wellbeing coach. No medical advice.`;
  const zenoEN = `You are ZÉNO, a calm, structured workplace wellbeing coach. No medical advice.`;
  return lang === "en"
    ? p === "zena"
      ? zenaEN
      : zenoEN
    : p === "zena"
    ? zenaFR
    : zenoFR;
}

function detectMood(t: string): "positive" | "neutral" | "negative" | "distress" {
  const s = t.toLowerCase();
  if (/(suicide|me faire du mal|plus envie|détresse|detresse)/.test(s))
    return "distress";
  if (/(stress|épuis|epuis|burnout|angoisse|anxieux|fatigué|fatigue)/.test(s))
    return "negative";
  if (/(bien|motivé|motivation|heureux|content|confiant)/.test(s))
    return "positive";
  return "neutral";
}

function styleFor(
  m: ReturnType<typeof detectMood>,
  lang: "fr" | "en"
): string {
  const FR = {
    distress:
      "Parle doucement, rassure, oriente vers lignes d'écoute/urgent + référent interne.",
    negative:
      "Empathique, normalise l'émotion, propose 2 actions concrètes rapides.",
    positive: "Valorise l'élan, propose 1 action pour entretenir.",
    neutral: "Curiosité bienveillante, questions ouvertes, synthèse brève.",
  };
  const EN = {
    distress:
      "Speak softly, reassure, recommend helplines/urgent care + internal contact.",
    negative: "Empathetic, normalize emotion, propose 2 concrete quick actions.",
    positive: "Reinforce momentum with 1 small action.",
    neutral: "Warm curiosity, open questions, brief synthesis.",
  };
  const dict = lang === "en" ? EN : FR;
  return dict[m];
}

async function embed(text: string) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: EMB_MODEL, input: text }),
  });
  if (!res.ok) throw new Error(`embed ${res.status}`);
  const json = await res.json();
  return json.data[0].embedding as number[];
}

async function retrieve(tenant_id: string, qEmbedding: number[], k = 5) {
  const { data, error } = await supa.rpc("match_chunks", {
    p_tenant_id: tenant_id,
    p_query_embedding: JSON.stringify(qEmbedding),
    p_match_count: k,
  });
  if (error) {
    console.error("[qvt-ai] Error retrieving chunks:", error);
    throw error;
  }
  return (data || []) as {
    title: string;
    content: string;
    tags: string[];
    similarity: number;
  }[];
}

async function callOpenAI(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ model: OPENAI_CHAT, messages, temperature: 0.7 }),
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}

async function callMistral(messages: any[]) {
  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_CHAT,
      messages,
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`mistral ${res.status}`);
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() ?? "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      tenant_id,
      text,
      persona = "zena",
      lang = "fr",
      provider = "openai",
      k = 5,
    } = (await req.json()) as Body;

    if (!text) {
      return new Response(JSON.stringify({ error: "missing text" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    console.log(`[qvt-ai] Processing request for persona ${persona}, lang ${lang}, provider ${provider}`);

    const mood = detectMood(text);
    const style = styleFor(mood, lang);

    let ctx = "";
    let used_chunks = 0;

    // Si un tenant_id est fourni, faire du RAG
    if (tenant_id) {
      try {
        console.log(`[qvt-ai] Retrieving context for tenant ${tenant_id}`);
        const qEmb = await embed(text);
        const chunks = await retrieve(tenant_id, qEmb, k);
        used_chunks = chunks.length;
        ctx = chunks.map((c, i) => `- ${c.title ?? "Doc"} : ${c.content}`).join("\n");
        console.log(`[qvt-ai] Retrieved ${used_chunks} chunks`);
      } catch (err) {
        console.error("[qvt-ai] Error in RAG retrieval:", err);
        // Continue sans contexte
      }
    }

    const sys = personaSystem(persona, lang);
    const consignes =
      lang === "en"
        ? `Use the internal context when relevant. If missing, say so and suggest generic options.
         End with 1–3 concrete actions suitable for the company.
         Style hint: ${style}`
        : `Utilise le contexte interne quand pertinent. S'il manque, dis-le et propose des pistes génériques.
         Termine par 1–3 actions concrètes adaptées à l'entreprise.
         Indice de style: ${style}`;

    const messages = [
      { role: "system", content: sys },
      ...(ctx
        ? [
            {
              role: "system",
              content:
                (lang === "en" ? "[Internal context]\n" : "[Contexte interne]\n") +
                ctx,
            },
          ]
        : []),
      {
        role: "system",
        content:
          (lang === "en" ? "[Guidelines]\n" : "[Consignes]\n") + consignes,
      },
      { role: "user", content: text },
    ];

    console.log(`[qvt-ai] Calling ${provider} API`);
    const reply =
      provider === "mistral"
        ? await callMistral(messages)
        : await callOpenAI(messages);

    console.log(`[qvt-ai] Response generated successfully`);

    return new Response(
      JSON.stringify({ reply, mood, used_chunks }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("[qvt-ai] Fatal error:", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
