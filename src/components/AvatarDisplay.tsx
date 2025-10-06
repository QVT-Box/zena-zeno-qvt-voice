import { useEffect, useState } from 'react';
import avatarImage from '@/assets/zena-avatar.jpg';

interface AvatarDisplayProps {
  isSpeaking: boolean;
  currentEmotion?: string;
}

const AvatarDisplay = ({ isSpeaking, currentEmotion }: AvatarDisplayProps) => {
  const [fireflies, setFireflies] = useState<Array<{ id: number; delay: number; duration: number }>>([]);

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
          className="absolute w-2 h-2 bg-secondary rounded-full opacity-0 animate-firefly"
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
          'border-primary'
        } opacity-50 animate-breathe`} />
        
        {/* Avatar image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20" />
          <img
            src={avatarImage}
            alt="ZENA - Coach QVT"
            className="relative z-10 w-full h-full object-cover rounded-full animate-breathe"
          />
          
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
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-glow/30 to-secondary/30 blur-xl" />
      </div>
    </div>
  );
};

export default AvatarDisplay;
