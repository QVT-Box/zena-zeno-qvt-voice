import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'zena' | 'zeno';
  timestamp: Date;
  emotion?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  gender: 'female' | 'male'; // ← on ajoute le genre actif
}

const ChatInterface = ({ messages, onSendMessage, isProcessing, gender }: ChatInterfaceProps) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isProcessing) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  // 🎨 Palette selon le genre actif
  const palette = {
    primary: gender === 'female' ? '#5B4B8A' : '#4B5E8A',
    secondary: gender === 'female' ? '#4FD1C5' : '#64B5F6',
    label: gender === 'female' ? 'ZENA' : 'ZENO',
  };

  // 🎭 Style selon émotion
  const getEmotionStyle = (emotion?: string) => {
    switch (emotion) {
      case 'positive':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'negative':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'lonely':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-secondary/20 text-foreground border border-secondary/30';
    }
  };

  // 🎤 Voix IA dynamique
  const speak = (text: string) => {
    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = 'fr-FR';
    voice.pitch = gender === 'female' ? 1.1 : 0.9;
    voice.rate = 0.96;
    voice.volume = 1;
    speechSynthesis.speak(voice);
  };

  // Parler lors de nouveaux messages de ZENA/ZENO
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && (last.sender === 'zena' || last.sender === 'zeno')) {
      speak(last.text);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md rounded-2xl shadow-soft border border-border overflow-hidden animate-slide-up">
      {/* Header dynamique */}
      <div
        className="p-4 border-b border-border flex items-center justify-between"
        style={{
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
        }}
      >
        <h3 className="text-lg font-semibold text-white tracking-wide">
          Conversation avec {palette.label}
        </h3>
        <span className="text-xs text-white/80">
          Votre bulle d’écoute personnalisée
        </span>
      </div>

      {/* Zone de chat */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-slide-up`}
          >
            <div
              className={`relative max-w-[80%] px-4 py-3 rounded-2xl transition-smooth ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white shadow-glow'
                  : getEmotionStyle(message.emotion)
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <span className="text-[10px] mt-1 block text-right opacity-70">
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {/* Halo doux pour les messages IA */}
              {(message.sender === 'zena' || message.sender === 'zeno') && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none animate-halo opacity-25"
                  style={{
                    boxShadow: `0 0 40px ${palette.secondary}60`,
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {/* ZENA/ZENO “réfléchit…” */}
        {isProcessing && (
          <div className="flex justify-start animate-slide-up">
            <div
              className="border rounded-2xl px-4 py-3 bg-secondary/20 border-secondary/30"
              style={{ borderColor: `${palette.secondary}60` }}
            >
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: palette.secondary,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  {palette.label} réfléchit...
                </span>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Barre d’entrée */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card/70 backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Exprimez-vous avec ${palette.label}...`}
            className="flex-1 rounded-full border-border focus-visible:ring-secondary"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isProcessing}
            className="rounded-full shadow-glow"
            style={{
              background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
              color: '#fff',
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
