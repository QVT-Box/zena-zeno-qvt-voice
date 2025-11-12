import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ZenaAvatar from "@/components/ZenaAvatar";
import ZenaBackground from "@/components/ZenaBackground";
import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, LayoutDashboard, Heart, LifeBuoy, Shield } from "lucide-react";
import { useState } from "react";

export default function ZenaChat() {
  const navigate = useNavigate();
  const [textInput, setTextInput] = useState("");

  const {
    messages,
    thinking,
    emotionalState,
    recommendedBox,
    supportResources,
    speaking,
    isListening,
    listen,
    stopListening,
    transcript,
    audioLevel,
    onUserSpeak,
  } = useZenaZenoBrain({
    persona: "zena",
    language: "auto",
  });

  // 💬 Message d'accueil personnalisé
  useEffect(() => {
    if (messages.length === 0) {
      onUserSpeak("Bonjour ZÉNA");
    }
  }, []);

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      listen();
    }
  };

  const handleSendText = () => {
    const text = textInput.trim() || transcript.trim();
    if (!text) return;
    onUserSpeak(text);
    setTextInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // 🎨 Couleur du bouton micro selon l'état
  const micButtonColor = speaking
    ? "bg-rose-500 hover:bg-rose-600"
    : isListening
    ? "bg-yellow-500 hover:bg-yellow-600"
    : "bg-primary hover:bg-primary/90";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <ZenaBackground />

      {/* 🧭 Actions rapides contextuelles */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/qsh")}
          className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
        >
          <Shield className="w-4 h-4 mr-2" />
          QSH
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/wellness-hub")}
          className="bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
        >
          <Heart className="w-4 h-4 mr-2" />
          Wellness
        </Button>
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-center lg:items-start z-10">
        {/* 🩵 Colonne gauche : Avatar */}
        <div className="flex flex-col items-center justify-center w-full lg:w-2/5">
          <div className="relative">
            <img
              src="/images/zena-face.png"
              alt="ZÉNA"
              className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-white/40 opacity-95"
            />
            {/* 🪶 Halo + bouche animée */}
            <div className="absolute inset-0">
              <ZenaAvatar
                emotion={emotionalState.mood}
                mouthLevel={audioLevel}
                overlay
              />
            </div>
          </div>

          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-widest">
              ZÉNA
            </h2>
            <p className="text-sm text-muted-foreground">
              La voix qui veille sur vos émotions
            </p>
            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  emotionalState.mood === "positive"
                    ? "bg-green-500"
                    : emotionalState.mood === "negative"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              <span>Score QVT: {emotionalState.score}/15</span>
            </div>
          </motion.div>
        </div>

        {/* 💬 Colonne droite : Chat */}
        <div className="flex flex-col w-full lg:w-3/5 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 max-h-[600px]">
          {/* 📜 Historique des messages */}
          <ScrollArea className="flex-1 pr-4 mb-4 h-[400px]">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-4 flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-secondary px-4 py-3 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    💭 ZÉNA réfléchit...
                  </p>
                </div>
              </motion.div>
            )}
          </ScrollArea>

          {/* 🆘 Ressources d'aide contextuelles */}
          {supportResources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <LifeBuoy className="w-4 h-4 text-rose-600" />
                <p className="text-sm font-semibold text-rose-800">
                  Ressources d'aide disponibles
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {supportResources.map((resource) => (
                  <Button
                    key={resource.id}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      resource.url && window.open(resource.url, "_blank")
                    }
                    className="text-xs"
                  >
                    {resource.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 📦 Box recommandée */}
          {recommendedBox && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-accent/10 border border-accent/30 rounded-xl"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                📦 Box recommandée : {recommendedBox.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {recommendedBox.description}
              </p>
            </motion.div>
          )}

          {/* 🎙️ Zone de saisie */}
          <div className="flex gap-2">
            <Button
              onClick={handleToggleMic}
              size="lg"
              className={`${micButtonColor} rounded-full transition-all shadow-lg ${
                isListening ? "animate-pulse" : ""
              }`}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isListening
                  ? transcript || "Je t'écoute..."
                  : "Écris ton message à ZÉNA…"
              }
              className="flex-1 rounded-full bg-background/80 border-border/50 focus:ring-accent"
              disabled={speaking || thinking}
            />

            <Button
              onClick={handleSendText}
              size="lg"
              disabled={
                (!textInput.trim() && !transcript.trim()) ||
                speaking ||
                thinking
              }
              className="rounded-full bg-accent hover:bg-accent/90 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* ℹ️ Indicateur d'état */}
          <div className="mt-2 text-center">
            {speaking && (
              <p className="text-xs text-muted-foreground animate-pulse">
                🗣️ ZÉNA parle...
              </p>
            )}
            {isListening && !speaking && (
              <p className="text-xs text-muted-foreground animate-pulse">
                🎤 Je t'écoute...
              </p>
            )}
            {!speaking && !isListening && (
              <p className="text-xs text-muted-foreground">
                Parle ou écris à ZÉNA
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
