interface LipSyncOverlayProps {
  isSpeaking: boolean;
  audioLevel: number;
}

const LipSyncOverlay = ({ isSpeaking, audioLevel }: LipSyncOverlayProps) => {
  if (!isSpeaking) return null;

  // Calculate mouth opening based on audio level
  const mouthOpenness = Math.max(audioLevel * 20, 2); // Min 2px, max 20px

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Mouth area overlay */}
      <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2">
        {/* Animated mouth */}
        <div
          className="relative w-12 h-8 flex items-center justify-center"
          style={{
            animation: 'mouth-speak 0.2s ease-in-out infinite',
          }}
        >
          {/* Upper lip */}
          <div
            className="absolute top-0 w-10 h-1 bg-foreground/20 rounded-full transition-all duration-75"
            style={{
              transform: `translateY(-${mouthOpenness / 4}px)`,
            }}
          />
          {/* Lower lip */}
          <div
            className="absolute bottom-0 w-10 h-1 bg-foreground/20 rounded-full transition-all duration-75"
            style={{
              transform: `translateY(${mouthOpenness / 4}px)`,
            }}
          />
          {/* Mouth opening */}
          <div
            className="absolute w-8 bg-foreground/10 rounded-full transition-all duration-75"
            style={{
              height: `${mouthOpenness}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LipSyncOverlay;
