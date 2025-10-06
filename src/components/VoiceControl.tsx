import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage?: string;
}

const VoiceControl = ({ onSpeechRecognized, isSpeaking, currentMessage }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSpeechRecognized(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Erreur",
          description: "Je n'ai pas pu comprendre. Réessayez s'il vous plaît.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onSpeechRecognized, toast]);

  useEffect(() => {
    // Speak the current message if not muted
    if (currentMessage && !isMuted && synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(currentMessage);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      synthRef.current.speak(utterance);
    }
  }, [currentMessage, isMuted]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const toggleMute = () => {
    if (synthRef.current) {
      if (isMuted) {
        setIsMuted(false);
      } else {
        synthRef.current.cancel();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <Button
        variant={isListening ? 'default' : 'outline'}
        size="lg"
        onClick={toggleListening}
        className={`rounded-full w-16 h-16 transition-smooth ${
          isListening ? 'bg-secondary shadow-glow animate-pulse' : ''
        }`}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        onClick={toggleMute}
        className="rounded-full w-16 h-16 transition-smooth"
      >
        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
      </Button>
      
      {isListening && (
        <span className="text-sm text-muted-foreground animate-pulse">
          Je vous écoute...
        </span>
      )}
    </div>
  );
};

export default VoiceControl;
