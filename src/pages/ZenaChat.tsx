import { useEffect, useMemo, useRef, useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { startSession, sendMessage, getSessionMessages } from "@/lib/zenaApi";
import { useZenaMemory } from "@/hooks/useZenaMemory";
import { useZenaTrainer } from "@/hooks/useZenaTrainer";

export default function ZenaChat() {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { history, addEmotion, getTrend } = useZenaMemory(7);
  const { addSample, syncToCloud } = useZenaTrainer();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [emotion, setEmotion] = useState<"positive" | "neutral" | "negative">("neutral");
  const [mouthLevel, setMouthLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const speakingGuard = useRef(false);

  useEffect(() => {
    (async () => {
      const id = await startSession("voice");
      setSessionId(id);
      const past = await getSessionMessages(id);
      console.log("Session chargée", past);
    })();
    return () => {
      if (sessionId) syncToCloud(sessionId);
    };
  }, []);

  const trendLabel = useMemo(() => {
    const t = getTrend();
    return t === "improving" ? "💚 Amélioration" : t === "declining" ? "💔 Baisse" : " Stable";
  }, [history]);

  const handleMainToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    if (isListening) stopListening();
    else startListening();
  };

  const getUserText = () => manualText.trim() || transcript.trim();

  const handleSend = async () => {
    if (!sessionId) return;
    const text = getUserText();
    if (!text) return;

    setIsLoading(true);
    setReply(" ZÉNA réfléchit...");

    try {
      const ai = await sendMessage(sessionId, text);
      const detectedEmotion =
        ai.emotion === "positive" ? "positive" : ai.emotion === "negative" ? "negative" : "neutral";
      setEmotion(detectedEmotion);
      addEmotion(detectedEmotion);
      addSample(text, ai.text, detectedEmotion);

      setReply(ai.text);
      await new Promise((r) => setTimeout(r, 500));

      if (!speakingGuard.current) {
        speakingGuard.current = true;
        setIsSpeaking(true);
        await speakWithZena(ai.text, (event) => {
          if (event === "tick") setMouthLevel(Math.random());
          if (event === "end") {
            setMouthLevel(0);
            setIsSpeaking(false);
            speakingGuard.current = false;
          }
        });
      }
    } finally {
      setIsLoading(false);
      setManualText("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-20 px-4 bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-center">
      <ZenaAvatar textToSpeak={reply} mouthLevel={mouthLevel} emotion={emotion} />

      <button
        onClick={handleMainToggle}
        disabled={isLoading}
        className={`mt-8 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition ${
          isSpeaking
            ? "bg-rose-500 hover:bg-rose-600"
            : isListening
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
        }`}
      >
        {isSpeaking ? " Stopper ZÉNA" : isListening ? " Écoute en cours..." : " Parler à ZÉNA"}
      </button>

      <div className="mt-6 w-full max-w-lg">
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Écris si tu préfères..."
          className="w-full px-4 py-3 rounded-2xl bg-white/80 shadow-inner outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!manualText.trim() && !transcript.trim())}
          className="mt-3 px-6 py-2 rounded-full bg-[#4FD1C5] text-white shadow hover:bg-teal-500 transition"
        >
          {isLoading ? " Réflexion..." : "Envoyer "}
        </button>
        {reply && !isSpeaking && (
          <div className="mt-6 p-4 bg-white/70 rounded-xl shadow-inner">
            <p className="text-[#212121]/85 whitespace-pre-line">{reply}</p>
            <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
