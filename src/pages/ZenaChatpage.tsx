// src/pages/ZenaChatPage.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Mic, SendHorizonal, Volume2, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useZenaVoice } from "@/hooks/useZenaVoice";
import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";

type Message = {
  id: number;
  from: "user" | "zena";
  text: string;
  emotion?: "positive" | "neutral" | "negative";
};

export default function ZenaChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "zena",
      text: "Bonjour, je suis ZÉNA. Comment tu te sens vraiment aujourd'hui, entre 0 et 10 ?",
      emotion: "neutral",
    },
  ]);
  const [input, setInput] = useState("");
  const [listeningTranscript, setListeningTranscript] = useState("");
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleFinalResult = useCallback(
    (transcript: string) => {
      setListeningTranscript(transcript);
      if (transcript) {
        setInput(transcript);
        setTimeout(() => {
          const userMsg: Message = {
            id: nextId.current++,
            from: "user",
            text: transcript,
            emotion: "neutral",
          };
          setMessages((prev) => [...prev, userMsg]);
          setInput("");
          addZenaReply(transcript);
        }, 300);
      }
    },
    [] // nextId is ref, addZenaReply defined below via hoisting
  );

  // Voice hooks
  const { isListening, isSpeaking, audioLevel, listen, stopListening, say } = useZenaVoice({ onFinalResult: handleFinalResult });

  const { emotion, isProcessing, handleUserMessage } = useZenaZenoBrain();

  // scroll auto en bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function addZenaReply(userText: string) {
    const response = await handleUserMessage(userText);

    const newMsg: Message = {
      id: nextId.current++,
      from: "zena",
      text: response || "Merci de me le confier. On va poser ça ensemble.",
      emotion: emotion || "neutral",
    };
    setMessages((prev) => [...prev, newMsg]);

    say(newMsg.text);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isSpeaking || isProcessing) return;

    const userMsg: Message = {
      id: nextId.current++,
      from: "user",
      text: trimmed,
      emotion: "neutral",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    addZenaReply(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleMicClick() {
    if (isListening) {
      stopListening();
    } else {
      listen();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF8EE] via-[#FBF0E2] to-[#F3E6D6] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-white/20">
        <Link to="/" className="flex items-center gap-2 text-[#24160E] hover:text-[#B78E44] transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold text-[#24160E]">ZÉNA</h1>
        <div className="w-20" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left - Avatar and Voice Controls */}
        <motion.div
          className="lg:w-1/3 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl">
              <ZenaAvatar
                emotion={emotion || "neutral"}
                mouthLevel={audioLevel}
                isListening={isListening}
                isSpeaking={isSpeaking}
                gender="female"
              />
          </div>

          {/* Voice Indicators */}
          <div className="flex flex-col gap-3 items-center">
            {isSpeaking && (
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-emerald-300/20 text-emerald-700 rounded-full text-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Volume2 className="w-4 h-4" />
                <span>En train de parler...</span>
              </motion.div>
            )}
            {isListening && (
              <motion.div
                className="flex items-center gap-2 px-4 py-2 bg-blue-300/20 text-blue-700 rounded-full text-sm"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Mic className="w-4 h-4" />
                <span>En écoute...</span>
              </motion.div>
            )}
            {listeningTranscript && (
              <p className="text-sm text-[#927A5C] italic max-w-xs text-center">{listeningTranscript}</p>
            )}
          </div>

          {/* Emotion display */}
          {emotion && (
            <div className="text-center">
              <p className="text-sm text-[#927A5C]">État émotionnel</p>
              <p className="text-lg font-semibold text-[#B78E44] capitalize">{emotion}</p>
            </div>
          )}
        </motion.div>

        {/* Right - Chat Messages */}
        <motion.div
          className="lg:w-2/3 flex flex-col bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                      msg.from === "user"
                        ? "bg-[#20130C] text-white"
                        : msg.emotion === "positive"
                        ? "bg-emerald-100 text-emerald-900"
                        : msg.emotion === "negative"
                        ? "bg-rose-100 text-rose-900"
                        : "bg-[#F3E6D6] text-[#24160E]"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-[#F3E6D6] text-[#24160E] px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">ZÉNA réfléchit...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-4 bg-white/20 backdrop-blur-sm">
            <div className="flex gap-3">
              <button
                onClick={handleMicClick}
                disabled={isSpeaking || isProcessing}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
                  isListening ? "bg-blue-500 text-white" : "bg-white/60 text-[#24160E] hover:bg-white/80 disabled:opacity-50"
                }`}
                aria-label={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute"}
              >
                <Mic className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSpeaking || isProcessing}
                placeholder="Dis-moi ce qui te préoccupe..."
                className="flex-1 px-4 py-2 bg-white/80 rounded-full text-[#24160E] placeholder-[#927A5C] border-0 focus:outline-none focus:ring-2 focus:ring-[#B78E44] resize-none disabled:opacity-50"
                rows={1}
              />

              <button
                onClick={handleSend}
                disabled={!input.trim() || isSpeaking || isProcessing}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#20130C] text-white flex items-center justify-center hover:brightness-110 transition disabled:opacity-50"
                aria-label="Envoyer le message"
              >
                <SendHorizonal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
