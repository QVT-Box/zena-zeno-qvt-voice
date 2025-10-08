interface LipSyncOverlayProps {
  isSpeaking: boolean;
  audioLevel: number;
}

const LipSyncOverlay = ({ isSpeaking, audioLevel }: LipSyncOverlayProps) => {
  if (!isSpeaking) return null;

  // Dynamique d'ouverture améliorée : transformation plus expressive
  const pulseScale = 1 + Math.min(audioLevel * 1.5, 0.6);
  const opacity = 0.4 + Math.min(audioLevel * 2, 0.8);
  const glowIntensity = 10 + audioLevel * 25;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {/* Halo émotionnel principal - Plus expressif */}
      <div
        className="w-48 h-48 rounded-full blur-3xl bg-gradient-to-br from-[#5B4B8A]/50 to-[#4FD1C5]/50"
        style={{
          transform: `scale(${pulseScale})`,
          opacity,
          transition: 'transform 0.12s ease-out, opacity 0.12s ease-out',
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(91,75,138,0.6))`,
        }}
      />

      {/* Onde vocale dynamique */}
      <div
        className="absolute rounded-full w-32 h-32 bg-gradient-to-br from-[#4FD1C5]/40 to-[#5B4B8A]/40 blur-2xl"
        style={{
          transform: `scale(${pulseScale * 1.5})`,
          opacity: opacity * 0.7,
          filter: `drop-shadow(0 0 ${glowIntensity * 1.5}px rgba(79,209,197,0.6))`,
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Particules d'énergie vocale */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#4FD1C5]/80"
          style={{
            top: `${45 + Math.sin(i * Math.PI / 3) * 20}%`,
            left: `${45 + Math.cos(i * Math.PI / 3) * 20}%`,
            transform: `scale(${1 + audioLevel * 3})`,
            opacity: opacity * 0.8,
            transition: 'all 0.15s ease-out',
          }}
        />
      ))}

      {/* "Mouth" central plus expressif */}
      <div
        className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-12 h-[3px] rounded-full"
        style={{
          background: `linear-gradient(90deg, rgba(91,75,138,0.9), rgba(79,209,197,0.9))`,
          transform: `translateX(-50%) scaleY(${1 + audioLevel * 3.5})`,
          opacity: opacity * 1.2,
          transition: 'transform 0.08s ease-out, opacity 0.1s ease',
          boxShadow: `0 0 ${glowIntensity * 0.8}px rgba(79,209,197,0.8)`,
        }}
      />
    </div>
  );
};

export default LipSyncOverlay;
