// src/lib/zenaApi.ts
import { supabase } from "./supabase";

export async function startSession(context?: string) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) {
    // crée une session anonyme si tu utilises l’auth anonyme, sinon oblige login
    // await supabase.auth.signInAnonymously(); // si activé
    // re-check
  }
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Utilisateur non authentifié");

  const { data, error } = await supabase
    .from("conversation_sessions")
    .insert({ user_id: user.id, context: context ?? "voice" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function sendMessage(sessionId: string, text: string) {
  // 1) message user -> DB
  const { error: e1 } = await supabase
    .from("conversation_messages")
    .insert({ session_id: sessionId, sender: "user", content: text });
  if (e1) throw e1;

  // 2) appel à la Function qvt-ai
  const token = (await supabase.auth.getSession()).data.session?.access_token;
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qvt-ai`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ sessionId, text }),
    }
  );

  if (!res.ok) throw new Error(`qvt-ai error: ${res.status}`);
  const payload = (await res.json()) as {
    response_text: string;
    dominant_emotion?: string;
    emotion_score?: number;
    recommendations?: string[];
  };

  // 3) réponse zéna -> DB
  const { error: e2 } = await supabase.from("conversation_messages").insert({
    session_id: sessionId,
    sender: "zena",
    content: payload.response_text,
    emotion: payload.dominant_emotion ?? null,
    score: payload.emotion_score ?? null,
  });
  if (e2) throw e2;

  return payload;
}

