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

interface UseZenaZenoBrainOptions {
  persona: "zena" | "zeno";
  language?: "auto" | "fr-FR" | "en-US";
}

/**
 * 🧠 useZenaZenoBrain
 * ------------------------------------------------------
 * Cerveau IA unifié :
 * - Écoute le texte utilisateur (via VoiceControl)
 * - Génère une réponse via l'IA (Lovable AI avec Gemini)
 * - Parle avec la voix correspondante (useZenaVoice)
 * - Gère les émotions + recommandations de box
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
  const [transcript, setTranscript] = useState("");
  const { say, isSpeaking, audioLevel } = useZenaVoice({
    lang: language === "auto" ? "fr-FR" : language,
    gender: persona === "zena" ? "female" : "male",
  });
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  const stopRef = useRef(false);

  /**
   * 🗄️ Créer une session de conversation
   */
  useEffect(() => {
    const createSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data, error } = await supabase
          .from('conversation_sessions')
          .insert({
            user_id: user?.id || null,
            persona,
            language: language === "auto" ? "fr-FR" : language,
          })
          .select()
          .single();

        if (error) {
          console.error("Erreur création session:", error);
          return;
        }

        setSessionId(data.id);
      } catch (err) {
        console.error("Erreur lors de la création de session:", err);
      }
    };

    createSession();
  }, [persona, language]);

  /**
   * 💾 Sauvegarder un message
   */
  const saveMessage = async (from: "user" | "zena" | "zeno", text: string) => {
    if (!sessionId) return;

    try {
      await supabase.from('conversation_messages').insert({
        session_id: sessionId,
        from_role: from,
        text,
      });

      // Incrémenter le compteur de messages
      await supabase
        .from('conversation_sessions')
        .update({ message_count: messages.length + 1 })
        .eq('id', sessionId);
    } catch (err) {
      console.error("Erreur sauvegarde message:", err);
    }
  };

  /**
   * 📊 Sauvegarder l'état émotionnel
   */
  const saveEmotionalState = async (state: EmotionalState, keywords: string[]) => {
    if (!sessionId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('emotional_snapshots').insert({
        session_id: sessionId,
        user_id: user?.id || null,
        mood: state.mood,
        score: state.score,
        keywords_detected: keywords,
      });
    } catch (err) {
      console.error("Erreur sauvegarde état émotionnel:", err);
    }
  };

  /**
   * 🎁 Sauvegarder la recommandation de box
   */
  const saveBoxRecommendation = async (box: RecommendedBox) => {
    if (!sessionId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('box_recommendations').insert({
        session_id: sessionId,
        user_id: user?.id || null,
        box_name: box.name,
        box_theme: box.theme,
        box_description: box.description,
      });
    } catch (err) {
      console.error("Erreur sauvegarde recommandation:", err);
    }
  };

  /**
   * ✍️ Génération de réponse via IA (Lovable AI)
   */
  const generateAIResponse = async (userText: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('qvt-ai', {
        body: { 
          text: userText,
          persona: persona,
          lang: language === "en-US" ? "en" : "fr"
        }
      });

      if (error) {
        console.error("Erreur IA:", error);
        return persona === "zena" 
          ? "Je suis désolée, j'ai du mal à me concentrer. Peux-tu répéter ?"
          : "Excuse-moi, peux-tu reformuler ta question ?";
      }

      // Analyse émotionnelle du texte utilisateur
      const lower = userText.toLowerCase();
      let mood: EmotionalState["mood"] = "neutral";
      let score = 8;
      let box: RecommendedBox | null = null;
      let keywords: string[] = [];

      if (lower.includes("stress") || lower.includes("fatigue") || lower.includes("difficile") || lower.includes("épuisé")) {
        mood = "negative";
        score = 5;
        keywords = ["stress", "fatigue", "difficile"];
        box = {
          name: "Box Relax & Respire",
          theme: "Détente & Sérénité",
          description: "Une box pensée pour apaiser le mental et retrouver ton calme.",
        };
      } else if (lower.includes("bien") || lower.includes("motivé") || lower.includes("heureux") || lower.includes("content")) {
        mood = "positive";
        score = 12;
        keywords = ["bien", "motivé", "heureux"];
        box = {
          name: "Box Vitalité & Motivation",
          theme: "Énergie & Confiance",
          description: "Des produits pour entretenir ta belle énergie !",
        };
      }

      setEmotionalState({ mood, score });
      setRecommendedBox(box);

      // Sauvegarder l'état émotionnel et la box
      await saveEmotionalState({ mood, score }, keywords);
      if (box) {
        await saveBoxRecommendation(box);
      }

      return data.reply || (persona === "zena" ? "Je suis là pour t'écouter." : "Continue, je t'écoute.");
    } catch (err) {
      console.error("Erreur lors de l'appel à l'IA:", err);
      return persona === "zena"
        ? "Pardonne-moi, j'ai besoin d'un instant pour me reconcentrer."
        : "Un instant s'il te plaît, je réfléchis.";
    }
  };

  /**
   * 🎧 Quand l'utilisateur parle
   */
  const onUserSpeak = async (text: string) => {
    if (!text || stopRef.current) return;
    setTranscript(text);
    setMessages((prev) => [...prev, { from: "user", text }]);
    await saveMessage("user", text);
    setThinking(true);

    const aiResponse = await generateAIResponse(text);
    setThinking(false);
    setMessages((prev) => [...prev, { from: persona, text: aiResponse }]);
    await saveMessage(persona, aiResponse);

    say(aiResponse);
  };

  /**
   * 🎤 État d'écoute (lié à VoiceControl)
   */
  const startListening = () => setIsListening(true);
  const stopListening = () => setIsListening(false);

  return {
    messages,
    emotionalState,
    recommendedBox,
    isListening,
    startListening,
    stopListening,
    onUserSpeak,
    speaking: isSpeaking,
    thinking,
    transcript,
    audioLevel,
  };
}
