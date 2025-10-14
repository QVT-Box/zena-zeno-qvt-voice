// src/hooks/useZenaZenoBrain.ts
import { useState } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";

type Persona = "zena" | "zeno";
type LangOpt = "auto" | "fr-FR" | "en-US";

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
  persona: Persona;
  language?: LangOpt;
}

/**
 * 🧠 useZenaZenoBrain
 * - Écoute (STT) via useZenaVoice
 * - Génère une réponse émotionnelle (locale)
 * - Parle (TTS) via useZenaVoice
 * - Expose émotions + box recommandée
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

  // Orchestration TTS+STT (anti-écho intégré)
  const {
    say,
    listen,            // démarre l'écoute micro (STT)
    stopListening,     // stop l'écoute
    isListening,       // état STT
    isSpeaking,        // état TTS
    transcript,        // texte entendu (intermédiaire puis vidé au final)
    detectedLang,      // "fr" | "en" | "unknown"
    audioLevel,        // 0..1 pour anim
  } = useZenaVoice({
    lang: language === "auto" ? "fr-FR" : (language as "fr-FR" | "en-US"),
    gender: persona === "zena" ? "female" : "male",
    sttLang: language,        // "auto" ou "fr-FR"/"en-US"
    continuous: true,
    interimResults: true,
  });

  // Réponse émotionnelle locale
  const generateAIResponse = async (userText: string): Promise<string> => {
    const lower = userText.toLowerCase();
    let response = "";
    let mood: EmotionalState["mood"] = "neutral";
    let score = 8;
    let box: RecommendedBox | null = null;

    if (/(stress|fatigue)/.test(lower)) {
      response =
        persona === "zena"
          ? "Je ressens un peu de tension. Prends un instant pour respirer profondément 💨"
          : "Je comprends, la fatigue pèse. Prends un peu de recul.";
      mood = "negative";
      score = 5;
      box = {
        name: "Box Relax & Respire",
        theme: "Détente & Sérénité",
        description: "Une box pensée pour apaiser le mental et retrouver ton calme.",
      };
    } else if (/(bien|motivé|motivation|heureux|content)/.test(lower)) {
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
    }

    await new Promise((r) => setTimeout(r, 800));
    setEmotionalState({ mood, score });
    setRecommendedBox(box);
    return response;
  };

  // Quand l’utilisateur parle (texte final)
  const onUserSpeak = async (raw: string) => {
    const text = (raw || "").trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setThinking(true);

    const aiResponse = await generateAIResponse(text);

    setThinking(false);
    setMessages((prev) => [...prev, { from: persona, text: aiResponse }]);
    say(aiResponse); // l’écoute reprendra automatiquement après le TTS
  };

  return {
    // conversation
    messages,
    thinking,

    // émotions & reco
    emotionalState,
    recommendedBox,

    // voix & écoute
    speaking: isSpeaking,
    isListening,
    listen,
    stopListening,
    transcript,
    detectedLang,
    audioLevel,

    // interaction
    onUserSpeak,
  };
}
