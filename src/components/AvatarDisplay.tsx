import { useEffect, useState } from 'react';
import zenaAvatar from '@/assets/zena-avatar.png';
import zenoAvatar from '@/assets/zeno-avatar.png';
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
  const primaryColor = gender === 'female' ? '#5B4B8A' : '#4FD1C5';
  const secondaryColor = gender === 'female' ? '#4FD1C5' : '#5B4B8A';

  useEffect(() => {
    const particles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
    }));
    setFireflies(particles);
  }, []);

  // Définir une aura lumineuse selon l'émotion
  const auraColor =
    currentEmotion === 'positive'
      ? 'from-emerald-300/40 to-teal-400/30'
      : currentEmotion === 'negative'
      ? 'from-rose-400/40 to-red-500/30'
      : 'from-[#5B4B8A]/30 to-[#4FD1C5]/30';

  return (
    <div className="relative flex items-center justify-center w-full h-auto py-8 select-none">
      {/* Halo respirant d’ambiance */}
      <div
        className={`absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full blur-3xl opacity-60 bg-gradient-to-br ${auraColor} animate-breathe-slow`}
      />

      {/* Lucioles */}
      {fireflies.map((firefly) => (
        <div
          key={firefly.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-0 animate-firefly"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${firefly.delay}s`,
            animationDuration: `${firefly.duration}s`,
            boxShadow: `0 0 12px ${secondaryColor}`,
          }}
        />
      ))}

      {/* Container principal */}
      <div
        className={`relative rounded-full overflow-hidden shadow-[0_0_60px_${primaryColor}] transition-all duration-500 ${
          isSpeaking ? 'scale-[1.03]' : 'scale-100'
        }`}
      >
        {/* Cercle émotionnel */}
        <div
          className={`absolute inset-0 rounded-full border-[6px] blur-[1px] transition-colors duration-700 ${
            currentEmotion === 'positive'
              ? 'border-emerald-400'
              : currentEmotion === 'negative'
              ? 'border-rose-500'
              : 'border-[#4FD1C5]'
          } animate-breathe`}
        />

        {/* Avatar principal */}
        <img
          src={avatarImage}
          alt={`${avatarName} - Coach IA QVT Box`}
          className={`relative z-10 rounded-full object-cover w-[260px] h-[260px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] transition-all duration-500 ${
            isSpeaking ? 'brightness-110' : 'brightness-100'
          }`}
        />

        {/* Superposition de synchronisation labiale */}
        <LipSyncOverlay isSpeaking={isSpeaking} audioLevel={audioLevel} />

        {/* Indicateur de parole (bâtonnets dynamiques) */}
        {isSpeaking && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-[3px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-5 rounded-full bg-gradient-to-t from-[#4FD1C5] to-[#5B4B8A]"
                style={{
                  animation: `pulse 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Étiquette ZENA/ZENO */}
      <div className="absolute bottom-[-4rem] text-center">
        <p className="text-xl font-semibold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5]">
          {avatarName}
        </p>
        <p className="text-sm text-[#5B4B8A]/70">La voix qui veille sur vos émotions</p>
      </div>
    </div>
  );
};

export default AvatarDisplay;
