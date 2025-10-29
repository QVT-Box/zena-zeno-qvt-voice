import { useEffect, useMemo, useRef, useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { startSession, sendMessage, getSessionMessages } from "@/lib/zenaApi";
import { useZenaMemory } from "@/hooks/useZenaMemory";
import { useZenaTrainer } from "@/hooks/useZenaTrainer";

/**
 * 💬 ZÉNA Chat – IA émotionnelle entreprise
 * --------------------------------------------------
 * - Avatar vivant (voix + halo)
 * - Écoute et répond avec bienveillance
 * - Mode Coach pour salariés & RH
 * - Mémoire émotionnelle sur 7 messages
 * - Entraînement automatique (stocke émotions & dialogues)
 */
export default function ZenaChat() {
  //  Reconnaissance vocale
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  //  Mémoire émotionnelle
  const { history, addEmotion, getTrend } = useZenaMemory(7);

  //  Apprentissage automatique
  const { addSample, syncToCloud } = useZenaTrainer();

  //  États principaux
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const [modeCoach, setModeCoach] = useState(false);
  const [intent, setIntent] = useState<"listen" | "guide" | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "zena"; text: string }[]>([]);
  const speakingGuard = useRef(false);

  //  Initialisation session
  useEffect(() => {
    (async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
        const past = await getSessionMessages(id);
        if (past?.length) {
          setMessages(past.map((m: any) => ({ role: m.role, text: m.text })));
        }
      } catch (err) {
        console.error("Erreur init session Zéna :", err);
      }
    })();

    // Sauvegarde apprentissage à la fermeture
    return () => {
      if (sessionId) syncToCloud(sessionId);
    };
  }, []);

  //  Lecture de tendance émotionnelle
  const trendLabel = useMemo(() => {
    const t = getTrend();
    return t === "improving" ? " Climat en amélioration" : t === "declining" ? " Climat en baisse" : " Climat stable";
  }, [history]);

  //  Contrôle du micro / voix
  const handleMainToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      speakingGuard.current = false;
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  //  Texte effectif envoyé à ZÉNA
  const getUserText = () => {
    const base = manualText.trim() || transcript.trim();
    if (!base) return "";
    const intentTag = intent === "guide" ? "[INTENT:GUIDE]" : intent === "listen" ? "[INTENT:LISTEN]" : "";
    const coachTag = modeCoach ? "[MODE:COACH]" : "[MODE:DEFAULT]";
    return `${intentTag}${coachTag} ${base}`;
  };

  //  Interaction principale
  const handleSend = async () => {
    if (!sessionId) return;
    const text = getUserText();
    if (!text) return;

    setIsLoading(true);
    setReply(" ZÉNA réfléchit...");
    setMessages((p) => [...p, { role: "user", text }]);

    try {
      const ai = await sendMessage(sessionId, text);
      const emotion = ai.emotion === "positive" ? "positive" : ai.emotion === "negative" ? "negative" : "neutral";
      addEmotion(emotion as "positive" | "neutral" | "negative");
      addSample(text, ai.text, emotion);

      setReply(ai.text);
      setMessages((p) => [...p, { role: "zena", text: ai.text }]);

      await new Promise((r) => setTimeout(r, 600));

      if (!speakingGuard.current) {
        speakingGuard.current = true;
        setIsSpeaking(true);
        await speakWithZena(ai.text);
      }
    } catch (err) {
      console.error("Erreur interaction Zéna :", err);
      setReply("Je crois que j’ai besoin d’une petite pause… ");
    } finally {
      setIsSpeaking(false);
      speakingGuard.current = false;
      setIsLoading(false);
      setManualText("");
    }
  };

  const setQuickIntent = (i: "listen" | "guide") => setIntent(i);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 pb-24 px-4 text-center bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] overflow-hidden">
      {/* 🪷 Avatar vivant */}
      <ZenaAvatar textToSpeak={isSpeaking ? reply : ""} />

      {/*  Bouton principal */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleMainToggle}
          disabled={isLoading}
          className={`px-7 py-3 rounded-full text-white font-semibold shadow-lg transition ${
            isSpeaking
              ? "bg-rose-500 hover:bg-rose-600"
              : isListening
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSpeaking ? " Stopper ZÉNA" : isListening ? " Écoute en cours..." : " Parler à ZÉNA"}
        </button>

        {/* Intentions rapides */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setQuickIntent("listen")}
            className={`px-4 py-2 rounded-full text-sm shadow ${
              intent === "listen" ? "bg-[#4FD1C5] text-white" : "bg-white text-[#212121]"
            }`}
          >
             Juste t’écouter
          </button>
          <button
            onClick={() => setQuickIntent("guide")}
            className={`px-4 py-2 rounded-full text-sm shadow ${
              intent === "guide" ? "bg-[#4FD1C5] text-white" : "bg-white text-[#212121]"
            }`}
          >
             Aide-moi à avancer
          </button>

          {/* Mode coach */}
          <label className="ml-3 inline-flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={modeCoach} onChange={(e) => setModeCoach(e.target.checked)} />
            <span className="px-3 py-1 rounded-full bg-white shadow"> Mode Coach</span>
          </label>
        </div>
      </div>

      {/*  Saisie manuelle */}
      <div className="mt-6 w-full max-w-xl">
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Tu peux aussi écrire ici si tu préfères…"
          className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-lg shadow-inner outline-none border border-white/20"
        />
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={handleSend}
            disabled={isLoading || (!manualText.trim() && !transcript.trim())}
            className="px-6 py-2 rounded-full bg-[#4FD1C5] text-white shadow hover:bg-teal-500 transition disabled:opacity-50"
          >
            {isLoading ? " ZÉNA réfléchit..." : "Envoyer à ZÉNA "}
          </button>
          {transcript && <span className="text-xs text-gray-600 italic"> Reconnu : « {transcript} »</span>}
        </div>
      </div>

      {/*  Réponse et indicateur émotionnel */}
      {reply && !isSpeaking && (
        <div className="mt-6 w-full max-w-xl">
          <p className="text-base leading-relaxed text-[#212121]/85 bg-white/65 backdrop-blur-sm rounded-2xl p-4 shadow-inner whitespace-pre-line">
            {reply}
          </p>
          <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
        </div>
      )}

      {/*  Historique simple */}
      {messages.length > 0 && (
        <div className="mt-8 w-full max-w-xl text-left space-y-2">
          {messages.slice(-6).map((m, i) => (
            <div
              key={i}
              className={`inline-block px-3 py-2 rounded-xl text-sm ${
                m.role === "user" ? "bg-white" : "bg-[#EAF6F4]"
              }`}
            >
              <span className="opacity-60 mr-2">{m.role === "user" ? "👤" : "🫧"}</span>
              {m.text}
            </div>
          ))}
        </div>
      )}

      {/*  Halos décoratifs */}
      <div className="pointer-events-none absolute top-[-12%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[420px] h-[420px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10" />
    </div>
  );
}
