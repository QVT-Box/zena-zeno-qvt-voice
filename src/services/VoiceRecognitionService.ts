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
      console.log("🎯 Résultat de reconnaissance reçu:", event);
      let transcript = "";
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          isFinal = true;
        }
      }

      console.log("📝 Transcript:", transcript, "isFinal:", isFinal);

      if (transcript.trim()) {
        console.log("✅ Appel onResult avec:", transcript.trim());
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
      console.error("❌ Reconnaissance vocale non disponible - recognition is null");
      throw new Error("Reconnaissance vocale non disponible");
    }

    if (this.listening) {
      console.warn("⚠️ Déjà en écoute");
      return;
    }

    try {
      // Demander d'abord la permission du microphone explicitement
      console.log("🎤 Demande de permission microphone...");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Permission microphone accordée");
      
      // Démarrer la reconnaissance vocale
      console.log("🎤 Démarrage reconnaissance vocale...");
      this.recognition.start();
      console.log("✅ Reconnaissance vocale démarrée");
      
    } catch (err: any) {
      console.error("❌ Erreur démarrage reconnaissance:", err);
      console.error("❌ Type d'erreur:", err.name);
      console.error("❌ Message:", err.message);
      
      let errorMessage = "Impossible de démarrer la reconnaissance vocale";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Permission du microphone refusée. Vérifiez les paramètres de votre navigateur.";
      } else if (err.name === "NotSupportedError") {
        errorMessage = "Reconnaissance vocale non supportée sur ce navigateur. Essayez Chrome.";
      } else if (err.message?.includes("already started")) {
        errorMessage = "Reconnaissance déjà en cours";
        return; // Ne pas lancer d'erreur si déjà démarrée
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
 * Service de reconnaissance basé sur le cloud (OpenAI Whisper via Edge Function)
 * Compatible avec tous les navigateurs, y compris iOS
 */
export class CloudVoiceRecognition implements IVoiceRecognitionService {
  private options: VoiceRecognitionOptions;
  private listening = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  constructor(options: VoiceRecognitionOptions) {
    this.options = options;
  }

  isSupported(): boolean {
    // Vérification complète pour iOS et autres navigateurs
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    const hasGetUserMedia = typeof navigator !== 'undefined' && 
                           typeof navigator.mediaDevices !== 'undefined' && 
                           typeof navigator.mediaDevices.getUserMedia === 'function';
    
    console.log("🔍 [Cloud] Support check:", { hasMediaRecorder, hasGetUserMedia });
    return hasMediaRecorder && hasGetUserMedia;
  }

  async start(): Promise<void> {
    if (this.listening) {
      console.warn("⚠️ Déjà en écoute");
      return;
    }

    try {
      console.log("🎤 [Cloud] Demande de permission microphone...");
      
      // Demander la permission du microphone
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      
      console.log("✅ [Cloud] Permission accordée");

      // Détecter le format audio supporté (iOS utilise mp4, Chrome utilise webm)
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      }

      console.log("🎵 [Cloud] Format audio détecté:", mimeType);

      // Initialiser MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType,
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("📦 [Cloud] Chunk audio reçu:", event.data.size, "bytes");
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        console.log("🔴 [Cloud] Enregistrement arrêté, traitement...");
        
        if (this.audioChunks.length === 0) {
          console.warn("⚠️ [Cloud] Aucun audio capturé");
          this.options.onError?.("Aucun audio capturé");
          return;
        }

        try {
          // Créer un blob avec tous les chunks
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          console.log("📤 [Cloud] Taille totale audio:", audioBlob.size, "bytes");

          // Convertir en base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            console.log("🔄 [Cloud] Audio encodé en base64");

            try {
              // Envoyer à l'edge function
              const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
              const response = await fetch(`${supabaseUrl}/functions/v1/speech-to-text`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                },
                body: JSON.stringify({ 
                  audio: base64Audio,
                  mimeType: mimeType 
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la transcription');
              }

              const data = await response.json();
              console.log("✅ [Cloud] Transcription reçue:", data.text);

              if (data.text && data.text.trim()) {
                this.options.onResult?.(data.text.trim(), true);
              } else {
                console.warn("⚠️ [Cloud] Transcription vide");
                this.options.onError?.("Aucune parole détectée");
              }

            } catch (error) {
              console.error("❌ [Cloud] Erreur transcription:", error);
              this.options.onError?.(error instanceof Error ? error.message : "Erreur de transcription");
            }
          };

          reader.onerror = () => {
            console.error("❌ [Cloud] Erreur lecture audio");
            this.options.onError?.("Erreur lors de la lecture de l'audio");
          };

          reader.readAsDataURL(audioBlob);

        } catch (error) {
          console.error("❌ [Cloud] Erreur traitement audio:", error);
          this.options.onError?.(error instanceof Error ? error.message : "Erreur de traitement audio");
        } finally {
          this.audioChunks = [];
          this.options.onEnd?.();
        }
      };

      this.mediaRecorder.onerror = (event: Event) => {
        console.error("❌ [Cloud] Erreur MediaRecorder:", event);
        this.options.onError?.("Erreur lors de l'enregistrement");
        this.listening = false;
      };

      // Démarrer l'enregistrement
      this.mediaRecorder.start();
      this.listening = true;
      console.log("🟢 [Cloud] Enregistrement démarré");
      this.options.onStart?.();

    } catch (error) {
      console.error("❌ [Cloud] Erreur démarrage:", error);
      
      let errorMessage = "Impossible de démarrer l'enregistrement";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          errorMessage = "Permission du microphone refusée";
        } else if (error.name === "NotFoundError") {
          errorMessage = "Microphone non trouvé";
        } else {
          errorMessage = error.message;
        }
      }
      
      this.options.onError?.(errorMessage);
      throw new Error(errorMessage);
    }
  }

  stop(): void {
    console.log("🛑 [Cloud] Arrêt demandé");
    
    if (this.mediaRecorder && this.listening) {
      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        }
      } catch (err) {
        console.warn("⚠️ [Cloud] Erreur lors de l'arrêt:", err);
      }
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
        console.log("🔇 [Cloud] Track audio arrêté");
      });
      this.stream = null;
    }

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
    // Détection iOS améliorée
    const isIOS = (() => {
      const ua = navigator.userAgent;
      const isAppleDevice = /iPad|iPhone|iPod/.test(ua);
      const isSafariMobile = /Safari/.test(ua) && /Mobile/.test(ua);
      const isIOSChrome = /CriOS/.test(ua);
      const isTouchDevice = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      
      return isAppleDevice || isSafariMobile || isIOSChrome || isTouchDevice;
    })();
    
    console.log("🔍 Détection plateforme:", { 
      isIOS, 
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints 
    });

    // Sur iOS, vérifier si cloud est supporté
    if (isIOS) {
      const cloudService = new CloudVoiceRecognition({});
      if (cloudService.isSupported()) {
        console.log("📱 iOS détecté → mode cloud (supporté)");
        return 'cloud';
      } else {
        console.warn("⚠️ iOS détecté mais cloud non supporté, tentative browser");
      }
    }

    // Sur autres plateformes, préférer le navigateur si disponible
    const browserRecognition = new BrowserVoiceRecognition({});
    if (browserRecognition.isSupported()) {
      console.log("🌐 Web Speech API disponible → mode browser");
      return 'browser';
    }

    // Fallback vers le cloud
    console.log("☁️ Fallback → mode cloud");
    return 'cloud';
  }
}
