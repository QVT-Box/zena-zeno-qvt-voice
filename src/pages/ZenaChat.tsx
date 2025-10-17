import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useZenaZenoBrain } from "@/hooks/useZenaZenoBrain";
import { useAuth } from "@/hooks/useAuth";
import VoiceControl from "@/components/VoiceControl";
import ZenaAvatar from "@/components/ZenaAvatar";
import { Button } from "@/components/ui/button";
import { Globe, LogOut } from "lucide-react";
import { SupportResources } from "@/components/SupportResources";
import { EmotionalWeather } from "@/components/EmotionalWeather";
import { EmotionalFeedback } from "@/components/EmotionalFeedback";
import { ConversationMemory } from "@/components/ConversationMemory";
import { SupportResourcesModal } from "@/components/SupportResourcesModal";
import MagicAmbiance from "@/components/MagicAmbiance";

export default function ZenaChat() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<"fr-FR" | "en-US">("fr-FR");
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [conversationKeyPoints, setConversationKeyPoints] = useState<string[]>([]);

  // Détection du support vocal
  const isMobileSafari = typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;
  
  const sttSupported = typeof window !== 'undefined' && 
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const {
    isListening,
    listen,
    stopListening,
    speaking,
    thinking,
    messages,
    emotionalState,
    recommendedBox,
    supportResources,
    onUserSpeak,
    transcript,
  } = useZenaZenoBrain({
    persona: "zena",
    language: selectedLanguage,
  });

  // Détection automatique du besoin d'aide (score critique)
  useEffect(() => {
    if (emotionalState.score <= 5 && supportResources.length > 0 && !showSupportModal) {
      // Délai pour ne pas être trop intrusif
      const timer = setTimeout(() => {
        setShowSupportModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emotionalState.score, supportResources.length]);

  // Extraire les points clés des messages pour la mémoire
  useEffect(() => {
    if (messages.length >= 2) {
      const recentUserMessages = messages
        .filter(m => m.from === "user")
        .slice(-3)
        .map(m => m.text);
      
      setConversationKeyPoints(recentUserMessages);
    }
  }, [messages]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      listen();
    }
  };

  const moodEmoji =
    emotionalState.mood === "positive"
      ? "😊"
      : emotionalState.mood === "negative"
      ? "😔"
      : "😐";

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans relative overflow-hidden">
      {/* ==== Ambiance magique ==== */}
      <MagicAmbiance intensity="heavy" />
      
      {/* ==== Halo et ambiance ==== */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* ==== Sélecteur de langue et auth (en haut à droite) ==== */}
      <motion.div 
        className="absolute top-4 right-4 flex gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant={selectedLanguage === "fr-FR" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLanguage("fr-FR")}
          className="flex items-center gap-1 text-xs"
        >
          <Globe size={14} />
          FR
        </Button>
        <Button
          variant={selectedLanguage === "en-US" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLanguage("en-US")}
          className="flex items-center gap-1 text-xs"
        >
          <Globe size={14} />
          EN
        </Button>
        
        {!loading && (
          user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-1 text-xs"
            >
              <LogOut size={14} />
              {selectedLanguage === "fr-FR" ? "Déconnexion" : "Logout"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1 text-xs"
            >
              {selectedLanguage === "fr-FR" ? "Connexion / Inscription" : "Login / Sign Up"}
            </Button>
          )
        )}
      </motion.div>

      {/* ==== HEADER ZÉNA ==== */}
      <header className="flex flex-col items-center text-center mt-16 md:mt-20 mb-8 px-4">
        <ZenaAvatar isSpeaking={speaking} emotion={emotionalState.mood} />
        <motion.h1
          className="text-3xl md:text-4xl font-bold mt-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedLanguage === "fr-FR" ? "ZÉNA – Ça va aujourd'hui?" : "ZÉNA – How are you today?"}
        </motion.h1>
        <p className="text-sm text-[#212121]/70 mt-2">
          {selectedLanguage === "fr-FR" 
            ? "La voix qui veille sur vos émotions et agit pour votre bien-être 💜"
            : "The voice that watches over your emotions and acts for your well-being 💜"}
        </p>

        {/* Lien retour */}
        <Link
          to="/"
          className="mt-4 text-xs text-[#005B5F] hover:underline opacity-80 hover:opacity-100 transition"
        >
          {selectedLanguage === "fr-FR" ? "← Retour à l'accueil" : "← Back to home"}
        </Link>
      </header>

      {/* ==== ZONE DE CHAT ==== */}
      <motion.div
        className="w-full max-w-md bg-white/70 rounded-3xl shadow-xl p-5 mb-6 overflow-y-auto max-h-[55vh] border border-[#78A085]/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 italic text-sm">
            {selectedLanguage === "fr-FR" 
              ? 'Commencez à parler avec ZÉNA, ou dites simplement : "Salut Zéna, ça va ?"'
              : 'Start talking to ZÉNA, or just say: "Hi Zéna, how are you?"'}
          </div>
        )}

        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`mb-3 flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`px-4 py-2 rounded-2xl text-sm leading-relaxed max-w-[80%] shadow-sm ${
                m.from === "user"
                  ? "bg-[#A4D4AE] text-[#212121]"
                  : "bg-[#005B5F] text-white"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <p className="text-xs text-center text-gray-400 italic animate-pulse">
            {selectedLanguage === "fr-FR" ? "ZÉNA réfléchit..." : "ZÉNA is thinking..."}
          </p>
        )}
      </motion.div>

      {/* ==== CONTRÔLE VOCAL ==== */}
      <motion.div
        className="w-full max-w-md flex flex-col items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {!sttSupported ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-amber-800 font-medium mb-2">
              {selectedLanguage === "fr-FR" 
                ? "⚠️ Reconnaissance vocale non disponible"
                : "⚠️ Voice recognition not available"}
            </p>
            <p className="text-xs text-amber-700">
              {selectedLanguage === "fr-FR" 
                ? "Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge sur ordinateur ou Android."
                : "Your browser doesn't support voice recognition. Use Chrome or Edge on desktop or Android."}
            </p>
            {isMobileSafari && (
              <p className="text-xs text-amber-700 mt-2">
                {selectedLanguage === "fr-FR"
                  ? "Safari iOS ne supporte pas encore cette fonctionnalité. 📱"
                  : "Safari iOS doesn't support this feature yet. 📱"}
              </p>
            )}
          </div>
        ) : (
          <>
            <VoiceControl
              onToggleListening={handleToggleListening}
              isListening={isListening}
              transcript={transcript}
              isSpeaking={speaking}
              gender="female"
            />
            <p className="text-xs text-gray-500 italic">
              {isListening
                ? selectedLanguage === "fr-FR" 
                  ? " ZÉNA vous écoute..." 
                  : " ZÉNA is listening..."
                : selectedLanguage === "fr-FR"
                  ? "Appuyez sur le micro pour parler à ZÉNA"
                  : "Press the mic to talk to ZÉNA"}
            </p>
          </>
        )}
      </motion.div>

      {/* ==== MÉTÉO ÉMOTIONNELLE ==== */}
      <div className="mt-8 w-full max-w-md">
        <EmotionalWeather 
          score={emotionalState.score}
          mood={emotionalState.mood}
          language={selectedLanguage}
          scoreHistory={[9, 8, 10, 7, 8, 9, emotionalState.score]}
        />
      </div>

      {/* ==== FEEDBACK EMPATHIQUE ==== */}
      {messages.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <EmotionalFeedback 
            score={emotionalState.score}
            language={selectedLanguage}
          />
        </div>
      )}

      {/* ==== MÉMOIRE CONVERSATIONNELLE ==== */}
      {conversationKeyPoints.length > 0 && (
        <div className="mt-4">
          <ConversationMemory 
            keyPoints={conversationKeyPoints}
            language={selectedLanguage}
          />
        </div>
      )}

      {/* ==== RESSOURCES D'AIDE ==== */}
      {supportResources.length > 0 && (
        <SupportResources resources={supportResources} language={selectedLanguage} />
      )}

      {/* ==== MODAL D'ORIENTATION ==== */}
      <SupportResourcesModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        resources={supportResources}
        language={selectedLanguage}
      />

      {/* ==== BOX RECOMMANDÉE ==== */}
      {recommendedBox && (
        <motion.div
          className="mt-8 bg-white rounded-3xl shadow-lg p-6 border border-[#4FD1C5]/40 text-center w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-[#005B5F] mb-2">
            💝 {recommendedBox.name}
          </h2>
          <p className="text-sm text-[#78A085] font-medium mb-1">
            {recommendedBox.theme}
          </p>
          <p className="text-sm text-gray-600">{recommendedBox.description}</p>
        </motion.div>
      )}

    </div>
  );
}
