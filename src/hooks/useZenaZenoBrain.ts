// src/hooks/useZenaZenoBrain.ts
import { useState, useEffect, useRef } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  from: "user" | "zena" | "zeno";
  text: string;
}

interface EmotionalState {
  mood: "positive" | "negative" | "neutral";
  score: number;
}

interface RecommendedBox {
  name: string;
  theme: string;
  description: string;
}

export interface UseZenaZenoBrainOptions {
  persona: "zena" | "zeno";
  language?: "auto" | "fr-FR" | "en-US";
}

/**
 * 🧠 useZenaZenoBrain — Cerveau IA unifié (écoute → IA → parle)
 * - Orchestration STT/TTS via useZenaVoice (anti-écho)
 * - Sessions/messages/émotions/reco sauvegardés dans Supabase
 */
export function useZenaZenoBrain({
  persona = "zena",
  language = "auto",
}: UseZenaZenoBrainOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    mood: "neutral",
    score: 8,
  });
  const [recommendedBox, setRecommendedBox] = useState<RecommendedBox | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const stopRef = useRef(false);

  // Orchestration voix (STT + TTS + anti-écho)
  const {
    say,
    listen,
    stopListening,
    isListening,
    isSpeaking,
    transcript,
    detectedLang,
    audioLevel,
  } = useZenaVoice({
    lang: language === "auto" ? "fr-FR" : (language as "fr-FR" | "en-US"),
    gender: persona === "zena" ? "female" : "male",
    sttLang: language, // "auto" ok
    continuous: true,
    interimResults: true,
  });

  /** 🗄️ Créer une session de conversation */
  useEffect(() => {
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from("conversation_sessions")
          .insert({
            user_id: auth?.user?.id ?? null,
            persona,
            language: language === "auto" ? "fr-FR" : language,
          })
          .select()
          .single();

        if (error) {
          console.error("Erreur création session:", error);
          toast({
            title: "Conversation indisponible",
            description: "Impossible de créer la session.",
            variant: "destructive",
          });
          return;
        }
        setSessionId(data.id);
      } catch (e) {
        console.error("Erreur session:", e);
        toast({
          title: "Erreur réseau",
          description: "Création de session impossible.",
          variant: "destructive",
        });
      }
    })();
  }, [persona, language, toast]);

  /** 💾 Sauvegarder un message */
  const saveMessage = async (from: Message["from"], text: string) => {
    if (!sessionId) return;
    try {
      await supabase
        .from("conversation_messages")
        .insert({ session_id: sessionId, from_role: from, text });

      await supabase
        .from("conversation_sessions")
        .update({ message_count: messages.length + 1 })
        .eq("id", sessionId);
    } catch (e) {
      console.error("Erreur sauvegarde message:", e);
    }
  };

  /** 📊 Sauvegarder l'état émotionnel */
  const saveEmotionalState = async (state: EmotionalState, keywords: string[]) => {
    if (!sessionId) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      await supabase.from("emotional_snapshots").insert({
        session_id: sessionId,
        user_id: auth?.user?.id ?? null,
        mood: state.mood,
        score: state.score,
        keywords_detected: keywords,
      });
    } catch (e) {
      console.error("Erreur sauvegarde état émotionnel:", e);
    }
  };

  /** 🎁 Sauvegarder la recommandation de box */
  const saveBoxRecommendation = async (box: RecommendedBox) => {
    if (!sessionId) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      await supabase.from("box_recommendations").insert({
        session_id: sessionId,
        user_id: auth?.user?.id ?? null,
        box_name: box.name,
        box_theme: box.theme,
        box_description: box.description,
      });
    } catch (e) {
      console.error("Erreur sauvegarde recommandation:", e);
    }
  };

  /** ✍️ Générer la réponse IA (Edge Function) */
  const generateAIResponse = async (userText: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("qvt-ai", {
        body: {
          text: userText,
          persona,
          lang: language === "en-US" ? "en" : "fr",
        },
      });

      if (error) {
        console.error("Erreur IA:", error);
        return persona === "zena"
          ? "Je suis désolée, peux-tu répéter ?"
          : "Peux-tu reformuler ?";
      }

      // Mini analyse émotionnelle locale
      const lower = userText.toLowerCase();
      let mood: EmotionalState["mood"] = "neutral";
      let score = 8;
      let box: RecommendedBox | null = null;
      let keywords: string[] = [];

      if (/(stress|fatigue|difficile|épuisé|epuise|epuisé)/.test(lower)) {
        mood = "negative";
        score = 5;
        keywords = ["stress", "fatigue", "difficile"];
        box = {
          name: "Box Relax & Respire",
          theme: "Détente & Sérénité",
          description: "Une box pour apaiser le mental.",
        };
      } else if (/(bien|motivé|heureux|content|confiant)/.test(lower)) {
        mood = "positive";
        score = 12;
        keywords = ["bien", "motivé", "heureux"];
        box = {
          name: "Box Vitalité & Motivation",
          theme: "Énergie & Confiance",
          description: "Des produits pour garder l’élan.",
        };
      }

      setEmotionalState({ mood, score });
      setRecommendedBox(box);

      await saveEmotionalState({ mood, score }, keywords);
      if (box) await saveBoxRecommendation(box);

      return (
        data?.reply ||
        (persona === "zena" ? "Je suis là pour t'écouter." : "Je t’écoute.")
      );
    } catch (e) {
      console.error("Erreur IA:", e);
      return persona === "zena"
        ? "Un instant, je me reconcentre."
        : "Un instant, je réfléchis.";
    }
  };

  /** 🎧 À appeler quand tu reçois un texte final (via STT ou input) */
  const onUserSpeak = async (text: string) => {
    if (!text || stopRef.current) return;

    setMessages((p) => [...p, { from: "user", text }]);
    await saveMessage("user", text);

    setThinking(true);
    const ai = await generateAIResponse(text);
    setThinking(false);

    setMessages((p) => [...p, { from: persona, text: ai }]);
    await saveMessage(persona, ai);

    // TTS → l’écoute reprendra seule (gérée par useZenaVoice)
    say(ai);
  };

  return {
    // flux & état
    messages,
    emotionalState,
    recommendedBox,
    thinking,

    // voix (orchestrées)
    isListening,
    isSpeaking,
    transcript,
    detectedLang,
    audioLevel,

    // actions pour l’UI
    listen,          // démarre l'écoute
    stopListening,   // stoppe l'écoute
    onUserSpeak,     // envoie un texte utilisateur (final)
  };
}
