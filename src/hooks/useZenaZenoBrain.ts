// src/hooks/useZenaZenoBrain.ts
import { useState, useRef, useEffect } from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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

interface SupportResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  url?: string;
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>({
    mood: "neutral",
    score: 8,
  });
  const [recommendedBox, setRecommendedBox] = useState<RecommendedBox | null>(null);
  const [supportResources, setSupportResources] = useState<SupportResource[]>([]);
  const currentSessionId = useRef<string | null>(null);

  // Créer une session au premier rendu
  useEffect(() => {
    const createSession = async () => {
      const { data, error } = await supabase
        .from('conversation_sessions')
        .insert({
          user_id: user?.id || null,
          persona,
          language: language === "auto" ? "fr-FR" : language,
        })
        .select('id')
        .single();

      if (!error && data) {
        currentSessionId.current = data.id;
        console.log('[useZenaZenoBrain] Session créée:', data.id);
      }
    };

    createSession();
  }, [user, persona, language]);

  // Orchestration TTS+STT (anti-écho intégré)
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
  sttLang: language,
  continuous: true,
  interimResults: true,
  onFinalResult: (finalText) => {
    // 💡 Dès qu’on a un résultat FINAL du micro, on déclenche le cerveau
    onUserSpeak(finalText);
  },
});

  // 🧠 Génération de réponse IA via edge function
  const generateAIResponse = async (userText: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-emotional-weather', {
        body: {
          text: userText,
          persona,
          language: detectedLang === "fr" ? "fr" : "en",
          userId: user?.id,
          sessionId: currentSessionId.current
        }
      });

      if (error) {
        console.error('[useZenaZenoBrain] Erreur edge function:', error);
        throw error;
      }

      // Mise à jour de l'état émotionnel
      setEmotionalState({ mood: data.mood, score: data.score });
      
      // Mise à jour de la box recommandée
      setRecommendedBox(data.recommendedBox);
      
      // Mise à jour des ressources d'aide si disponibles
      if (data.supportResources && data.supportResources.length > 0) {
        setSupportResources(data.supportResources);
        console.log('[useZenaZenoBrain] 🆘 Ressources d\'aide reçues:', data.supportResources.length);
      }

      return data.reply;
    } catch (err) {
      console.error('[useZenaZenoBrain] Erreur génération:', err);
      return persona === "zena" 
        ? "Désolée, je n'ai pas pu analyser ton message pour le moment. 💔"
        : "Je rencontre une difficulté technique. Peux-tu réessayer ?";
    }
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
    supportResources,

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
