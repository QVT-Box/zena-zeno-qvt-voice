import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-hidden relative">
      {/* ==== HALOS D’AMBIANCE ==== */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/40 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/35 rounded-full blur-[160px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* ==== HERO ZÉNA ==== */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-20 md:pt-24">
        <ZenaAvatar isSpeaking={false} emotion="neutral" />

        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-wide drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          ZÉNA – L’IA émotionnelle de QVT Box
        </motion.h1>

        <motion.p
          className="mt-4 text-lg max-w-2xl leading-relaxed text-[#212121]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Une voix bienveillante, un regard attentif et une bulle d’écoute
          pour mieux comprendre le bien-être au travail et en famille.
        </motion.p>
      </header>

      {/* ==== CTA ==== */}
      <motion.div
        className="flex flex-col items-center justify-center mt-10 mb-16 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
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
          Se connecter / S’inscrire
        </Link>

        <p className="text-sm text-[#212121]/60 max-w-sm text-center">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>
      </motion.div>

      {/* ==== SECTION KENGO - SOUTENIR QVT BOX ==== */}
      <section className="relative w-full py-14 px-6 text-center bg-gradient-to-b from-[#5B4B8A]/10 via-[#4FD1C5]/10 to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4FD1C5]/5 via-[#5B4B8A]/5 to-transparent blur-2xl opacity-40" />

        <div className="relative z-10 container mx-auto max-w-md flex flex-col items-center space-y-4">
          {/* Petit halo animé */}
          <div className="animate-pulse w-3 h-3 bg-[#4FD1C5] rounded-full shadow-[0_0_15px_#4FD1C580]" />

          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#4FD1C5] to-[#5B4B8A]">
            💚 Soutenez QVT Box
          </h2>

          <p className="text-[#212121]/80 text-sm sm:text-base max-w-sm leading-relaxed">
            Aidez ZÉNA à veiller sur encore plus de salariés.  
            Chaque don sur <strong>Kengo.bzh</strong> fait briller une nouvelle bulle d’espoir.
          </p>

          {/* Iframe plus compacte */}
          <div className="flex justify-center w-full mt-2">
            <iframe
              scrolling="no"
              src="https://kengo.bzh/projet-embed/5212/qvt-box"
              style={{
                border: "none",
                width: "100%",
                maxWidth: "320px",
                height: "340px",
                borderRadius: "14px",
                boxShadow: "0 6px 24px rgba(91,75,138,0.25)",
              }}
              title="Cagnotte Kengo QVT Box"
            />
          </div>

          <p className="text-xs text-[#212121]/60 mt-2">
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
