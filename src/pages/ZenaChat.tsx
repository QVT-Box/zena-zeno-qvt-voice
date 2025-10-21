// src/pages/ZenaChat.tsx
import { useEffect, useRef, useState } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { startSession, sendMessage } from "@/lib/zenaApi";

type Msg = { from: "user" | "zena"; text: string };
type AIReturn = {
  response_text: string;
  dominant_emotion?: string;
  emotion_score?: number;
  recommendations?: string[];
};

// Couleurs de marque (violet / turquoise)
const BRAND_VIOLET = "#6E44FF";
const BRAND_TURQUOISE = "#2DD4BF";

// ————————————————————————————————————————————————
// Petits sous-composants UI
// ————————————————————————————————————————————————
function EmotionHalo({ active }: { active: boolean }) {
  // Halo animé autour de l'avatar (respiration)
  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center">
      <div
        className={`rounded-full blur-2xl transition-all duration-500 ${
          active ? "opacity-80 scale-100" : "opacity-40 scale-95"
        }`}
        style={{
          width: 220,
          height: 220,
          background: `radial-gradient(circle at 50% 50%, ${BRAND_TURQUOISE}66, transparent 60%)`,
          filter: "drop-shadow(0 0 30px rgba(45,212,191,0.25))",
        }}
      />
      <div
        className={`absolute rounded-full blur-3xl mix-blend-screen transition-all duration-500 ${
          active ? "opacity-60" : "opacity-30"
        }`}
        style={{
          width: 240,
          height: 240,
          background: `radial-gradient(circle at 50% 50%, ${BRAND_VIOLET}55, transparent 60%)`,
        }}
      />
    </div>
  );
}

