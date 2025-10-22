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

  // --- Crée (ou restaure) une session dès le chargement ---
  useEffect(() => {
    const initSession = async () => {
      try {
        let current = localStorage.getItem("zena_session_id");
        if (!current) {
          const id = await startSession("voice"); // ✅ contexte uniquement (signature zenaApi.ts)
          localStorage.setItem("zena_session_id", id);
          current = id;
        }
        setSessionId(current);
      } catch (err) {
        console.error("❌ Erreur création session :", err);
      }
    };
    initSession();
  }, []);

  // --- Scroll automatique ---
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Envoi auto quand la reco a un transcript ---
  useEffect(() => {
    if (transcript && sessionId) {
      onSend(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // --- Envoi du message à Zéna ---
  async function onSend(text: string) {
    if (!text.trim() || !sessionId) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);

    try {
      const ai = await sendMessage(sessionId, text);
      const responseText = ai.reply || ai.response_text || "Je t’écoute...";
      setMessages((prev) => [...prev, { from: "zena", text: responseText }]);
      speak({ text: responseText, lang: "fr-FR", gender: "female" });
    } catch (e) {
      console.error("Erreur envoi message :", e);
      setMessages((prev) => [
        ...prev,
        { from: "zena", text: "Je n’ai pas bien compris, veux-tu reformuler ?" },
      ]);
    } finally {
      setManualText("");
      setLoading(false);
    }
  }

  // --- Activation / arrêt micro ---
  function handleMicClick() {
    try {
      setIsListening((prev) => !prev);
    } catch (err) {
      console.warn("Micro non disponible :", err);
    }
  }

  // --- Raccourcis émotions rapides ---
  const quickPrompts = [
    "Je me sens stressé",
    "Je me sens isolé",
    "Charge de travail trop lourde",
    "J’ai besoin de reconnaissance",
    "Conflit avec un collègue",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#F2F7F6] to-[#E8F0EE] relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,160,133,0.15),transparent_80%)]"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-6 z-10 border border-[#A4D4AE]/30">
        {/* Header Zéna */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/images/zena-preview.png"
            alt="Zéna"
            className="w-16 h-16 rounded-full border-4 border-[#78A085] shadow-md"
          />
          <div>
            <h1 className="text-lg font-semibold text-[#005B5F]">Zéna — alliée émotionnelle</h1>
            <p className="text-sm text-gray-500 italic">"Je t’écoute et j’agis, en douceur."</p>
            <span className="text-xs text-[#78A085]">● Prête</span>
          </div>
        </div>

        {/* Raccourcis émotionnels */}
        <p className="text-sm text-gray-500 mb-2">
          Dites <span className="font-medium text-[#005B5F]">“Bonjour Zéna”</span> ou utilisez les raccourcis ci-dessous.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSend(prompt)}
              className="px-3 py-1 text-sm border border-[#78A085] text-[#005B5F] rounded-full hover:bg-[#A4D4AE]/10 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Zone de messages */}
        <div ref={scrollRef} className="flex flex-col space-y-3 overflow-y-auto max-h-[40vh]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "zena" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  m.from === "zena"
                    ? "bg-[#E8F0EE] text-[#005B5F]"
                    : "bg-[#78A085] text-white"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Entrée manuelle + micro */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleMicClick}
            disabled={loading}
            className={`p-3 rounded-full ${
              isListening
                ? "bg-rose-500 animate-pulse text-white"
                : "bg-[#78A085] text-white hover:bg-[#5e8268]"
            } transition`}
          >
            🎙️
          </button>

          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend(manualText)}
            placeholder="Écrire à Zéna..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:ring focus:ring-[#A4D4AE]/40 outline-none"
          />
          <button
            onClick={() => onSend(manualText)}
            disabled={!manualText.trim() || loading}
            className={`px-4 py-2 rounded-xl text-white font-medium ${
              !manualText.trim() || loading
                ? "bg-gray-400"
                : "bg-[#005B5F] hover:bg-[#004347]"
            }`}
          >
            Envoyer
          </button>
        </div>

        {!supported && (
          <p className="mt-3 text-sm text-amber-700 text-center">
            ⚠️ Ce navigateur ne supporte pas la reconnaissance vocale.
          </p>
        )}
      </div>
    </div>
  );
}
