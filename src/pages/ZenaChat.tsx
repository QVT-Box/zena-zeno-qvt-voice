import { useEffect, useMemo, useRef, useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { startSession, sendMessage } from "@/lib/zenaApi";
import { useZenaMemory } from "@/hooks/useZenaMemory";
import { generateZenaVideo } from "@/lib/zenaHeygen"; //  Heygen version

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
  const [liveMode, setLiveMode] = useState<boolean>(false); //  switch entre Zéna vivante et avatar animé

  const videoAbortRef = useRef<AbortController | null>(null);
  const speakingGuard = useRef(false);

  useEffect(() => {
    (async () => {
      const id = await startSession("voice");
      setSessionId(id);
    })();
  }, []);

  const trendLabel = useMemo(() => {
    const t = getTrend();
    return t === "improving" ? " Amélioration" : t === "declining" ? " Baisse" : " Stable";
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
    setReply(" ZÉNA réfléchit...");

    try {
      const ai = await sendMessage(sessionId, text);

      const detectedEmotion =
        ai.emotion === "positive" ? "positive" : ai.emotion === "negative" ? "negative" : "neutral";
      setEmotion(detectedEmotion);
      addEmotion(detectedEmotion);

      const message = ai.text || ai.reply || "Je t’écoute.";
      setReply(message);

      //  Si mode Zéna vivante activé, on génère la vidéo
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
        //  sinon juste la voix locale
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
      setReply("Je crois que j’ai besoin d’une petite pause… ");
      setIsVideoGenerating(false);
      if (videoAbortRef.current) {
        videoAbortRef.current = null;
      }
    } finally {
      setIsLoading(false);
      setManualText("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 pb-20 px-4 bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-center relative">
      {/*  Switch entre Avatar et Zéna vivante */}
      <button
        onClick={() => setLiveMode((v) => !v)}
        className="absolute top-4 right-4 px-4 py-2 rounded-full text-sm bg-white/70 shadow-md hover:bg-white transition"
      >
        {liveMode ? " Mode Avatar animé" : " Mode Zéna vivante"}
      </button>

      {/* Zone avatar / vidéo */}
      <div className="relative">
        {liveMode && videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            playsInline
            muted
            loop
            className="rounded-full w-64 h-64 object-cover shadow-lg"
          />
        ) : (
          <ZenaAvatar textToSpeak={reply} mouthLevel={mouthLevel} emotion={emotion} />
        )}

        {isVideoGenerating && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 py-2 rounded-full bg-white/80 shadow text-sm">
               Génération du visage en cours…
            </div>
          </div>
        )}
      </div>

      {/* Bouton principal */}
      <button
        onClick={handleMainToggle}
        disabled={isLoading}
        className={`mt-8 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition ${
          isSpeaking || isVideoGenerating
            ? "bg-rose-500 hover:bg-rose-600"
            : isListening
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
        } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isSpeaking || isVideoGenerating
          ? " Stopper ZÉNA"
          : isListening
          ? "Écoute en cours..."
          : " Parler à ZÉNA"}
      </button>

      {/* Entrée texte + envoyer */}
      <div className="mt-6 w-full max-w-lg">
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Écris ton message à ZÉNA…"
          className="w-full px-4 py-3 rounded-2xl bg-white/80 shadow-inner outline-none"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!manualText.trim() && !transcript.trim())}
          className="mt-3 px-6 py-2 rounded-full bg-[#4FD1C5] text-white shadow hover:bg-teal-500 transition disabled:opacity-50"
        >
          {isLoading ? "ZÉNA réfléchit..." : "Envoyer "}
        </button>

        {/* Réponse */}
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
