// src/pages/ZenaChatPage.tsx

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mic, SendHorizonal, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

type Message = {
  id: number;
  from: "user" | "zena";
  text: string;
};

export default function ZenaChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "zena",
      text: "Bonjour, je suis ZÉNA. Comment tu te sens vraiment aujourd’hui, entre 0 et 10 ?"
    }
  ]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const nextId = useRef(2);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // scroll auto en bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    utter.rate = 1;
    utter.pitch = 1.05;
    setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }

  function addZenaReply(userText: string) {
    // logique ultra simple, juste pour le test
    let reply = "Merci de me le confier. On va poser ça ensemble.";
    if (userText.match(/\b([0-3])\b/)) {
      reply =
        "Merci pour ta sincérité. Un niveau comme ça, c’est un vrai signal. On va ralentir, poser des mots et voir à qui tu peux en parler en confiance.";
    } else if (userText.match(/\b(4|5|6)\b/)) {
      reply =
        "Je comprends, ce n’est ni catastrophique ni confortable. On va regarder ce qui pèse le plus aujourd’hui et ce qui pourrait t’alléger un peu.";
    } else if (userText.match(/\b(7|8|9|10)\b/)) {
      reply =
        "C’est précieux de te sentir plutôt bien. On peut prendre un moment pour consolider ce qui va bien, pour que ça t’aide quand ce sera plus difficile.";
    }

    const newMsg: Message = {
      id: nextId.current++,
      from: "zena",
      text: reply
    };
    setMessages((prev) => [...prev, newMsg]);
    speak(reply);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: nextId.current++,
      from: "user",
      text: trimmed
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

  // reconnaissance vocale (si dispo)
  function handleMic() {
    if (typeof window === "undefined") return;
    const AnyRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!AnyRecognition) {
      alert("La reconnaissance vocale n’est pas disponible sur ce navigateur.");
      return;
    }
    const recognition = new AnyRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };
    recognition.start();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D4] via-[#F6EBDD] to-[#E7D3B3] flex flex-col">
      <header className="px-4 md:px-8 py-4 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#5D4A3B] hover:text-[#3d2b1f]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l’accueil
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pb-6">
        <div className="w-full max-w-3xl bg-[#FFF7EA] shadow-[0_20px_60px_rgba(140,96,52,0.28)] rounded-[24px] px-4 py-5 md:px-6 md:py-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#f0d4ad]">
              <img src="/zena-face.png" alt="ZÉNA" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#B49B7B]">
                ZÉNA • espace d’échange
              </p>
              <p className="text-sm text-[#3f3023]">
                Ici, on parle comme on est. Pas besoin de faire semblant.
              </p>
            </div>
          </div>

          {/* zone messages */}
          <div className="mt-2 flex-1 max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.from === "user"
                      ? "bg-[#F0DEC4] text-[#3b2515] rounded-br-sm"
                      : "bg-[#26221E] text-[#FDEBD0] rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* zone input */}
          <div className="mt-3 border-t border-[#E4D2B8] pt-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[0.8rem] text-[#7a6753]">
              <span>
                Tu peux écrire, ou dicter avec le micro. ZÉNA te répond à voix haute.
              </span>
              <button
                type="button"
                onClick={() => {
                  const lastZena = [...messages].reverse().find((m) => m.from === "zena");
                  if (lastZena) speak(lastZena.text);
                }}
                className="hidden md:inline-flex items-center gap-1 text-[#7a5a34] hover:text-[#503519]"
              >
                <Volume2 className="w-4 h-4" />
                Réécouter ZÉNA
              </button>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Dis-lui par exemple : « Honnêtement, je suis à 4 sur 10, je suis épuisé.e. »"
                className="flex-1 resize-none rounded-2xl border border-[#E1CCAE] bg-white/80 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E6A44B]/60 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleMic}
                className="inline-flex items-center justify-center rounded-full w-9 h-9 bg-[#F6EEE1] text-[#7c5832] hover:bg-[#f1e0c4] transition"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-[#E6A44B] text-[#1F1307] shadow-md hover:bg-[#d8953b] transition"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>

            {speaking && (
              <p className="text-[0.75rem] text-[#7a6753] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E6A44B] animate-ping" />
                ZÉNA parle…
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
