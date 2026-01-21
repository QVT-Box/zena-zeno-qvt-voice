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
      text: "Bonjour, je suis Z?NA. Comment tu te sens vraiment aujourd'hui, entre 0 et 10 ?",
      emotion: "neutral",
    },
  ]);
  const [input, setInput] = useState("");
  const [listeningTranscript, setListeningTranscript] = useState("");
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const emotionLabels: Record<NonNullable<Message["emotion"]>, string> = {
    positive: "sereine",
    neutral: "neutre",
    negative: "sous tension",
  };

  const emotionClasses: Record<NonNullable<Message["emotion"]>, string> = {
    positive: "text-emerald-700",
    neutral: "text-[#B78E44]",
    negative: "text-rose-700",
  };

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
      text: response || "Merci de me le confier. On peut respirer un instant, et tu peux me dire ce qui p?se le plus.",
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
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={
        {
          "--zena-ink": "#24160E",
          "--zena-gold": "#C89A49",
          "--zena-cream": "#FFF6E8",
          "--zena-sand": "#F4E3CE",
          "--zena-peach": "#F9E8D2",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full blur-3xl opacity-70"
          style={{
            background: "radial-gradient(circle at 30% 30%, #F5D9B2 0%, rgba(245, 217, 178, 0.2) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-56 right-[-160px] h-[560px] w-[560px] rounded-full blur-3xl opacity-70"
          style={{
            background: "radial-gradient(circle at 70% 70%, #D7C3F3 0%, rgba(215, 195, 243, 0.25) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(36, 22, 14, 0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-white/30">
        <Link to="/" className="flex items-center gap-2 text-[#24160E] hover:text-[#B78E44] transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Retour</span>
        </Link>
        <h1 className="text-2xl font-semibold text-[#24160E] heading-chic tracking-[0.08em]">
          Z?NA
        </h1>
        <div className="w-20" />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left - Avatar and Voice Controls */}
        <motion.div
          className="lg:w-[340px] flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-xs rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_24px_70px_rgba(36,22,14,0.18)] p-6">
            <div className="text-center mb-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#A27E3E]">Pr?sence</p>
              <h2 className="heading-chic text-xl text-[#24160E]">Z?NA</h2>
              <p className="text-sm text-[#7A6348]">?coute douce, r?ponses humaines.</p>
            </div>

            {/* Avatar */}
            <div className="relative mx-auto w-48 h-48 rounded-full overflow-hidden shadow-2xl">
              <div className="absolute inset-0 rounded-full ring-2 ring-[#C89A49]/40" />
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-[#F6E1BF] via-transparent to-[#D9C3F3] opacity-60 blur-2xl" />
              <ZenaAvatar
                emotion={emotion || "neutral"}
                mouthLevel={audioLevel}
                isListening={isListening}
                isSpeaking={isSpeaking}
                gender="female"
              />
            </div>

            {/* Voice Indicators */}
            <div className="flex flex-col gap-2 items-center mt-5">
              {isSpeaking && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-300/30 text-emerald-800 rounded-full text-xs font-semibold tracking-wide"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Elle r?pond</span>
                </motion.div>
              )}
              {isListening && (
                <motion.div
                  className="flex items-center gap-2 px-4 py-2 bg-blue-300/30 text-blue-800 rounded-full text-xs font-semibold tracking-wide"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic className="w-4 h-4" />
                  <span>En ?coute</span>
                </motion.div>
              )}
              {listeningTranscript && (
                <p className="text-xs text-[#7A6348] italic text-center bg-white/70 px-3 py-2 rounded-xl border border-white/60">
                  ?{listeningTranscript}?
                </p>
              )}
            </div>

            {/* Emotion display */}
            {emotion && (
              <div className="text-center mt-4">
                <p className="text-xs uppercase tracking-[0.28em] text-[#927A5C]">?tat ?motionnel</p>
                <p className={`text-lg font-semibold capitalize ${emotionClasses[emotion]}`}>
                  {emotionLabels[emotion]}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right - Chat Messages */}
        <motion.div
          className="flex-1 flex flex-col bg-white/55 backdrop-blur-xl rounded-[32px] border border-white/40 overflow-hidden shadow-[0_24px_70px_rgba(36,22,14,0.12)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 pt-6 pb-4 border-b border-white/30">
            <p className="text-xs uppercase tracking-[0.3em] text-[#A27E3E]">Conversation</p>
            <h2 className="heading-chic text-xl text-[#24160E]">Un espace pour d?poser ce qui p?se</h2>
            <p className="text-sm text-[#7A6348] mt-1">
              Z?NA t??coute sans jugement. Tu peux parler librement, ? ton rythme.
            </p>
          </div>

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
                        ? "bg-gradient-to-br from-[#1E120B] via-[#2B180F] to-[#1A0F09] text-white shadow-[0_10px_25px_rgba(22,12,6,0.35)]"
                        : msg.emotion === "positive"
                        ? "bg-emerald-100 text-emerald-900"
                        : msg.emotion === "negative"
                        ? "bg-rose-100 text-rose-900"
                        : "bg-[#F8ECDD] text-[#24160E]"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="bg-[#F8ECDD] text-[#24160E] px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Z?NA r?fl?chit...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/30 p-4 bg-white/30 backdrop-blur-sm">
            <div className="flex gap-3">
              <button
                onClick={handleMicClick}
                disabled={isSpeaking || isProcessing}
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition ${
                  isListening ? "bg-blue-500 text-white" : "bg-white/70 text-[#24160E] hover:bg-white/90 disabled:opacity-50"
                }`}
                aria-label={isListening ? "Arr?ter l'?coute" : "D?marrer l'?coute"}
              >
                <Mic className="w-5 h-5" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSpeaking || isProcessing}
                placeholder="Dis-moi ce qui te pr?occupe..."
                className="flex-1 px-4 py-2 bg-white/90 rounded-full text-[#24160E] placeholder-[#927A5C] border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#B78E44] resize-none disabled:opacity-50"
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

            <div className="flex flex-wrap gap-2 mt-3">
              {["Je me sens ?puis?(e)", "Je suis stress?(e)", "J?ai besoin d?en parler"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setInput(chip)}
                  className="text-xs px-3 py-1 rounded-full bg-white/80 border border-white/60 text-[#7A6348] hover:text-[#24160E] hover:border-[#C89A49]/60 transition"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
