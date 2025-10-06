import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceControlProps {
  onSpeechRecognized: (text: string) => void;
  isSpeaking: boolean;
  currentMessage?: string;
  gender: 'female' | 'male';
}

const VoiceControl = ({ onSpeechRecognized, isSpeaking, currentMessage, gender }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');

  // 🎨 Palette selon avatar actif
  const palette = {
    primary: gender === 'female' ? '#5B4B8A' : '#4B5E8A',
    secondary: gender === 'female' ? '#4FD1C5' : '#64B5F6',
    label: gender === 'female' ? 'ZENA' : 'ZENO',
  };

  // 🎙️ Initialisation reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('La reconnaissance vocale n’est pas supportée sur ce navigateur.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const lastResult = event.results[event.resultIndex];
      const text = lastResult[0].transcript;
      setTranscript(text);
      if (lastResult.isFinal) {
        onSpeechRecognized(text);
        setTranscript('');
      }
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, [onSpeechRecognized]);

  // 🗣️ Lecture de la réponse vocale
  useEffect(() => {
    if (isSpeaking && currentMessage) {
      const voice = new SpeechSynthesisUtterance(currentMessage);
      voice.lang = 'fr-FR';
      voice.pitch = gender === 'female' ? 1.1 : 0.9;
      voice.rate = 0.95;
      voice.volume = 1;
      speechSynthesis.speak(voice);
    }
  }, [isSpeaking, currentMessage, gender]);

  // 🎤 Toggle écoute
  const handleToggle = () => {
    if (!recognitionRef.current) return;
    const recognition = recognitionRef.current;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // 🌈 Styles dynamiques du halo vocal
  const glowColor = isListening
    ? `0 0 40px ${palette.secondary}, 0 0 80px ${palette.primary}80`
    : `0 0 15px ${palette.secondary}50`;

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-4">
      {/* Halo principal */}
      <div
        className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-smooth cursor-pointer select-none ${
          isListening ? 'scale-110 animate-breathe' : 'scale-100'
        }`}
        onClick={handleToggle}
        style={{
          background: `radial-gradient(circle, ${palette.secondary}40, transparent 70%)`,
          boxShadow: glowColor,
        }}
      >
        {isListening ? (
          <Mic className="w-10 h-10 text-white animate-pulse" />
        ) : (
          <MicOff className="w-10 h-10 text-white/80" />
        )}

        {/* Aura lumineuse */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl ${
            isListening
              ? 'animate-pulse-glow opacity-90'
              : 'opacity-40 transition-opacity duration-700'
          }`}
          style={{
            background: `linear-gradient(135deg, ${palette.primary}60, ${palette.secondary}60)`,
          }}
        />
      </div>

      {/* Texte indicatif */}
      <div className="text-center space-y-1">
        <p
          className={`text-sm font-medium tracking-wide ${
            isListening ? 'text-secondary' : 'text-muted-foreground'
          }`}
        >
          {isListening ? 'Je vous écoute...' : `Parlez à ${palette.label}`}
        </p>
        {transcript && (
          <p className="text-xs text-foreground/70 italic">{`“${transcript}”`}</p>
        )}
      </div>
    </div>
  );
};

export default VoiceControl;
