// src/hooks/useZenaBrain.ts
import { useState, useEffect, useRef } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message { from: "user" | "zena" | "zeno"; text: string; }
interface EmotionalState { mood: "positive" | "negative" | "neutral"; score: number; }
interface RecommendedBox { name: string; theme: string; description: string; }
interface UseZenaBrainOptions { persona: "zena" | "zeno"; language?: "auto" | "fr-FR" | "en-US"; }

export function useZenaBrain({ persona = "zena", language = "auto" }: UseZenaBrainOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({ mood: "neutral", score: 8 });
  const [recommendedBox, setRecommendedBox] = useState<RecommendedBox | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const stopRef = useRef(false);

  // Orchestration voix (STT + TTS + anti-écho)
  const {
    say, listen, stopListening,
    isListening, isSpeaking, transcript, detectedLang, audioLevel,
  } = useZenaVoice({
    lang: language === "auto" ? "fr-FR" : (language as "fr-FR" | "en-US"),
    gender: persona === "zena" ? "female" : "male",
    sttLang: language, continuous: true, interimResults: true,
  });

  // Session
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
          .select().single();
        if (error) {
          console.error("Erreur création session:", error);
          toast({ title: "Conversation indisponible", description: "Impossible de créer la session.", variant: "destructive" });
          return;
        }
        setSessionId(data.id);
      } catch (e) {
        console.error("Erreur session:", e);
        toast({ title: "Erreur réseau", description: "Création de session impossible.", variant: "destructive" });
      }
    })();
  }, [persona, language, toast]);

  const saveMessage = async (from: Message["from"], text: string) => {
    if (!sessionId) return;
    try {
      await supabase.from("conversation_messages").insert({ session_id: sessionId, from_role: from, text });
      await supabase.from("conversation_sessions").update({ message_count: messages.length + 1 }).eq("id", sessionId);
    } catch (e) { console.error("Erreur sauvegarde message:", e); }
  };

  const saveEmotionalState = async (state: EmotionalState, keywords: string[]) => {
    if (!sessionId) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      await supabase.from("emotional_snapshots").insert({
        session_id: sessionId, user_id: auth?.user?.id ?? null,
        mood: state.mood, score: state.score, keywords_detected: keywords,
      });
    } catch (e) { console.error("Erreur sauvegarde état émotionnel:", e); }
  };

  const saveBoxRecommendation = async (box: RecommendedBox) => {
    if (!sessionId) return;
    try {
      const { data: auth } = await supabase.auth.getUser();
      await supabase.from("box_recommendations").insert({
        session_id: sessionId, user_id: auth?.user?.id ?? null,
        box_name: box.name, box_theme: box.theme, box_description: box.description,
      });
    } catch (e) { console.error("Erreur sauvegarde recommandation:", e); }
  };

  const generateAIResponse = async (userText: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke("qvt-ai", {
        body: { text: userText, persona, lang: language === "en-US" ? "en" : "fr" },
      });
      if (error) {
        console.error("Erreur IA:", error);
        return persona === "zena" ? "Je suis désolée, peux-tu répéter ?" : "Peux-tu reformuler ?";
      }

      const lower = userText.toLowerCase();
      let mood: EmotionalState["mood"] = "neutral"; let score = 8;
      let box: RecommendedBox | null = null; let keywords: string[] = [];

      if (/(stress|fatigue|difficile|épuisé|epuise|epuisé)/.test(lower)) {
        mood = "negative"; score = 5; keywords = ["stress", "fatigue", "difficile"];
        box = { name: "Box Relax & Respire", theme: "Détente & Sérénité", description: "Une box pour apaiser le mental." };
      } else if (/(bien|motivé|heureux|content|confiant)/.test(lower)) {
        mood = "positive"; score = 12; keywords = ["bien", "motivé", "heureux"];
        box = { name: "Box Vitalité & Motivation", theme: "Énergie & Confiance", description: "Des produits pour garder l’élan." };
      }

      setEmotionalState({ mood, score }); setRecommendedBox(box);
      await saveEmotionalState({ mood, score }, keywords); if (box) await saveBoxRecommendation(box);

      return data?.reply || (persona === "zena" ? "Je suis là pour t'écouter." : "Je t’écoute.");
    } catch (e) {
      console.error("Erreur IA:", e);
      return persona === "zena" ? "Un instant, je me reconcentre." : "Un instant, je réfléchis.";
    }
  };

  // À appeler quand tu reçois un texte final (via STT ou input)
  const onUserSpeak = async (text: string) => {
    if (!text || stopRef.current) return;
    setMessages((p) => [...p, { from: "user", text }]); await saveMessage("user", text);
    setThinking(true); const ai = await generateAIResponse(text); setThinking(false);
    setMessages((p) => [...p, { from: persona, text: ai }]); await saveMessage(persona, ai);
    say(ai); // TTS -> l’écoute reprendra toute seule
  };

  return {
    messages, emotionalState, recommendedBox, thinking,
    isListening, isSpeaking, transcript, detectedLang, audioLevel,
    listen, stopListening, onUserSpeak,
  };
}
