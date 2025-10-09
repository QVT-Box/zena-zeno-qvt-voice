/**
 * 🎤 Service de reconnaissance vocale modulaire
 * Compatible mobile/desktop et prêt pour l'intégration cloud
 */

export type VoiceRecognitionMode = 'browser' | 'cloud';

export interface VoiceRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface IVoiceRecognitionService {
  isSupported(): boolean;
  start(): Promise<void>;
  stop(): void;
  isListening(): boolean;
}

/**
 * Service de reconnaissance basé sur Web Speech API (navigateur)
 */
export class BrowserVoiceRecognition implements IVoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private listening = false;
  private options: VoiceRecognitionOptions;

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("⚠️ Web Speech API non supportée");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.options.lang || 'fr-FR';
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || true;
    // @ts-ignore - maxAlternatives existe mais n'est pas dans les types TS
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      if (transcript.trim()) {
        this.options.onResult?.(transcript.trim(), isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("❌ Erreur reconnaissance:", event.error);
      
      const errorMessages: { [key: string]: string } = {
        "not-allowed": "Permission du microphone refusée",
        "no-speech": "Aucune parole détectée",
        "audio-capture": "Microphone non disponible",
        "network": "Erreur réseau",
        "aborted": "Reconnaissance interrompue"
      };

      this.options.onError?.(errorMessages[event.error] || event.error);
      this.listening = false;
    };

    this.recognition.onend = () => {
      console.log("🔴 Reconnaissance arrêtée");
      this.listening = false;
      this.options.onEnd?.();
    };

    // @ts-ignore - onstart existe mais n'est pas dans les types TS standard
    this.recognition.onstart = () => {
      console.log("🟢 Reconnaissance démarrée");
      this.listening = true;
      this.options.onStart?.();
    };
  }

  isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  async start(): Promise<void> {
    if (!this.recognition) {
      throw new Error("Reconnaissance vocale non disponible");
    }

    if (this.listening) {
      console.warn("⚠️ Déjà en écoute");
      return;
    }

    try {
      // Sur mobile/desktop, laisser Web Speech API gérer le micro
      // Ne PAS utiliser getUserMedia manuellement car ça crée des conflits/échos
      console.log("🎤 Démarrage reconnaissance vocale...");
      this.recognition.start();
      
    } catch (err: any) {
      console.error("❌ Erreur démarrage:", err);
      
      let errorMessage = "Impossible de démarrer la reconnaissance vocale";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permission du microphone refusée. Vérifiez les paramètres de votre navigateur.";
      } else if (err.name === "NotSupportedError") {
        errorMessage = "Reconnaissance vocale non supportée sur ce navigateur. Essayez Chrome.";
      } else if (err.message?.includes("already started")) {
        errorMessage = "Reconnaissance déjà en cours";
      }
      
      throw new Error(errorMessage);
    }
  }

  stop(): void {
    if (this.recognition && this.listening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn("Erreur lors de l'arrêt:", err);
      }
    }
    this.listening = false;
  }

  isListening(): boolean {
    return this.listening;
  }
}

/**
 * Service de reconnaissance basé sur le cloud (OpenAI Realtime API)
 * À implémenter plus tard
 */
export class CloudVoiceRecognition implements IVoiceRecognitionService {
  private options: VoiceRecognitionOptions;
  private listening = false;

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
  }

  isSupported(): boolean {
    // TODO: vérifier si l'API cloud est disponible
    return false;
  }

  async start(): Promise<void> {
    // TODO: implémenter avec OpenAI Realtime API
    throw new Error("Cloud voice recognition pas encore implémenté");
  }

  stop(): void {
    // TODO: implémenter
    this.listening = false;
  }

  isListening(): boolean {
    return this.listening;
  }
}

/**
 * Factory pour créer le bon service selon la disponibilité
 */
export class VoiceRecognitionFactory {
  static create(
    mode: VoiceRecognitionMode,
    options: VoiceRecognitionOptions
  ): IVoiceRecognitionService {
    if (mode === 'cloud') {
      return new CloudVoiceRecognition(options);
    }
    return new BrowserVoiceRecognition(options);
  }

  static getBestAvailableMode(): VoiceRecognitionMode {
    const browserRecognition = new BrowserVoiceRecognition({});
    if (browserRecognition.isSupported()) {
      return 'browser';
    }
    return 'cloud'; // Fallback vers le cloud si le navigateur ne supporte pas
  }
}
