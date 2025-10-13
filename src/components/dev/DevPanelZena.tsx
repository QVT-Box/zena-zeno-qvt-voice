// DevPanelZena.tsx
import React from "react";
import { useZenaVoice } from "@/hooks/useZenaVoice";

export default function DevPanelZena() {
  const { status, transcript, listen, say, stopAll, speaking, isListening } = useZenaVoice({
    sttLang: "auto",
    continuous: true,
    interimResults: true,
    ttsLang: "fr-FR",
    ttsGender: "female",
  });

  return (
    <div className="p-4 space-y-3 rounded-xl border">
      <div>Status: {status} {speaking ? "🗣️" : isListening ? "👂" : "⏸️"}</div>
      <div>Transcript: <em>{transcript || "…"}</em></div>
      <div className="flex gap-2">
        <button onClick={listen} className="px-3 py-2 rounded bg-emerald-600 text-white">Listen</button>
        <button onClick={() => say("Bonjour, je suis Zéna. Comment puis-je aider ?")} className="px-3 py-2 rounded bg-indigo-600 text-white">Say</button>
        <button onClick={stopAll} className="px-3 py-2 rounded bg-slate-700 text-white">Stop All</button>
      </div>
    </div>
  );
}
