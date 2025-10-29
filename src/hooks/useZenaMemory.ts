import { useState } from "react";

export interface EmotionSnapshot {
  emotion: "positive" | "neutral" | "negative";
  timestamp: number;
}

export function useZenaMemory(limit: number = 7) {
  const [history, setHistory] = useState<EmotionSnapshot[]>([]);

  // ➕ Ajouter une émotion à l'historique
  const addEmotion = (emotion: "positive" | "neutral" | "negative") => {
    const entry = { emotion, timestamp: Date.now() };
    setHistory((prev) => {
      const updated = [...prev, entry];
      if (updated.length > limit) updated.shift(); // garde les derniers
      return updated;
    });
  };

  // 📊 Analyse de tendance
  const getTrend = (): "improving" | "stable" | "declining" => {
    if (history.length < 2) return "stable";

    const scores = history.map((h) =>
      h.emotion === "positive" ? 1 : h.emotion === "negative" ? -1 : 0
    );
    const diff = scores[scores.length - 1] - scores[0];

    if (diff > 0) return "improving";
    if (diff < 0) return "declining";
    return "stable";
  };

  return { history, addEmotion, getTrend };
}
