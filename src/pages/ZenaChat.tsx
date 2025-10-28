import { useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";

export default function ZenaChat() {
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  const [reply, setReply] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ⚙️ Simulation de réponse IA (tu mettras GPT/FastAPI plus tard)
  const generateReply = (text: string) => {
    if (!text.trim()) return "Je n’ai pas bien compris. Peux-tu reformuler ?";
    const baseReplies = [
      `Je comprends, tu dis que "${text}". Cela semble important pour toi.`,
      `Merci de me partager ça. Comment te sens-tu maintenant ?`,
      `D’accord, on peut en parler calmement si tu veux.`,
      `Tu sembles penser à "${text}", veux-tu que je t’aide à y voir plus clair ?`,
      `Respire profondément. Je suis là, tu peux me parler librement.`,
    ];
    const random = Math.floor(Math.random() * baseReplies.length);
    return baseReplies[random];
  };

  const handleToggle = async () => {
    // 🔴 Si Zéna parle → on la fait taire
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    // 🔴 Si elle écoute → on stoppe l'écoute
    if (isListening) {
      stopListening();
      return;
    }

    // 🟢 Sinon → on démarre l’écoute
    startListening();
  };

  // 🧠 Dès qu’une phrase est reconnue → Zéna répond
  const handleSend = async () => {
    if (!transcript) return;
    const answer = generateReply(transcript);
    setReply(answer);
    setIsSpeaking(true);

    await speakWithZena(answer);
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] px-4 text-center">
      {/* 💫 Avatar animé */}
      <ZenaAvatar textToSpeak={isSpeaking ? reply : ""} />

      {/* 🎤 Bouton central unique */}
      <div className="mt-8 space-y-4">
        <button
          onClick={handleToggle}
          className={`px-8 py-4 rounded-full text-white text-lg font-semibold shadow-lg transition ${
            isSpeaking
              ? "bg-rose-500 hover:bg-rose-600"
              : isListening
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
          }`}
        >
          {isSpeaking
            ? "✋ Stopper ZÉNA"
            : isListening
            ? "🎧 Écoute en cours..."
            : "🎙️ Parler à ZÉNA"}
        </button>

        {/* 🧩 Si une phrase a été dite */}
        {transcript && !isSpeaking && (
          <>
            <p className="text-sm text-gray-700 italic">🗣️ Tu as dit : « {transcript} »</p>
            <button
              onClick={handleSend}
              className="px-6 py-2 mt-2 bg-[#4FD1C5] text-white rounded-full shadow hover:bg-teal-500 transition"
            >
              Envoyer à ZÉNA 💬
            </button>
          </>
        )}
      </div>
    </div>
  );
}
