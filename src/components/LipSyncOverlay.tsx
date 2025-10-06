interface LipSyncOverlayProps {
  isSpeaking: boolean;
  audioLevel: number;
}

const LipSyncOverlay = ({ isSpeaking, audioLevel }: LipSyncOverlayProps) => {
  if (!isSpeaking) return null;

  // Dynamique d’ouverture : transformation douce du halo selon volume audio
  const pulseScale = 1 + Math.min(audioLevel * 1.2, 0.4);
  const opacity = 0.3 + Math.min(audioLevel * 1.5, 0.7);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Halo émotionnel */}
      <div
        className="w-40 h-40 rounded-full blur-3xl bg-gradient-to-br from-[#5B4B8A]/40 to-[#4FD1C5]/40 animate-breathe-slow"
        style={{
          transform: `scale(${pulseScale})`,
          opacity,
          transition: 'transform 0.15s ease, opacity 0.15s ease',
        }}
      />

      {/* Onde vocale subtile */}
      <div
        className="absolute rounded-full w-24 h-24 bg-gradient-to-br from-[#4FD1C5]/30 to-[#5B4B8A]/30 blur-xl"
        style={{
          transform: `scale(${pulseScale * 1.4})`,
          opacity: opacity * 0.6,
          filter: `drop-shadow(0 0 ${10 + audioLevel * 15}px rgba(91,75,138,0.5))`,
        }}
      />

      {/* “Mouth” central minimaliste */}
      <div
        className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-10 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, rgba(91,75,138,0.8), rgba(79,209,197,0.8))`,
          transform: `scaleY(${1 + audioLevel * 2.5})`,
          opacity,
          transition: 'transform 0.1s ease-out, opacity 0.15s ease',
        }}
      />
    </div>
  );
};

export default LipSyncOverlay;
