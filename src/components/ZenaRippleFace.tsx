// src/components/ZenaRippleFace.tsx
import React, { useState, MouseEvent } from "react";

type ZenaRippleFaceProps = {
  /** Image de Zéna (version points lumineux dorés) */
  imageUrl?: string;
  /** Taille du visage en pixels */
  size?: number;
  /** URL à ouvrir au clic */
  targetUrl?: string;
};

export default function ZenaRippleFace({
  imageUrl = "/zena-face-points-golden.png", // mets ici le bon chemin de ton image
  size = 420,
  targetUrl = "https://zena.qvtbox.com",
}: ZenaRippleFaceProps) {
  const [isHover, setIsHover] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleClick = () => {
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Halo extérieur très doux */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: size * 1.4,
          height: size * 1.4,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(227,205,157,0.35) 40%, rgba(210,185,140,0.1) 65%, transparent 80%)",
          opacity: isHover ? 1 : 0.7,
          transition: "opacity 260ms ease-out",
        }}
      />

      {/* Conteneur cliquable */}
      <div
        className="relative rounded-full overflow-hidden cursor-pointer shadow-xl"
        style={{
          width: size,
          height: size,
          transform: isHover ? "scale(1.04)" : "scale(1)",
          boxShadow: isHover
            ? "0 30px 80px rgba(0,0,0,0.35)"
            : "0 22px 60px rgba(0,0,0,0.25)",
          transition: "transform 220ms ease-out, box-shadow 220ms ease-out",
          background:
            "radial-gradient(circle at 15% 0%, #FFF8EA 0%, #F4E0B8 40%, #E0C08F 80%)",
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* Image de Zéna */}
        <img
          src={imageUrl}
          alt="ZÉNA – visage lumineux"
          className="w-full h-full object-cover select-none pointer-events-none"
          style={{
            mixBlendMode: "soft-light",
            filter: "saturate(1.05) contrast(1.02)",
          }}
        />

        {/* Film de “verre d’eau” / reflets subtils */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.35) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 55%)",
            mixBlendMode: "screen",
            opacity: 0.9,
          }}
        />

        {/* Effet ripple qui suit la souris */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            transform: "translate(-50%, -50%)",
            width: isHover ? size * 0.7 : size * 0.4,
            height: isHover ? size * 0.7 : size * 0.4,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 40%, transparent 70%)",
            opacity: isHover ? 0.7 : 0,
            filter: "blur(6px)",
            transition:
              "width 220ms ease-out, height 220ms ease-out, opacity 220ms ease-out",
            mixBlendMode: "screen",
          }}
        />

        {/* Cercles d’ondes très fins (légère sensation eau) */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute rounded-full border border-white/40"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: "translate(-50%, -50%)",
              width: isHover ? size * 0.9 : size * 0.6,
              height: isHover ? size * 0.9 : size * 0.6,
              opacity: isHover ? 0.35 : 0,
              transition: "all 260ms ease-out",
              mixBlendMode: "soft-light",
            }}
          />
          <div
            className="absolute rounded-full border border-white/25"
            style={{
              left: `${mousePos.x}%`,
              top: `${mousePos.y}%`,
              transform: "translate(-50%, -50%)",
              width: isHover ? size * 1.1 : size * 0.8,
              height: isHover ? size * 1.1 : size * 0.8,
              opacity: isHover ? 0.25 : 0,
              transition: "all 260ms ease-out",
              mixBlendMode: "soft-light",
            }}
          />
        </div>

        {/* Légère texture bruit pour un rendu “cinéma” */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.18) 1px, transparent 0)",
            backgroundSize: "3px 3px",
            opacity: 0.11,
            mixBlendMode: "soft-light",
          }}
        />
      </div>
    </div>
  );
}
