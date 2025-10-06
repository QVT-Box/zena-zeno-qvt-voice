import { useEffect, useState } from 'react';
import zenaAvatar from '@/assets/zena-avatar.jpg';
import zenoAvatar from '@/assets/zeno-avatar.jpg';
import LipSyncOverlay from './LipSyncOverlay';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';

interface AvatarDisplayProps {
  isSpeaking: boolean;
  currentEmotion?: string;
  gender: 'female' | 'male';
}

const AvatarDisplay = ({ isSpeaking, currentEmotion, gender }: AvatarDisplayProps) => {
  const [fireflies, setFireflies] = useState<Array<{ id: number; delay: number; duration: number }>>([]);
  const audioLevel = useAudioAnalyzer(isSpeaking);
  
  const avatarImage = gender === 'female' ? zenaAvatar : zenoAvatar;
  const avatarName = gender === 'female' ? 'ZENA' : 'ZENO';
  const primaryColor = gender === 'female' ? 'primary' : 'secondary';

  useEffect(() => {
    // Generate firefly particles
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setFireflies(particles);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 gradient-ambient rounded-full blur-3xl opacity-50" />
      
      {/* Firefly particles */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className={`absolute w-2 h-2 bg-${primaryColor} rounded-full opacity-0 animate-firefly`}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
          }}
        />
      ))}
      
      {/* Avatar container with glow effect */}
      <div className={`relative ${isSpeaking ? 'animate-pulse-glow' : 'shadow-glow'} rounded-full transition-smooth`}>
        {/* Outer ring - emotion indicator */}
        <div className={`absolute inset-0 rounded-full border-4 ${
          currentEmotion === 'positive' ? 'border-secondary' : 
          currentEmotion === 'negative' ? 'border-destructive' : 
          `border-${primaryColor}`
        } opacity-50 animate-breathe`} />
        
        {/* Avatar image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${
            gender === 'female' ? 'from-primary/20 to-secondary/20' : 'from-secondary/20 to-primary/20'
          }`} />
          <img
            src={avatarImage}
            alt={`${avatarName} - Coach QVT`}
            className="relative z-10 w-full h-full object-cover rounded-full animate-breathe"
          />
          
          {/* Lip sync overlay */}
          <LipSyncOverlay isSpeaking={isSpeaking} audioLevel={audioLevel} />
          
          {/* Speaking indicator */}
          {isSpeaking && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-6 bg-secondary rounded-full"
                    style={{
                      animation: `pulse 1s ease-in-out infinite`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Inner glow ring */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br blur-xl ${
          gender === 'female' ? 'from-primary-glow/30 to-secondary/30' : 'from-secondary/30 to-primary-glow/30'
        }`} />
      </div>
    </div>
  );
};

export default AvatarDisplay;
