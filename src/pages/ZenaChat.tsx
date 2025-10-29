import { useEffect, useMemo, useRef, useState } from "react";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { speakWithZena, stopSpeaking } from "@/lib/tts";
import { startSession, sendMessage, getSessionMessages } from "@/lib/zenaApi";
import { useZenaMemory } from "@/hooks/useZenaMemory";

/**
 * ZÉNA Chat — Avatar vivant, voix, IA, mémoire émotionnelle, quick-replies
 * - Crée/charge une session Supabase
 * - Écoute micro → envoie au backend IA (qvt-ai) → réponse courte & bienveillante
 * - Voix ElevenLabs + halo animé
 * - Mémoire émotionnelle locale (mini-trend) + historisation Supabase
 * - Quick-replies : "Juste t'écouter" / "Aide-moi à avancer"
 * - Mode Coach (entraînement) pour des réponses plus guidantes
 */
export default function ZenaChat() {
  //  Reconnaissance vocale
  const { isListening, transcript, startListening, stopListening } = useVoiceRecognition();

  //  Mémoire émotionnelle locale (sur les 7 derniers messages)
  const { history, addEmotion, getTrend } = useZenaMemory(7);

  //  États conversation
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [manualText, setManualText] = useState<string>(""); // saisie clavier
  const [modeCoach, setModeCoach] = useState<boolean>(false); // mode "entraînement"
  const [intent, setIntent] = useState<"listen" | "guide" | null>(null); // intention utilisateur

  //  Historique local minimal (optionnel — lecture des derniers messages)
  const [messages, setMessages] = useState<
    { role: "user" | "zena"; text: string; created_at?: string }[]
  >([]);

  const speakingGuard = useRef<boolean>(false); // empêche double lecture

  //  Crée la session et charge l'historique au montage
  useEffect(() => {
    (async () => {
      try {
        const id = await startSession("voice");
        setSessionId(id);
        const past = await getSessionMessages(id);
        const mapped =
          past?.map((m: any) => ({
            role: m.role,
            text: m.text,
            created_at: m.created_at,
          })) || [];
        setMessages(mapped);
      } catch (err) {
        console.error("Init session Zéna :", err);
      }
    })();
  }, []);

  //  Tendance émotionnelle lisible
  const trendLabel = useMemo(() => {
    const t = getTrend();
    return t === "improving" ? " En amélioration" : t === "declining" ? " En baisse" : " Stable";
  }, [history]);

  //  Bouton central : Parler / Stop (écoute ou voix)
  const handleMainToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      speakingGuard.current = false;
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    startListening();
  };

  //  Envoi “intelligent” (transcript ou saisie manuelle)
  const getEffectiveUserText = () => {
    const base = manualText.trim() || transcript.trim();
    if (!base) return "";

    //  Encode l’intention simplement dans le texte (API pourra reconnaître)
    const intentTag = intent === "guide" ? "[INTENT:GUIDE]" : intent === "listen" ? "[INTENT:LISTEN]" : "";
    const coachTag = modeCoach ? "[MODE:COACH]" : "[MODE:DEFAULT]";

    return `${intentTag}${coachTag} ${base}`;
  };

  //  Pipeline : User text -> qvt-ai -> TTS
  const handleSend = async () => {
    if (!sessionId) return;
    const text = getEffectiveUserText();
    if (!text) return;

    setIsLoading(true);
    setReply(" ZÉNA réfléchit...");
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const ai = await sendMessage(sessionId, text); // { text, emotion }
      // Mémorise l’émotion pour la tendance
      const normalizedEmotion =
        ai.emotion === "positive" ? "positive" : ai.emotion === "negative" ? "negative" : "neutral";
      addEmotion(normalizedEmotion as "positive" | "neutral" | "negative");

      // Affiche la réponse textuelle
      setReply(ai.text);
      setMessages((prev) => [...prev, { role: "zena", text: ai.text }]);

      // 🫧 petite pause “respiration” avant la voix
      await new Promise((r) => setTimeout(r, 500));

      //  Parle (protégé contre double lecture)
      if (!speakingGuard.current) {
        speakingGuard.current = true;
        setIsSpeaking(true);
        await speakWithZena(ai.text);
      }
    } catch (err) {
      console.error("Erreur interaction Zéna :", err);
      setReply("Je crois que j’ai besoin d’une petite pause… ");
    } finally {
      setIsSpeaking(false);
      speakingGuard.current = false;
      setIsLoading(false);
      // reset champ manuel mais pas le transcript (l’utilisateur le voit)
      setManualText("");
    }
  };

  //  Quick replies (rendent l’interaction naturelle et guidée)
  const setQuickIntent = (i: "listen" | "guide") => {
    setIntent(i);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-10 pb-24 px-4 text-center bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] overflow-hidden">
      {/* Avatar vivant */}
      <ZenaAvatar textToSpeak={isSpeaking ? reply : ""} />

      {/* Barre d’action centrale */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={handleMainToggle}
          disabled={isLoading}
          className={`px-7 py-3 rounded-full text-white font-semibold shadow-lg transition ${
            isSpeaking
              ? "bg-rose-500 hover:bg-rose-600"
              : isListening
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-[#5B4B8A] hover:bg-[#4A3C79]"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSpeaking ? " Stopper ZÉNA" : isListening ? " Écoute en cours..." : " Parler à ZÉNA"}
        </button>

        {/* Intentions rapides : écoute vs aide */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setQuickIntent("listen")}
            className={`px-4 py-2 rounded-full text-sm shadow ${
              intent === "listen" ? "bg-[#4FD1C5] text-white" : "bg-white text-[#212121]"
            }`}
          >
             Juste t’écouter
          </button>
          <button
            onClick={() => setQuickIntent("guide")}
            className={`px-4 py-2 rounded-full text-sm shadow ${
              intent === "guide" ? "bg-[#4FD1C5] text-white" : "bg-white text-[#212121]"
            }`}
          >
             Aide-moi à avancer
          </button>

          {/* Mode entraînement (coach) */}
          <label className="ml-3 inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={modeCoach}
              onChange={(e) => setModeCoach(e.target.checked)}
            />
            <span className="px-3 py-1 rounded-full bg-white shadow"> Mode Coach</span>
          </label>
        </div>
      </div>

      {/* Zone d'entrée + envoi */}
      <div className="mt-6 w-full max-w-xl">
        <input
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Tu peux aussi écrire ici si tu préfères…"
          className="w-full px-4 py-3 rounded-2xl bg-white/80 backdrop-blur-lg shadow-inner outline-none border border-white/20"
        />
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={handleSend}
            disabled={isLoading || (!manualText.trim() && !transcript.trim())}
            className="px-6 py-2 rounded-full bg-[#4FD1C5] text-white shadow hover:bg-teal-500 transition disabled:opacity-50"
          >
            {isLoading ? " ZÉNA réfléchit..." : "Envoyer à ZÉNA "}
          </button>
          {transcript && (
            <span className="text-xs text-gray-600 italic">
               Reconnu : « {transcript} »
            </span>
          )}
        </div>
      </div>

      {/* Réponse affichée (quand elle ne parle plus) */}
      {reply && !isSpeaking && (
        <div className="mt-6 w-full max-w-xl">
          <p className="text-base leading-relaxed text-[#212121]/85 bg-white/65 backdrop-blur-sm rounded-2xl p-4 shadow-inner whitespace-pre-line">
            {reply}
          </p>
          <p className="text-xs text-gray-500 mt-2">{trendLabel}</p>
        </div>
      )}

      {/* (Optionnel) Petit fil local minimal */}
      {messages.length > 0 && (
        <div className="mt-8 w-full max-w-xl text-left space-y-2">
          {messages.slice(-6).map((m, i) => (
            <div
              key={i}
              className={`inline-block px-3 py-2 rounded-xl text-sm ${
                m.role === "user" ? "bg-white" : "bg-[#EAF6F4]"
              }`}
            >
              <span className="opacity-60 mr-2">{m.role === "user" ? "👤" : "🫧"}</span>
              {m.text}
            </div>
          ))}
        </div>
      )}

      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute top-[-12%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] w-[420px] h-[420px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10" />
    </div>
  );
}
