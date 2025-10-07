import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";
import { VoiceControl } from "@/components/VoiceControl";

interface ZenaChatEngineProps {
  gender: "female" | "male";
  role: string;
}

/**
 * 💬 ZenaChatEngine
 * -------------------------------------------------------
 * Interface principale de discussion avec ZÉNA / ZÉNO
 * - Affiche les messages
 * - État émotionnel
 * - Box recommandée
 * - Interaction vocale
 */
export default function ZenaChatEngine({ gender, role }: ZenaChatEngineProps) {
  const persona = gender === "female" ? "zena" : "zeno";

  const {
    isListening,
    startListening,
    stopListening,
    speaking,
    thinking,
    messages,
    emotionalState,
    recommendedBox,
    onUserSpeak,
    transcript,
  } = useZenaZenoBrain({
    persona,
    language: "auto",
  });

  return (
    <div className="w-full bg-white/70 backdrop-blur-lg border border-[#A4D4AE]/40 rounded-3xl shadow-xl p-6 md:p-10 space-y-6 animate-fade-in">
      {/* 💬 Conversation */}
      <div className="max-h-[50vh] overflow-y-auto p-4 rounded-2xl bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] border border-[#78A085]/30 shadow-inner">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground italic py-8">
            {persona === "zena"
              ? "Je suis Zéna, ton alliée bien-être. Parle-moi, je t’écoute 💬"
              : "Je suis Zéno, ton guide serein. Que veux-tu partager aujourd’hui ? 💬"}
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                m.from === "user"
                  ? "bg-[#A4D4AE] text-[#212121]"
                  : "bg-[#005B5F] text-white"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <p className="text-xs text-center text-gray-400 italic animate-pulse">
            {persona === "zena" ? "Zéna réfléchit..." : "Zéno réfléchit..."}
          </p>
        )}
      </div>

      {/* 🎙️ Contrôle vocal */}
      <VoiceControl
        onSpeechRecognized={onUserSpeak}
        isSpeaking={speaking}
        currentMessage={transcript}
        gender={gender}
      />

      {/* 💫 État émotionnel */}
      <div className="text-center space-y-1">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">État émotionnel :</span>{" "}
          {emotionalState.mood === "positive"
            ? "😊 Positif"
            : emotionalState.mood === "negative"
            ? "😔 Fragile"
            : "😐 Neutre"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Score QVT :</span> {emotionalState.score} / 15
        </p>
      </div>

      {/* 🎁 Box recommandée */}
      {recommendedBox && (
        <div className="bg-white rounded-2xl border border-[#4FD1C5]/30 shadow-md p-5 text-center mt-4 animate-slide-up">
          <h2 className="text-xl font-semibold text-[#005B5F] mb-2">
            🎁 {recommendedBox.name}
          </h2>
          <p className="text-sm text-[#78A085] font-medium mb-1">
            {recommendedBox.theme}
          </p>
          <p className="text-sm text-gray-600">{recommendedBox.description}</p>
        </div>
    </div>
  );
}
