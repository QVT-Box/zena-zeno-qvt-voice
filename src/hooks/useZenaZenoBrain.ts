import { useState, useEffect, useRef } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { supabase } from "@/integrations/supabase/client";

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

  const stopRef = useRef(false);

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

      if (lower.includes("stress") || lower.includes("fatigue") || lower.includes("difficile") || lower.includes("épuisé")) {
        mood = "negative";
        score = 5;
        box = {
          name: "Box Relax & Respire",
          theme: "Détente & Sérénité",
          description: "Une box pensée pour apaiser le mental et retrouver ton calme.",
        };
      } else if (lower.includes("bien") || lower.includes("motivé") || lower.includes("heureux") || lower.includes("content")) {
        mood = "positive";
        score = 12;
        box = {
          name: "Box Vitalité & Motivation",
          theme: "Énergie & Confiance",
          description: "Des produits pour entretenir ta belle énergie !",
        };
      }

      setEmotionalState({ mood, score });
      setRecommendedBox(box);

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
    setThinking(true);

    const aiResponse = await generateAIResponse(text);
    setThinking(false);
    setMessages((prev) => [...prev, { from: persona, text: aiResponse }]);

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
