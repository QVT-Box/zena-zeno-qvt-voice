import { useState } from 'react';
import AvatarDisplay from '@/components/AvatarDisplay';
import RoleSelector, { RoleType } from '@/components/RoleSelector';
import VoiceControl from '@/components/VoiceControl';
import ChatInterface, { Message } from '@/components/ChatInterface';
import BoxRecommendation, { QVTBox } from '@/components/BoxRecommendation';
import { useToast } from '@/hooks/use-toast';

// Mock QVT Boxes data
const qvtBoxes: QVTBox[] = [
  {
    id: '1',
    name: 'Box Relax & Sérénité',
    description: 'Techniques de relaxation et gestion du stress pour retrouver votre calme intérieur.',
    category: 'Bien-être',
    emoji: '🌿',
    color: 'secondary',
  },
  {
    id: '2',
    name: 'Box Cohésion',
    description: 'Activités pour renforcer les liens et célébrer les réussites en équipe.',
    category: 'Collectif',
    emoji: '💫',
    color: 'primary',
  },
  {
    id: '3',
    name: 'Box Parent Zen',
    description: 'Conseils et outils pour équilibrer vie pro et vie de parent sereinement.',
    category: 'Famille',
    emoji: '🏡',
    color: 'secondary',
  },
];

const Index = () => {
  const [currentRole, setCurrentRole] = useState<RoleType>('coach');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis ZENA, votre coach bien-être. Comment puis-je vous accompagner aujourd\'hui ?',
      sender: 'zena',
      timestamp: new Date(),
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>();
  const [recommendedBoxes, setRecommendedBoxes] = useState<QVTBox[]>([]);
  const { toast } = useToast();

  const analyzeEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Negative emotions
    if (lowerText.match(/stress|anxieux|fatigué|épuisé|débordé|triste|difficile/)) {
      return 'negative';
    }
    
    // Positive emotions
    if (lowerText.match(/bien|heureux|motivé|content|satisfait|enthousiaste/)) {
      return 'positive';
    }
    
    return 'neutral';
  };

  const getRecommendations = (emotion: string, role: RoleType): QVTBox[] => {
    if (emotion === 'negative') {
      return [qvtBoxes[0]]; // Relax & Sérénité
    } else if (emotion === 'positive') {
      return [qvtBoxes[1]]; // Cohésion
    }
    return [];
  };

  const generateResponse = (userMessage: string, emotion: string, role: RoleType): string => {
    const responses: Record<RoleType, Record<string, string>> = {
      coach: {
        negative: `Je comprends que vous traversez un moment difficile. La Box Relax & Sérénité pourrait vous aider à retrouver votre équilibre. Voulez-vous en savoir plus ?`,
        positive: `C'est merveilleux de vous sentir si bien ! Et si on célébrait cette belle énergie avec la Box Cohésion ?`,
        neutral: `Je suis là pour vous écouter. Que souhaitez-vous améliorer dans votre quotidien ?`,
      },
      manager: {
        negative: `Je note que le niveau de stress est élevé. Avez-vous pensé à des moments de pause réguliers ? La Box Relax pourrait être un bon outil pour votre équipe.`,
        positive: `Excellente progression ! Cette dynamique positive mériterait d'être partagée avec l'équipe.`,
        neutral: `Comment puis-je vous aider à optimiser le bien-être de votre équipe ?`,
      },
      parent: {
        negative: `Être parent tout en travaillant peut être intense. Vous faites de votre mieux. La Box Parent Zen propose des pistes concrètes.`,
        positive: `C'est inspirant de voir votre énergie ! Continuez à prendre soin de vous et de votre famille.`,
        neutral: `Comment se passe l'équilibre entre votre vie pro et votre vie de parent ?`,
      },
      legal: {
        negative: `Vos droits au bien-être au travail sont importants. Souhaitez-vous des informations sur vos droits ?`,
        positive: `Gardez cette énergie positive, et n'hésitez pas si vous avez besoin d'informations.`,
        neutral: `Je suis là pour vous informer sur vos droits et vous accompagner.`,
      },
    };

    return responses[role][emotion] || responses[role]['neutral'];
  };

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    // Analyze emotion
    const emotion = analyzeEmotion(text);
    setCurrentEmotion(emotion);

    // Get recommendations
    const boxes = getRecommendations(emotion, currentRole);
    setRecommendedBoxes(boxes);

    // Simulate processing delay
    setTimeout(() => {
      const response = generateResponse(text, emotion, currentRole);
      
      const zenaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'zena',
        timestamp: new Date(),
        emotion,
      };
      
      setMessages((prev) => [...prev, zenaMessage]);
      setIsProcessing(false);
      setIsSpeaking(true);
      
      // Stop speaking after a delay
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1500);
  };

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    
    const roleMessages: Record<RoleType, string> = {
      coach: 'Je suis maintenant en mode Coach Bien-être. Parlons de votre équilibre émotionnel.',
      manager: 'Je suis maintenant en mode Manager QVT. Optimisons le bien-être de votre équipe.',
      parent: 'Je suis maintenant en mode Parent Mentor. Trouvons ensemble votre équilibre familial.',
      legal: 'Je suis maintenant en mode Conseiller. Je peux vous informer sur vos droits.',
    };
    
    const message: Message = {
      id: Date.now().toString(),
      text: roleMessages[role],
      sender: 'zena',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="min-h-screen gradient-ambient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
            ZENA
          </h1>
          <p className="text-lg text-muted-foreground">
            La voix qui veille sur vos émotions
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
            <AvatarDisplay isSpeaking={isSpeaking} currentEmotion={currentEmotion} />
            <VoiceControl
              onSpeechRecognized={handleSendMessage}
              isSpeaking={isSpeaking}
              currentMessage={messages[messages.length - 1]?.sender === 'zena' ? messages[messages.length - 1].text : undefined}
            />
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </div>
        </div>

        {/* Role Selector */}
        <div className="mb-8">
          <RoleSelector currentRole={currentRole} onRoleChange={handleRoleChange} />
        </div>

        {/* Box Recommendations */}
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
    </div>
  );
};

export default Index;
