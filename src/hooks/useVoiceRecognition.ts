import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  VoiceRecognitionFactory, 
  IVoiceRecognitionService,
  VoiceRecognitionMode 
} from '@/services/VoiceRecognitionService';
import { useToast } from '@/hooks/use-toast';

interface UseVoiceRecognitionOptions {
  lang?: string;
  mode?: VoiceRecognitionMode;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
}

/**
 * Hook React pour gérer la reconnaissance vocale
 * Compatible mobile/desktop et prêt pour le cloud
 */
export function useVoiceRecognition({
  lang = 'fr-FR',
  mode,
  continuous = false,
  interimResults = true,
  onResult,
}: UseVoiceRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const serviceRef = useRef<IVoiceRecognitionService | null>(null);
  const { toast } = useToast();

  // Déterminer le meilleur mode disponible
  const effectiveMode = mode || VoiceRecognitionFactory.getBestAvailableMode();

  // Initialiser le service
  useEffect(() => {
    serviceRef.current = VoiceRecognitionFactory.create(effectiveMode, {
      lang,
      continuous,
      interimResults,
      onResult: (text, isFinal) => {
        setTranscript(text);
        onResult?.(text, isFinal);
        if (isFinal) {
          setTranscript('');
        }
      },
      onError: (errorMsg) => {
        setError(errorMsg);
        setIsListening(false);
        toast({
          title: "Erreur microphone",
          description: errorMsg,
          variant: "destructive",
        });
      },
      onStart: () => {
        setIsListening(true);
        setError(null);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    return () => {
      serviceRef.current?.stop();
    };
  }, [lang, effectiveMode, continuous, interimResults, onResult, toast]);

  const start = useCallback(async () => {
    console.log("🎤 [useVoiceRecognition] Tentative de démarrage...");
    console.log("🎤 Mode effectif:", effectiveMode);
    
    if (!serviceRef.current) {
      console.error("❌ Service de reconnaissance non disponible");
      setError("Service de reconnaissance non disponible");
      toast({
        title: "Erreur",
        description: "Service de reconnaissance non disponible",
        variant: "destructive",
      });
      return;
    }

    console.log("🎤 Service créé:", serviceRef.current);
    console.log("🎤 Service supporté?", serviceRef.current.isSupported());

    if (!serviceRef.current.isSupported()) {
      const errorMsg = effectiveMode === 'browser'
        ? "Reconnaissance vocale non supportée sur ce navigateur. Essayez Chrome ou activez le mode cloud."
        : "Mode cloud non encore disponible";
      
      console.error("❌ Service non supporté:", errorMsg);
      setError(errorMsg);
      toast({
        title: "Non supporté",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🎤 Appel de service.start()...");
      await serviceRef.current.start();
      console.log("✅ Service démarré avec succès");
    } catch (err: any) {
      console.error("❌ Erreur lors du démarrage:", err);
      setError(err.message);
      toast({
        title: "Erreur de démarrage",
        description: err.message,
        variant: "destructive",
      });
    }
  }, [effectiveMode, toast]);

  const stop = useCallback(() => {
    serviceRef.current?.stop();
  }, []);

  return {
    isListening,
    transcript,
    error,
    start,
    stop,
    mode: effectiveMode,
  };
}
