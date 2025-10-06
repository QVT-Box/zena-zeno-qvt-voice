import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";
import { VoiceControl } from "@/components/VoiceControl";

export default function ZenaChat() {
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
    persona: "zena",
    language: "auto",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] p-6">
      <h1 className="text-3xl font-bold text-[#005B5F] mb-4">Zena – Ma Bulle Attentionnée 💬</h1>

      {/* Affichage des messages */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 mb-6 overflow-y-auto max-h-[50vh] border border-[#78A085]/30">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
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
            Zena réfléchit...
          </p>
        )}
      </div>

      {/* Zone de contrôle vocale */}
      <VoiceControl
        onSpeechRecognized={onUserSpeak}
        isSpeaking={speaking}
        currentMessage={transcript}
        gender="female"
      />

      {/* Statut émotionnel */}
      <div className="mt-8 text-center">
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

      {/* Proposition de box hebdomadaire */}
      {recommendedBox && (
        <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-[#4FD1C5]/40 text-center w-full max-w-md">
          <h2 className="text-xl font-semibold text-[#005B5F] mb-2">
             {recommendedBox.name}
          </h2>
          <p className="text-sm text-[#78A085] font-medium mb-1">
            {recommendedBox.theme}
          </p>
          <p className="text-sm text-gray-600">{recommendedBox.description}</p>
        </div>
      )}

      {/* Boutons pour debug */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={isListening ? stopListening : startListening}
          className="px-4 py-2 bg-[#005B5F] text-white rounded-lg shadow hover:bg-[#00474A] transition"
        >
          {isListening ? " Arrêter" : " Parler"}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg shadow hover:bg-gray-200 transition"
        >
          🔄 Réinitialiser
        </button>
      </div>
    </div>
  );
}
