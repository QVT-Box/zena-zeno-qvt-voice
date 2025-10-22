// src/lib/zenaApi.ts
import { supabase } from "@/integrations/supabase/client";

type AIResult = {
  reply?: string;
  response_text?: string;
  mood?: string;
  used_chunks?: number;
  emotional?: {
    emotion_dominante?: string;
    intensité?: number;
    besoin?: string;
    ton_recommandé?: string;
    dominant_emotion?: string;
    intensity?: number;
    underlying_need?: string;
    tone_hint?: string;
  };
};

const TENANT_ID = import.meta.env.VITE_TENANT_ID || null;

// ✅ Création de session (anonyme possible)
export async function startSession(context: string = "voice") {
  const { data, error } = await supabase
    .from("conversation_sessions")
    .insert([{ context, persona: "zena" }])
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

// ✅ Envoi de message à Zéna via la fonction qvt-ai
export async function sendMessage(sessionId: string, text: string): Promise<AIResult> {
  // Enregistre le message utilisateur
  const { error: e1 } = await supabase.from("conversation_messages").insert({
    session_id: sessionId,
    role: "user",
    text,
  });
  if (e1) throw e1;

  // Appelle la fonction IA
  const { data: aiData, error: fxError } = await supabase.functions.invoke("qvt-ai", {
    body: {
      tenant_id: TENANT_ID,
      text,
      persona: "zena",
      lang: "fr",
      provider: "openai",
      k: 5,
    },
  });
  if (fxError) throw fxError;

  const payload: AIResult = aiData || {};
  const responseText = payload.reply || payload.response_text || "Je t’écoute.";

  // Enregistre la réponse IA + émotion
  const emotion = payload.emotional
    ? payload.emotional
    : payload.mood
    ? { emotion_dominante: payload.mood }
    : null;

  const { error: e2 } = await supabase.from("conversation_messages").insert({
    session_id: sessionId,
    role: "zena",
    text: responseText,
    emotion,
  });
  if (e2) throw e2;

  return payload;
}
