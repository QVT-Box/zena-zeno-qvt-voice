import { useEffect, useState } from "react";
import { startSession, sendMessage } from "@/lib/zenaApi";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import ZenaAvatar from "@/components/ZenaAvatar";

/**
 * 💬 Page principale – Interaction vocale et émotionnelle avec ZÉNA
 * ---------------------------------------------------------------
 * - Création automatique d'une session IA
 * - Écoute vocale utilisateur
 * - Réponse émotionnelle et bienveillante de ZÉNA
 * - Parole naturelle et halo dynamique
 */
export default function ZenaChat() {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<"positive" | "neutral" | "negative">("neutral");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ Crée une session au montage
  useEffect(() => {
    const init = async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
      } catch (err) {
        console.error("Erreur init session Zéna :", err);
      }
    };
    init();
  }, []);

  // 🎛️ Contrôle du micro et de la parole
  const handleToggle = async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  // 💬 Envoi du message à ZÉNA et lecture de la réponse
  const handleSend = async () => {
    if (!sessionId || !transcript.trim()) return;
    setIsLoading(true);
    setReply("⏳ ZÉNA réfléchit...");

    try {
      const ai = await sendMessage(sessionId, transcript);
      setReply(ai.text);
      setEmotion(
        ai.emotion === "positive"
          ? "positive"
          : ai.emotion === "negative"
          ? "negative"
          : "neutral"
      );

      // 🎵 petite pause avant de parler pour le réalisme
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSpeaking(true);
      await speakWithZena(ai.text);
    } catch (err) {
      console.error("Erreur interaction Zéna :", err);
      setReply("Je crois que j’ai besoin d’une petite pause... 🌸");
    } finally {
      setIsSpeaking(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] px-4 text-center relative overflow-hidden">
      {/* 🪷 Avatar et halo dynamique */}
      <ZenaAvatar textToSpeak={isSpeaking ? reply : ""} />

      {/* Interface principale */}
      <div className="mt-10 space-y-4">
        {/* Bouton central – écoute / arrêt / stop voix */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`px-8 py-4 rounded-full text-white text-lg font-semibold shadow-lg transition ${
            isSpeaking
              ? "bg-rose-500 hover:bg-rose-600"
              : isListening
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSpeaking
            ? "✋ Stopper ZÉNA"
            : isListening
            ? "🎧 Écoute en cours..."
            : "🎙️ Parler à ZÉNA"}
        </button>

        {/* Si un texte a été reconnu par le micro */}
        {transcript && !isSpeaking && (
          <>
            <p className="text-sm text-gray-700 italic mt-4">
              🗣️ Tu as dit : « {transcript} »
            </p>
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-6 py-2 mt-3 bg-[#4FD1C5] text-white rounded-full shadow hover:bg-teal-500 transition"
            >
              {isLoading ? "💭 ZÉNA réfléchit..." : "Envoyer à ZÉNA 💬"}
            </button>
          </>
        )}

        {/* Affichage de la réponse de Zéna */}
        {reply && !isSpeaking && (
          <p
            className="mt-6 text-base max-w-md mx-auto leading-relaxed text-[#212121]/80 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-inner"
            style={{ whiteSpace: "pre-line" }}
          >
            {reply}
          </p>
        )}
      </div>

      {/* 🫧 Décor lumineux doux */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] animate-pulse -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] animate-pulse-slow -z-10"
        aria-hidden="true"
      />
    </div>
  );
}
