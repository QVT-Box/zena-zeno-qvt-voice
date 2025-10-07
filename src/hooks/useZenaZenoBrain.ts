import { useState, useEffect, useRef } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";

interface Message {
  from: "user" | "zena";
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
 * - Génère une réponse émotionnelle (locale)
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
   * ✍️ Simulation d'une réponse émotionnelle IA
   */
  const generateAIResponse = async (userText: string): Promise<string> => {
    const lower = userText.toLowerCase();
    let response = "";
    let mood: EmotionalState["mood"] = "neutral";
    let score = 8;
    let box: RecommendedBox | null = null;

    if (lower.includes("stress") || lower.includes("fatigue")) {
      response =
        persona === "zena"
          ? "Je ressens un peu de tension dans ta voix. Prends un instant pour respirer profondément 💨"
          : "Je comprends, la fatigue peut peser lourd. Un peu de recul t’aiderait.";
      mood = "negative";
      score = 5;
      box = {
        name: "Box Relax & Respire",
        theme: "Détente & Sérénité",
        description: "Une box pensée pour apaiser le mental et retrouver ton calme.",
      };
    } else if (lower.includes("bien") || lower.includes("motivé")) {
      response =
        persona === "zena"
          ? "Ça me fait plaisir de te sentir dans une bonne énergie 🌞"
          : "Excellente vibe aujourd’hui, continue sur cette lancée !";
      mood = "positive";
      score = 12;
      box = {
        name: "Box Vitalité & Motivation",
        theme: "Énergie & Confiance",
        description: "Des produits pour entretenir ta belle énergie !",
      };
    } else {
      response =
        persona === "zena"
          ? "Merci pour ton partage. Dis-m’en un peu plus sur ce que tu ressens ? 💬"
          : "Je t’écoute, veux-tu approfondir un peu ce que tu ressens ?";
      mood = "neutral";
      score = 8;
      box = null;
    }

    await new Promise((r) => setTimeout(r, 1500)); // simulation de réflexion

    setEmotionalState({ mood, score });
    setRecommendedBox(box);
    return response;
  };

  /**
   * 🎧 Quand l’utilisateur parle
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
   * 🎤 État d’écoute (lié à VoiceControl)
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