function MessageBubble({ m }: { m: Msg }) {
  const isZena = m.from === "zena";
  return (
    <div className={`flex ${isZena ? "justify-start" : "justify-end"}`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm shadow-sm ${
          isZena ? "text-slate-800" : "text-white"
        }`}
        style={
          isZena
            ? {
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))",
                border: "1px solid rgba(226,232,240,0.8)",
              }
            : {
                background: `linear-gradient(135deg, ${BRAND_VIOLET}, ${BRAND_TURQUOISE})`,
              }
        }
      >
        {m.text}
      </div>
    </div>
  );
}

function QuickActionChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-full border hover:shadow-sm transition"
      style={{ borderColor: BRAND_TURQUOISE, color: BRAND_VIOLET }}
    >
      {label}
    </button>
  );
}

// ————————————————————————————————————————————————
// Page principale Zéna
// ————————————————————————————————————————————————
export default function ZenaChat() {
  const { isListening, setIsListening, transcript, supported } = useVoiceRecognition();
  const { speak } = useSpeechSynthesis();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAI, setLastAI] = useState<AIReturn | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, lastAI]);

  // Démarre une session à l'arrivée
  useEffect(() => {
    (async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
      } catch (e) {
        console.error("❌ Création session :", e);
      }
    })();
  }, []);

  // Quand la voix transcrit → envoie
  useEffect(() => {
    if (!transcript || !sessionId) return;
    onSend(transcript);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // Permission micro AVANT la reco (mobile/desktop)
  async function handleMicClick() {
    setMicError(null);
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      setIsListening((prev) => !prev);
    } catch (err: any) {
      setMicError("Autorise le micro (icône 🔒 près de l’URL), puis réessaie.");
    }
  }

  async function onSend(text: string) {
    if (!text.trim() || !sessionId) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);
    setLastAI(null);

    try {
      const ai = (await sendMessage(sessionId, text)) as AIReturn;
      const responseText = ai.response_text || "Je vous écoute.";
      setMessages((prev) => [...prev, { from: "zena", text: responseText }]);
      setLastAI(ai);

      // TTS (utilise ton hook avancé)
      speak({
        text: responseText,
        lang: "fr-FR",
        gender: "female",
        rate: 1,
        pitch: 1,
        mode: "replace",
      });
    } catch (e) {
      console.error("❌ sendMessage :", e);
      setMessages((prev) => [
        ...prev,
        { from: "zena", text: "Je n’ai pas compris, pouvez-vous reformuler ?" },
      ]);
    } finally {
      setManualText("");
      setLoading(false);
    }
  }

  // Raccourcis utiles
  const quickPrompts = [
    "Je me sens stressé",
    "Je me sens isolé",
    "Charge de travail trop lourde",
    "J’ai besoin de reconnaissance",
    "Conflit avec un collègue",
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fond immersive violet/turquoise */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(1200px 800px at -10% -10%, ${BRAND_TURQUOISE}22 0%, transparent 60%), radial-gradient(1200px 800px at 110% 10%, ${BRAND_VIOLET}22 0%, transparent 60%), linear-gradient(180deg, ${BRAND_VIOLET}0A, ${BRAND_TURQUOISE}0A)`,
        }}
      />
      <div className="absolute -top-24 -right-20 w-[520px] h-[520px] rounded-full blur-2xl opacity-30"
           style={{ background: `radial-gradient(circle, ${BRAND_VIOLET}66, transparent)` }}/>
      <div className="absolute -bottom-24 -left-20 w-[520px] h-[520px] rounded-full blur-2xl opacity-30"
           style={{ background: `radial-gradient(circle, ${BRAND_TURQUOISE}66, transparent)` }}/>

      {/* Carte principale */}
      <div className="relative z-10 mx-auto max-w-md px-4 py-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/40 p-5">
          {/* Header avec avatar + halo */}
          <div className="relative flex items-center gap-3 mb-4">
            <div className="relative w-20 h-20">
              <EmotionHalo active={isListening || loading} />
              <div
                className="absolute inset-0 rounded-full p-[3px]"
                style={{
                  background: `conic-gradient(from 180deg at 50% 50%, ${BRAND_VIOLET}, ${BRAND_TURQUOISE}, ${BRAND_VIOLET})`,
                }}
              >
                <img
                  src="/images/zena-preview.png" // mets ton image ici
                  alt="Zéna"
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: BRAND_VIOLET }}>
                Zéna — alliée émotionnelle
              </h1>
              <p className="text-xs text-gray-500">“Je t’écoute et j’agis, en douceur.”</p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    isListening ? "animate-pulse" : ""
                  }`}
                  style={{ background: isListening ? BRAND_TURQUOISE : "#CBD5E1" }}
                />
                <span className="text-slate-500">
                  {isListening ? "Écoute en cours…" : loading ? "Réflexion…" : "Prête"}
                </span>
                {micError && <span className="text-amber-700">• {micError}</span>}
              </div>
            </div>
          </div>

          {/* Chat — grandit naturellement */}
          <div
            ref={scrollRef}
            className="flex flex-col gap-3 overflow-y-auto transition-all duration-300"
            style={{ minHeight: "96px", maxHeight: "60vh" }}
          >
            {messages.length === 0 && (
              <div className="text-center text-slate-400 text-sm italic">
                Dites “Bonjour Zéna” ou utilisez les raccourcis ci-dessous.
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} m={m} />
            ))}
          </div>

          {/* Insights émotionnels */}
          {lastAI && (lastAI.dominant_emotion || lastAI.recommendations?.length) && (
            <div className="mt-3 border border-slate-200 rounded-2xl p-3 bg-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {typeof lastAI.emotion_score === "number" && (
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ background: BRAND_VIOLET }}
                  >
                    Score émotion : {(lastAI.emotion_score * 100).toFixed(0)}%
                  </span>
                )}
                {lastAI.dominant_emotion && (
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white"
                    style={{ background: BRAND_TURQUOISE }}
                  >
                    {lastAI.dominant_emotion}
                  </span>
                )}
              </div>
              {lastAI.recommendations?.length ? (
                <ul className="list-disc text-sm pl-5 space-y-1 text-slate-700">
                  {lastAI.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {quickPrompts.map((q) => (
              <QuickActionChip key={q} label={q} onClick={() => onSend(q)} />
            ))}
          </div>

          {/* Contrôles bas : micro + saisie */}
          <div className="mt-4 flex items-center gap-2">
            {supported && (
              <button
                onClick={handleMicClick}
                disabled={loading}
                className="p-3 rounded-full shadow-md text-white disabled:opacity-50"
                style={{
                  background: isListening
                    ? BRAND_TURQUOISE
                    : `linear-gradient(135deg, ${BRAND_VIOLET}, ${BRAND_TURQUOISE})`,
                }}
                aria-label="Activer le micro"
                title="Activer le micro"
              >
                {isListening ? "🎙️" : "🎤"}
              </button>
            )}

            <input
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend(manualText)}
              placeholder="Écrire à Zéna…"
              className="flex-1 px-3 py-2 border rounded-xl outline-none focus:ring focus:ring-violet-200"
            />
            <button
              onClick={() => onSend(manualText)}
              disabled={!manualText.trim() || loading}
              className="px-4 py-2 rounded-xl text-white font-medium disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${BRAND_VIOLET}, ${BRAND_TURQUOISE})` }}
            >
              Envoyer
            </button>
          </div>

          {!supported && (
            <p className="mt-2 text-xs text-amber-700">
              ⚠️ La reconnaissance vocale n’est pas supportée par ce navigateur (essaie Chrome/Edge).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
