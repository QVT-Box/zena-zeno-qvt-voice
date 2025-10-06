import { useState, useEffect, useCallback } from 'react';
import ChatInterface, { Message } from '@/components/ChatInterface';
import VoiceControl from '@/components/VoiceControl';
import AvatarDisplay from '@/components/AvatarDisplay';
import BoxRecommendation, { QVTBox } from '@/components/BoxRecommendation';
import { RoleType } from '@/components/RoleSelector';
import { useToast } from '@/hooks/use-toast';

// 🌿 Données QVT Box simulées
const qvtBoxes: QVTBox[] = [
  {
    id: '1',
    name: 'Box Relax & Sérénité',
    description: 'Techniques de relaxation, gestion du stress et micro-pauses utiles.',
    category: 'Bien-être',
    emoji: '🌿',
    color: 'secondary',
  },
  {
    id: '2',
    name: 'Box Cohésion',
    description: 'Outils pour renforcer les liens et célébrer les réussites d’équipe.',
    category: 'Collectif',
    emoji: '💫',
    color: 'primary',
  },
  {
    id: '3',
    name: 'Box Parent Zen',
    description: 'Équilibrer vie pro et familiale en douceur avec des outils simples.',
    category: 'Famille',
    emoji: '🏡',
    color: 'secondary',
  },
];

interface ZenaChatEngineProps {
  gender: 'female' | 'male';
  role: RoleType;
}

const ZenaChatEngine = ({ gender, role }: ZenaChatEngineProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>();
  const [recommendedBoxes, setRecommendedBoxes] = useState<QVTBox[]>([]);
  const { toast } = useToast();

  const avatarName = gender === 'female' ? 'ZENA' : 'ZENO';

  // 👋 Message d’accueil
  useEffect(() => {
    const greeting: Message = {
      id: '1',
      text: `Bonjour, je suis ${avatarName}. Comment vous sentez-vous aujourd’hui ?`,
      sender: 'zena',
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, [gender]);

  // 🧠 Détection d’émotions basique
  const analyzeEmotion = (text: string): string => {
    const t = text.toLowerCase();
    if (t.match(/stress|épuisé|fatigué|anxieux|colère|triste/)) return 'negative';
    if (t.match(/bien|motivé|heureux|reconnaissant|positif/)) return 'positive';
    if (t.match(/seul|isolé|incompris|perdu/)) return 'lonely';
    return 'neutral';
  };

  // 🎁 Recommandations selon émotion
  const getRecommendations = (emotion: string): QVTBox[] => {
    if (emotion === 'negative') return [qvtBoxes[0]];
    if (emotion === 'positive') return [qvtBoxes[1]];
    if (emotion === 'lonely') return [qvtBoxes[2]];
    return [];
  };

  // 💬 Génération de réponse
  const generateResponse = (text: string, emotion: string): string => {
    const tone = gender === 'female' ? '🌸' : '🌿';
    switch (emotion) {
      case 'positive':
        return `${tone} C’est merveilleux ! Continuez à nourrir cette belle énergie.`;
      case 'negative':
        return `${tone} Je sens que la période est tendue. Prenez une respiration ensemble, une pause s’impose.`;
      case 'lonely':
        return `${tone} Vous n’êtes pas seul. On peut en parler tranquillement, à votre rythme.`;
      default:
        return `${tone} Je vous écoute. Qu’aimeriez-vous améliorer dans votre journée ?`;
    }
  };

  // 🚀 Envoi d’un message utilisateur
  const handleSendMessage = useCallback(
    (text: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsProcessing(true);

      const emotion = analyzeEmotion(text);
      setCurrentEmotion(emotion);

      const boxes = getRecommendations(emotion);
      setRecommendedBoxes(boxes);

      setTimeout(() => {
        const reply = generateResponse(text, emotion);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: reply,
          sender: gender === 'female' ? 'zena' : 'zeno',
          timestamp: new Date(),
          emotion,
        };
        setMessages((prev) => [...prev, response]);
        setIsProcessing(false);
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 1500);
    },
    [gender]
  );

  return (
    <div className="space-y-8">
      {/* Avatar + Voix */}
      <div className="flex flex-col items-center gap-6">
        <AvatarDisplay
          isSpeaking={isSpeaking}
          currentEmotion={currentEmotion}
          gender={gender}
        />
        <VoiceControl
          onSpeechRecognized={handleSendMessage}
          isSpeaking={isSpeaking}
          currentMessage={messages[messages.length - 1]?.text}
          gender={gender}
        />
      </div>

      {/* Chat principal */}
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        gender={gender}
      />

      {/* Box recommandées */}
      {recommendedBoxes.length > 0 && (
        <BoxRecommendation
          boxes={recommendedBoxes}
          onSelectBox={(box) => {
            toast({
              title: box.name,
              description: box.description,
            });
          }}
        />
      )}
    </div>
  );
};

export default ZenaChatEngine;
