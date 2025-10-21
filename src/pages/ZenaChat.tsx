// src/pages/ZenaChat.tsx
import { useEffect, useRef, useState } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { startSession, sendMessage } from "@/lib/zenaApi";

type Msg = { from: "user" | "zena"; text: string };

export default function ZenaChat() {
  const { isListening, setIsListening, transcript, supported } = useVoiceRecognition();
  const { speak } = useSpeechSynthesis();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 🔹 Scrolling fluide
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔹 Démarre la session
  useEffect(() => {
    (async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
      } catch (e) {
        console.error("❌ Erreur création session Zéna :", e);
      }
    })();
  }, []);

  // 🔹 Quand la voix capte un texte
  useEffect(() => {
    if (!transcript || !sessionId) return;
    onSend(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // 🔹 Envoi message
  async function onSend(text: string) {
    if (!text.trim() || !sessionId) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);
    try {
      const ai = await sendMessage(sessionId, text);
      const responseText = ai.response_text || "Je vous écoute.";
      setMessages((prev) => [...prev, { from: "zena", text: responseText }]);
      speak({ text: responseText, lang: "fr-FR", gender: "female" });
    } catch (e) {
      console.error("❌ Erreur envoi message :", e);
      setMessages((prev) => [
        ...prev,
        { from: "zena", text: "Je n’ai pas compris, pouvez-vous répéter ?" },
      ]);
    } finally {
      setManualText("");
      setLoading(false);
    }
  }

  // 🔹 Démarrage micro direct dans le clic → indispensable mobile
  function handleMicClick() {
    try {
      setIsListening((prev) => !prev);
    } catch (err) {
      console.warn("Micro non disponible :", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#F2F7F6] to-[#E8F0EE] relative">
      {/* Fond halo Zéna */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(120,160,133,0.15),transparent_70%)]"></div>

      {/* Carte principale */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-lg p-5 z-10 border border-[#A4D4AE]/30">
        {/* Visage de Zéna */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/zena-preview.png"
            alt="Zéna"
            className="w-24 h-24 rounded-full border-4 border-[#A4D4AE] shadow-md"
          />
          <h1 className="text-xl font-semibold text-[#005B5F] mt-2">Zéna</h1>
          <p className="text-sm text-gray-500">Votre bulle d’écoute émotionnelle</p>
        </div>

        {/* Zone de messages fluide */}
        <div
          ref={scrollRef}
          className="flex flex-col space-y-3 overflow-y-auto max-h-[50vh] transition-all duration-300"
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-400 italic">
              Dites “Bonjour Zéna” ou écrivez un message ci-dessous.
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "zena" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  m.from === "zena"
                    ? "bg-[#E8F0EE] text-[#005B5F]"
                    : "bg-[#A4D4AE] text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton micro */}
        {supported && (
          <button
            onClick={handleMicClick}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl text-white font-medium transition ${
              isListening
                ? "bg-rose-500 animate-pulse"
                : loading
                ? "bg-gray-400"
                : "bg-[#005B5F] hover:bg-[#004347]"
            }`}
          >
            {isListening
              ? "🎙️ Parlez, j’écoute..."
              : loading
              ? "⏳ Zéna réfléchit..."
              : "🎤 Activer le micro"}
          </button>
        )}

        {/* Entrée manuelle */}
        <div className="mt-3 flex gap-2">
          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend(manualText)}
            placeholder="Écrire à Zéna..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring focus:ring-[#A4D4AE]/40"
          />
          <button
            onClick={() => onSend(manualText)}
            disabled={!manualText.trim() || loading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              !manualText.trim() || loading
                ? "bg-gray-400"
                : "bg-[#78A085] hover:bg-[#5e8268]"
            }`}
          >
            Envoyer
          </button>
        </div>

        {!supported && (
          <p className="mt-2 text-sm text-amber-700 text-center">
            ⚠️ Ce navigateur ne supporte pas la reconnaissance vocale.
          </p>
        )}
      </div>
    </div>
  );
}
