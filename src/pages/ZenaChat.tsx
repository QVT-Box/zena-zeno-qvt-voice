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

  // Démarre une session à l'arrivée
  useEffect(() => {
    (async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
      } catch (e) {
        console.error("startSession error:", e);
      }
    })();
  }, []);

  // Quand on a un transcript depuis la voix -> envoie immédiatement
  useEffect(() => {
    if (!transcript || !sessionId) return;
    onSend(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  async function onSend(text: string) {
    if (!text.trim() || !sessionId) return;
    setMessages((m) => [...m, { from: "user", text }]);
    try {
      const ai = await sendMessage(sessionId, text);
      setMessages((m) => [...m, { from: "zena", text: ai.response_text }]);
      speak(ai.response_text);
    } catch (e) {
      console.error("sendMessage error:", e);
    } finally {
      setManualText("");
    }
  }

  const showManualInput = !supported; // si pas support vocal → montre le champ texte

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-2xl rounded-2xl shadow bg-white p-4">
        <h1 className="text-xl font-semibold mb-3">Zéna – IA émotionnelle</h1>

        <div className="h-[40vh] overflow-y-auto border rounded-lg p-3 mb-4 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`mb-2 ${m.from === "zena" ? "text-indigo-700" : "text-slate-800"}`}>
              <span className="font-medium">{m.from === "zena" ? "Zéna" : "Moi"} :</span> {m.text}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-slate-500">Parlez en cliquant sur le micro, ou écrivez votre message ci-dessous.</div>
          )}
        </div>

        {/* Bouton micro (si supporté) */}
        {supported && (
          <button
            onClick={() => setIsListening(!isListening)}
            className={`w-full py-3 rounded-xl text-white font-medium transition ${
              isListening ? "bg-rose-600" : "bg-emerald-600"
            }`}
          >
            {isListening ? "🎙️ Parlez, j’écoute…" : "🎙️ Activer le micro"}
          </button>
        )}

        {/* Entrée manuelle (toujours visible comme secours discret) */}
        <div className="mt-3 flex gap-2">
          <input
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend(manualText)}
            placeholder="Écrire à Zéna (secours si micro KO)…"
            className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring focus:ring-indigo-200"
          />
          <button
            onClick={() => onSend(manualText)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium"
          >
            Envoyer
          </button>
        </div>

        {!supported && (
          <p className="mt-2 text-sm text-amber-700">
            ⚠️ La reconnaissance vocale n’est pas supportée par ce navigateur. Utilisez le champ texte.
          </p>
        )}
      </div>
    </div>
  );
}
