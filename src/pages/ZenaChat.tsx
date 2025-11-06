import { useEffect, useMemo, useRef, useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import ZenaBackground from "@/components/ZenaBackground";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { startSession, sendMessage } from "@/lib/zenaApi";
import { useZenaMemory } from "@/hooks/useZenaMemory";
import { generateZenaVideo } from "@/lib/zenaHeygen";

export default function ZenaChat() {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();
  const { history, addEmotion, getTrend } = useZenaMemory(7);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [emotion, setEmotion] = useState<"positive" | "neutral" | "negative">("neutral");
  const [mouthLevel, setMouthLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualText, setManualText] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [liveMode, setLiveMode] = useState<boolean>(false);

  const videoAbortRef = useRef<AbortController | null>(null);
  const speakingGuard = useRef(false);

  // 🔹 Création d'une nouvelle session Zéna
  useEffect(() => {
    (async () => {
      const id = await startSession("voice");
      setSessionId(id);
    })();
  }, []);

  const trendLabel = useMemo(() => {
    const t = getTrend();
    return t === "improving" ? "📈 Amélioration" : t === "declining" ? "📉 Baisse" : "➡️ Stable";
  }, [history]);

  const handleMainToggle = () => {
    if (isSpeaking || isVideoGenerating) {
      stopSpeaking();
      speakingGuard.current = false;
      setIsSpeaking(false);
      if (videoAbortRef.current) {
        videoAbortRef.current.abort();
        videoAbortRef.current = null;
        setIsVideoGenerating(false);
      }
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

    setVideoUrl(null);
    if (videoAbortRef.current) {
      videoAbortRef.current.abort();
      videoAbortRef.current = null;
    }

    setIsLoading(true);
    setReply("💭 ZÉNA réfléchit...");

    try {
      const ai = await sendMessage(sessionId, text);
      const detectedEmotion =
        ai.emotion === "positive" ? "positive" : ai.emotion === "negative" ? "negative" : "neutral";
      setEmotion(detectedEmotion);
      addEmotion(detectedEmotion);

      const message = ai.text || "Je t'écoute.";
      setReply(message);

      if (liveMode) {
        setIsVideoGenerating(true);
        const ac = new AbortController();
        videoAbortRef.current = ac;
        const video = await generateZenaVideo(message, {
          signal: ac.signal,
          fallbackUrl: "/videos/zena_default.mp4",
        });
        setIsVideoGenerating(false);
        videoAbortRef.current = null;
        if (video) setVideoUrl(video);
      } else {
        if (!speakingGuard.current) {
          speakingGuard.current = true;
          setIsSpeaking(true);
          await speakWithZena(message, (event) => {
            if (event === "tick") setMouthLevel(Math.random());
            if (event === "end") {
              setMouthLevel(0);
              setIsSpeaking(false);
              speakingGuard.current = false;
            }
          });
        }
      }
    } catch (err) {
      console.error(err);
      setReply("Je crois que j'ai besoin d'une petite pause… 💜");
      setIsVideoGenerating(false);
      if (videoAbortRef.current) videoAbortRef.current = null;
    } finally {
      setIsLoading(false);
      setManualText("");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden">
      {/* 🌈 Fond animé global */}
      <ZenaBackground />

      {/* 🔘 Switch entre les modes */}
      <button
        onClick={() => setLiveMode((v) => !v)}
        className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm bg-white/70 shadow-md hover:bg-white transition"
      >
        {liveMode ? "🎭 Mode Avatar animé" : "🎬 Mode Zéna vivante"}
      </button>

      {/* 🩵 Colonne gauche : Avatar ou vidéo */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 mb-10 md:mb-0 z-10">
        <div className="relative">
          {liveMode && videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              playsInline
              muted
              loop
              className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg border-4 border-white/40"
            />
          ) : (
            <div className="relative">
              <img
                src="/images/zena-face.png"
                alt="ZÉNA"
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg border-4 border-white/40 opacity-95"
              />
              {/* 🪶 Halo + bouche animée */}
              <div className="absolute inset-0">
                <ZenaAvatar emotion={emotion} mouthLevel={mouthLevel} overlay />
              </div>
            </div>
          )}

          {isVideoGenerating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 rounded-full bg-white/80 shadow text-sm">
                ⏳ Génération du visage en cours…
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-[#212121]/70 font-medium">
          ZÉNA — la voix qui veille sur vos émotions
        </p>
      </div>

      {/* 💬 Colonne droite : interactions */}
      <div className="flex flex-col items-center md:items-start w-full md:w-1/2 max-w-md px-6 z-10">
        {/* 🎙️ Bouton principal */}
        <button
          onClick={handleMainToggle}
          disabled={isLoading}
          className={`mb-6 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition ${
            isSpeaking || isVideoGenerating
              ? "bg-rose-500 hover:bg-rose-600"
              : isListening
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSpeaking || isVideoGenerating
            ? "⏹️ Stopper ZÉNA"
            : isListening
            ? "🎤 Écoute en cours..."
            : "🎙️ Parler à ZÉNA"}
        </button>

        {/* 📝 Entrée texte */}
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Écris ton message à ZÉNA…"
          className="w-full px-4 py-3 rounded-2xl bg-white/80 shadow-inner outline-none border border-gray-200 focus:ring-2 focus:ring-[#4FD1C5]"
        />

        <button
          onClick={handleSend}
          disabled={isLoading || (!manualText.trim() && !transcript.trim())}
          className="mt-3 px-6 py-2 rounded-full bg-[#4FD1C5] text-white shadow hover:bg-teal-500 transition disabled:opacity-50"
        >
          {isLoading ? "ZÉNA réfléchit..." : "Envoyer 📤"}
        </button>

        {/* 💬 Réponse IA */}
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
