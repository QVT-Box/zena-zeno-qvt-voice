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

/**
 * ✅ Création de session (bilingue + persona)
 */
export async function startSession(context: string = "voice"): Promise<string> {
  try {
    const language = navigator.language?.startsWith("en") ? "en" : "fr";

    const { data, error } = await supabase
      .from("conversation_sessions")
      .insert([
        {
          context,
          persona: "zena",
          language,
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    console.log("✅ Nouvelle session Zéna :", data.id);
    return data.id as string;
  } catch (err) {
    console.error("❌ Erreur création session Zéna :", err);
    throw err;
  }
}

/**
 * ✅ Envoi du message à la fonction qvt-ai
 */
export async function sendMessage(sessionId: string, text: string): Promise<AIResult> {
  try {
    // Enregistre le message utilisateur dans la base
    const { error: insertErr } = await supabase.from("conversation_messages").insert({
      session_id: sessionId,
      role: "user",
      text,
    });
    if (insertErr) throw insertErr;

    // Récupère la session pour connaître la langue
    const { data: sessionData, error: sessionErr } = await supabase
      .from("conversation_sessions")
      .select("language, persona")
      .eq("id", sessionId)
      .single();

    if (sessionErr) {
      console.warn("⚠️ Session introuvable, langue par défaut FR :", sessionErr);
    }

    const language = sessionData?.language || "fr";
    const persona = sessionData?.persona || "zena";

    // Appelle la fonction IA (Edge Function qvt-ai)
    const { data: aiData, error: fxError } = await supabase.functions.invoke("qvt-ai", {
      body: {
        tenant_id: TENANT_ID,
        text,
        persona,
        lang: language,
        provider: "openai",
        k: 5,
      },
    });

    if (fxError) throw fxError;

    const payload: AIResult = aiData || {};
    const responseText = payload.reply || payload.response_text || "Je t’écoute.";

    // Détection émotionnelle à partir du payload
    const emotion = payload.emotional
      ? payload.emotional
      : payload.mood
      ? { emotion_dominante: payload.mood }
      : null;

    // Enregistre la réponse IA et l’émotion dans la base
    const { error: insertAIError } = await supabase.from("conversation_messages").insert({
      session_id: sessionId,
      role: "zena",
      text: responseText,
      emotion,
    });

    if (insertAIError) throw insertAIError;

    console.log("💬 Réponse IA Zéna :", responseText);
    if (emotion) console.log("💫 Émotion détectée :", emotion);

    return payload;
  } catch (err) {
    console.error("❌ Erreur sendMessage :", err);
    throw err;
  }
}

/**
 * 🔄 Récupère les messages récents d'une session
 */
export async function getSessionMessages(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from("conversation_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("⚠️ Erreur getSessionMessages :", err);
    return [];
  }
}
