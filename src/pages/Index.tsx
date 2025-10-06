import { useState, useEffect } from 'react';
import AvatarDisplay from '@/components/AvatarDisplay';
import AvatarGenderSelector from '@/components/AvatarGenderSelector';
import RoleSelector, { RoleType } from '@/components/RoleSelector';
import ChatInterface, { Message } from '@/components/ChatInterface';
import BoxRecommendation, { QVTBox } from '@/components/BoxRecommendation';
import { useToast } from '@/hooks/use-toast';

// --- Mock QVT Boxes data ---
const qvtBoxes: QVTBox[] = [
  {
    id: '1',
    name: 'Box Relax & Sérénité',
    description: 'Techniques de relaxation et gestion du stress pour retrouver votre calme intérieur.',
    category: 'Bien-être',
    color: 'secondary',
  },
  {
    id: '2',
    name: 'Box Cohésion',
    description: 'Activités pour renforcer les liens et célébrer les réussites en équipe.',
    category: 'Collectif',
    color: 'primary',
  },
  {
    id: '3',
    name: 'Box Parent Zen',
    description: 'Conseils et outils pour équilibrer vie pro et vie de parent sereinement.',
    category: 'Famille',
    color: 'secondary',
  },
  {
    id: '4',
    name: 'Box Énergie & Focus',
    description: 'Routines et produits pour booster votre concentration et énergie au travail.',
    category: 'Performance',
    color: 'accent',
  },
];

const Index = () => {
  const [gender, setGender] = useState<'female' | 'male'>(() => {
    const saved = localStorage.getItem('avatar-gender');
    return (saved === 'male' ? 'male' : 'female') as 'female' | 'male';
  });
  const [currentRole, setCurrentRole] = useState<RoleType>('coach');
  const avatarName = gender === 'female' ? 'ZENA' : 'ZENO';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Bonjour ! Je suis ${avatarName}, votre compagnon QVT. Comment vous sentez-vous aujourd'hui ?`,
      sender: 'zena',
      timestamp: new Date(),
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>();
  const [recommendedBoxes, setRecommendedBoxes] = useState<QVTBox[]>([]);
  const { toast } = useToast();

  // --- Speech Recognition & Synthesis setup ---
  useEffect(() => {
    localStorage.setItem('avatar-gender', gender);
  }, [gender]);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = 1.05;
    utterance.rate = 0.98;
    utterance.voice = speechSynthesis.getVoices().find((v) =>
      gender === 'female' ? v.name.toLowerCase().includes('f') : v.name.toLowerCase().includes('m')
    );
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
    utterance.onend = () => setIsSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Micro non supporté",
        description: "Votre navigateur ne supporte pas la reconnaissance vocale.",
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      handleSendMessage(text);
    };
  };

  // --- Emotion analysis ---
  const analyzeEmotion = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.match(/stress|anxieux|fatigué|épuisé|débordé|triste|colère|inquiet|angoissé/)) return 'negative';
    if (lowerText.match(/bien|heureux|motivé|content|reconnu|enthousiaste|fier/)) return 'positive';
    if (lowerText.match(/seul|isolé|incompris|perdu/)) return 'lonely';
    return 'neutral';
  };

  const getRecommendations = (emotion: string, role: RoleType): QVTBox[] => {
    switch (emotion) {
      case 'negative':
        return [qvtBoxes[0]]; // Relax & Sérénité
      case 'positive':
        return [qvtBoxes[1]]; // Cohésion
      case 'lonely':
        return [qvtBoxes[3]]; // Energie & Focus
      default:
        return [qvtBoxes[2]]; // Parent Zen par défaut
    }
  };

  const generateResponse = (userMessage: string, emotion: string, role: RoleType): string => {
    const tone = {
      negative: "Je sens un peu de tension dans vos mots.",
      positive: "Quel bel élan positif aujourd’hui !",
      lonely: "Je perçois un peu de solitude.",
      neutral: "Merci pour ce partage.",
    }[emotion];

    const box = getRecommendations(emotion, role)[0];
    const boxPart = box ? `Je vous recommande la ${box.name} ${box.emoji} : ${box.description}` : '';

    const roleIntro: Record<RoleType, string> = {
      coach: "En tant que coach bien-être,",
      manager: "En tant que manager QVT,",
      parent: "Avec mon regard de parent,",
      legal: "Sur le plan juridique et humain,",
    };

    return `${tone} ${roleIntro[role]} ${boxPart}`;
  };

  // --- Handle messages ---
  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    const emotion = analyzeEmotion(text);
    setCurrentEmotion(emotion);

    const boxes = getRecommendations(emotion, currentRole);
    setRecommendedBoxes(boxes);

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
      speak(response);
      setIsProcessing(false);
    }, 1500);
  };

  const handleRoleChange = (role: RoleType) => {
    setCurrentRole(role);
    const messages: Record<RoleType, string> = {
      coach: 'Je suis en mode Coach Bien-être ',
      manager: 'Je passe en mode Manager QVT ',
      parent: 'Je passe en mode Parent Mentor ',
      legal: 'Je passe en mode Conseiller ',
    };
    const message: Message = {
      id: Date.now().toString(),
      text: messages[role],
      sender: 'zena',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    speak(messages[role]);
  };

  return (
    <div className="min-h-screen gradient-ambient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-primary bg-clip-text text-transparent">
            {avatarName}
          </h1>
          <p className="text-lg text-muted-foreground">
            La voix qui veille sur vos émotions 
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
            <AvatarGenderSelector gender={gender} onGenderChange={setGender} />
            <AvatarDisplay isSpeaking={isSpeaking} currentEmotion={currentEmotion} gender={gender} />
            <button
              onClick={startListening}
              className="px-4 py-2 rounded-xl bg-primary text-white hover:opacity-90 transition"
            >
               Parler à {avatarName}
            </button>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isProcessing={isProcessing} />
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
              speak(`Je vous en dis plus sur ${box.name}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
