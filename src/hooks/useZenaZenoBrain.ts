import { useState, useCallback, useEffect } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

interface ZenaZenoBrainOptions {
  persona: "zena" | "zeno";
  userId?: string;
  language?: "fr-FR" | "en-US" | "auto";
}

interface EmotionalState {
  mood: "positive" | "neutral" | "negative";
  score: number; // 1–15
  lastUpdated: string;
}

interface RecommendedBox {
  name: string;
  theme: string;
  description: string;
}

export function useZenaZenoBrain({
  persona = "zena",
  userId,
  language = "auto",
}: ZenaZenoBrainOptions) {
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<
    { from: "user" | "ia"; text: string; lang: string }[]
  >([]);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    mood: "neutral",
    score: 10,
    lastUpdated: new Date().toISOString(),
  });
  const [recommendedBox, setRecommendedBox] = useState<RecommendedBox | null>(null);

  const { transcript, detectedLang, startListening, stopListening, isListening } =
    useVoiceInput({ lang: language });
  const { speak, speaking } = useSpeechSynthesis();

  // Analyse IA via edge function
  const analyzeMessage = useCallback(
    async (text: string, lang: string = "fr") => {
      setThinking(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/qvt-ai`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ text, persona, lang }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.reply || "Je vous écoute avec attention.";
        } else {
          if (lang === "en") {
            return persona === "zena"
              ? "I'm here for you. Tell me more."
              : "I understand. Let's think about it together.";
          } else {
            return persona === "zena"
              ? "Je suis là pour vous. Parlez-moi un peu plus."
              : "Je comprends. Réfléchissons ensemble.";
          }
        }
      } catch (error) {
        console.error("Error calling qvt-ai:", error);
        return lang === "en"
          ? "Sorry, I didn't catch that well."
          : "Désolée, je n'ai pas bien compris.";
      } finally {
        setThinking(false);
      }
    },
    [persona]
  );

  // Analyse émotionnelle simple
  const updateEmotion = useCallback((text: string) => {
    const lower = text.toLowerCase();
    const positive = ["merci", "bien", "heureux", "motivé", "cool"];
    const negative = ["fatigué", "stressé", "triste", "mal", "angoissé"];

    let newMood: "positive" | "neutral" | "negative" = "neutral";
    let delta = 0;

    if (positive.some((w) => lower.includes(w))) {
      newMood = "positive";
      delta = +1;
    } else if (negative.some((w) => lower.includes(w))) {
      newMood = "negative";
      delta = -1;
    }

    setEmotionalState((prev) => {
      const newScore = Math.min(15, Math.max(1, prev.score + delta));
      return { mood: newMood, score: newScore, lastUpdated: new Date().toISOString() };
    });
  }, []);

  // Proposition hebdomadaire de box
  useEffect(() => {
    const now = new Date();
    const last = new Date(emotionalState.lastUpdated);
    const daysSince = (now.getTime() - last.getTime()) / (1000 * 3600 * 24);

    if (daysSince >= 7) {
      let box: RecommendedBox;

      if (emotionalState.score <= 6)
        box = {
          name: "Box Sérénité",
          theme: "Anti-stress & relaxation",
          description:
            "Des produits apaisants pour t'aider à relâcher la pression cette semaine.",
        };
      else if (emotionalState.score <= 11)
        box = {
          name: "Box Équilibre",
          theme: "Régénération & motivation",
          description:
            "Des essentiels pour garder le cap et prendre soin de toi au quotidien.",
        };
      else
        box = {
          name: "Box Inspiration",
          theme: "Créativité & optimisme",
          description:
            "Une sélection pleine d'énergie positive pour entretenir ton bien-être.",
        };

      setRecommendedBox(box);
      setEmotionalState((prev) => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [emotionalState]);

  // Réception message utilisateur
  const onUserSpeak = useCallback(
    async (text: string, lang?: string) => {
      const languageCode = lang === "en" ? "en" : "fr";
      setMessages((prev) => [...prev, { from: "user", text, lang: languageCode }]);
      updateEmotion(text);
      const reply = await analyzeMessage(text, languageCode);
      setMessages((prev) => [...prev, { from: "ia", text: reply, lang: languageCode }]);

      speak({
        text: reply,
        lang: languageCode === "en" ? "en-US" : "fr-FR",
        gender: persona === "zena" ? "female" : "male",
        pitch: persona === "zena" ? 1.1 : 0.9,
        rate: persona === "zena" ? 1.05 : 0.95,
      });
    },
    [analyzeMessage, updateEmotion, persona, speak]
  );

  return {
    isListening,
    startListening,
    stopListening,
    speaking,
    thinking,
    messages,
    emotionalState,
    recommendedBox,
    onUserSpeak,
    transcript,
  };
}
