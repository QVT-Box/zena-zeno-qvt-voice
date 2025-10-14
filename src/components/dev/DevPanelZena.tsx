// DevPanelZena.tsx
import React from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";

export default function DevPanelZena() {
  const { transcript, listen, say, stopListening, isSpeaking, isListening } = useZenaVoice({
    sttLang: "auto",
    continuous: true,
    interimResults: true,
    lang: "fr-FR",
    gender: "female",
  });

  const status = isSpeaking ? "speaking" : isListening ? "listening" : "idle";
  
  const handleStopAll = () => {
    stopListening();
    say(""); // Stop TTS
  };

  return (
    <div className="p-4 space-y-3 rounded-xl border">
      <div>Status: {status} {isSpeaking ? "🗣️" : isListening ? "👂" : "⏸️"}</div>
      <div>Transcript: <em>{transcript || "…"}</em></div>
      <div className="flex gap-2">
        <button onClick={listen} className="px-3 py-2 rounded bg-emerald-600 text-white">Listen</button>
        <button onClick={() => say("Bonjour, je suis Zéna. Comment puis-je aider ?")} className="px-3 py-2 rounded bg-indigo-600 text-white">Say</button>
        <button onClick={handleStopAll} className="px-3 py-2 rounded bg-slate-700 text-white">Stop All</button>
      </div>
    </div>
  );
}
