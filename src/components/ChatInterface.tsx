import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { Message } from './ChatInterface.types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

const ChatInterface = ({ messages, onSendMessage, isProcessing }: ChatInterfaceProps) => {
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

  // --- Déterminer les couleurs selon l’émotion détectée ---
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

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md rounded-2xl shadow-soft border border-border overflow-hidden animate-slide-up">
      {/* En-tête */}
      <div className="p-4 border-b border-border bg-gradient-emotion flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-foreground tracking-wide">
          Conversation avec ZENA
        </h3>
        <span className="text-xs text-primary-foreground/70">
          Votre bulle d’écoute
        </span>
      </div>

      {/* Zone de messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto scroll-smooth">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-slide-up`}
          >
            <div
              className={`relative max-w-[80%] px-4 py-3 rounded-2xl transition-smooth
              ${message.sender === 'user'
                ? 'bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white shadow-glow'
                : getEmotionStyle(message.emotion)
              }`}
            >
              {/* Message text */}
              <p className="text-sm leading-relaxed">{message.text}</p>

              {/* Heure */}
              <span className={`text-[10px] mt-1 block text-right opacity-70`}>
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {/* Halo animé autour de ZENA quand elle parle */}
              {message.sender === 'zena' && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none animate-halo opacity-30" />
              )}
            </div>
          </div>
        ))}

        {/* Animation “ZENA écrit...” */}
        {isProcessing && (
          <div className="flex justify-start animate-slide-up">
            <div className="bg-secondary/20 border border-secondary/30 rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-secondary rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  ZENA réfléchit...
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
            placeholder="Écrivez un message ou partagez une émotion..."
            className="flex-1 rounded-full border-border focus-visible:ring-secondary"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || isProcessing}
            className="rounded-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] hover:opacity-90 shadow-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
