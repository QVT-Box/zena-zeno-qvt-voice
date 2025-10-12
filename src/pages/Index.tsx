import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-hidden relative">
      {/* ==== HALOS D’AMBIANCE ==== */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* ==== HERO ZÉNA ==== */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-24">
        {/* Avatar animé */}
        <ZenaAvatar isSpeaking={false} emotion="neutral" />

        {/* Titre principal */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ZÉNA – L’IA émotionnelle de QVT Box
        </motion.h1>

        {/* Sous-texte inspirant */}
        <motion.p
          className="mt-4 text-lg max-w-2xl leading-relaxed text-[#212121]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Une voix bienveillante, un regard attentif, et une bulle d’écoute
          pour mieux comprendre le bien-être au travail et en famille.
        </motion.p>
      </header>

      {/* ==== CTA ==== */}
      <motion.div
        className="flex flex-col items-center justify-center mt-10 mb-16 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Link
          to="/zena-chat"
          className="px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg
                     bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all"
        >
          🎙️ Essayer ZÉNA en direct
        </Link>

        <Link
          to="/auth"
          className="px-6 py-3 rounded-full font-medium text-base shadow-md
                     bg-white text-[#005B5F] border-2 border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-all"
        >
          Se connecter / S'inscrire
        </Link>

        <p className="text-sm text-[#212121]/60 max-w-sm text-center">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>
      </motion.div>

      {/* ==== SECTION KENGO - SOUTENIR QVT BOX ==== */}
      <section className="relative w-full py-20 px-6 text-center bg-gradient-to-b from-[#5B4B8A]/10 via-[#4FD1C5]/10 to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4FD1C5]/5 via-[#5B4B8A]/5 to-transparent blur-3xl opacity-50" />

        <div className="relative z-10 container mx-auto max-w-lg flex flex-col items-center space-y-6">
          <div className="animate-pulse w-4 h-4 bg-[#4FD1C5] rounded-full shadow-[0_0_20px_#4FD1C580]" />

          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#5B4B8A]">
            💚 Soutenez QVT Box
          </h2>

          <p className="text-[#212121]/80 max-w-md mx-auto leading-relaxed">
            Aidez ZÉNA à grandir et à veiller sur encore plus de salariés.  
            Chaque contribution sur <strong>Kengo.bzh</strong> fait briller une
            nouvelle bulle d’espoir.
          </p>

          <div className="flex justify-center w-full">
            <iframe
              scrolling="no"
              src="https://kengo.bzh/projet-embed/5212/qvt-box"
              style={{
                border: "none",
                width: "100%",
                maxWidth: "360px",
                height: "440px",
                borderRadius: "18px",
                boxShadow: "0 8px 30px rgba(91,75,138,0.3)",
              }}
              title="Cagnotte Kengo QVT Box"
            />
          </div>

          <p className="text-xs text-[#212121]/70 mt-2">
            Ensemble, faisons briller les bulles d’espoir 💫
          </p>
        </div>
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="text-center text-sm text-[#212121]/60 py-6">
        © 2025 QVT Box — ZÉNA veille sur vos émotions 💜
      </footer>
    </div>
  );
}
