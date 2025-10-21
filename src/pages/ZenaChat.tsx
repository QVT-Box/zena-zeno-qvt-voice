// src/pages/ZenaChat.tsx
import { useEffect, useState } from "react";
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

  // Démarrage automatique d'une session à l'arrivée
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

  // Quand la voix capte un texte
  useEffect(() => {
    if (!transcript || !sessionId) return;
    onSend(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  async function onSend(text: string) {
    if (!text.trim() || !sessionId) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);
    try {
      const ai = await sendMessage(sessionId, text);
      const responseText = ai.response_text || "Je vous écoute.";
      setMessages((prev) => [...prev, { from: "zena", text: responseText }]);

      // 🔊 Lecture vocale de la réponse
      speak({
        text: responseText,
        lang: "fr-FR",
        gender: "female",
        rate: 1,
        pitch: 1,
      });
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-emerald-800">
          🌿 Zéna – Votre IA émotionnelle
        </h1>

        <div className="h-[50vh] overflow-y-auto border rounded-xl p-4 mb-4 bg-slate-50">
          {messages.length === 0 && (
            <p className="text-slate-500 italic">
              Cliquez sur 🎙️ pour parler à Zéna, ou écrivez-lui.
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 ${
                m.from === "zena"
                  ? "text-indigo-700 text-left"
                  : "text-gray-800 text-right"
              }`}
            >
              <span className="font-medium">
                {m.from === "zena" ? "Zéna" : "Moi"} :
              </span>{" "}
              {m.text}
            </div>
          ))}
        </div>

        {/* Bouton micro */}
        {supported && (
          <button
            onClick={() => setIsListening(!isListening)}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium mb-3 transition ${
              isListening
                ? "bg-rose-600 animate-pulse"
                : loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isListening
              ? "🎙️ Parlez, j’écoute…"
              : loading
              ? "⏳ Zéna réfléchit…"
              : "🎤 Activer le micro"}
          </button>
        )}

        {/* Entrée manuelle */}
        <div className="flex gap-2">
          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend(manualText)}
            placeholder="Écrire à Zéna (si le micro ne marche pas)…"
            className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-emerald-200"
          />
          <button
            onClick={() => onSend(manualText)}
            disabled={!manualText.trim() || loading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              !manualText.trim() || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Envoyer
          </button>
        </div>

        {!supported && (
          <p className="mt-2 text-sm text-amber-700 text-center">
            ⚠️ Ce navigateur ne supporte pas la reconnaissance vocale.
            Utilisez le champ texte.
          </p>
        )}
      </div>
    </div>
  );
}
