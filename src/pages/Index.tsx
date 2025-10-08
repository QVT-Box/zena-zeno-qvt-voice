// src/pages/index.tsx
import { motion } from "framer-motion";
import ZenaAvatar from "@/components/ZenaAvatar";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121]">
      {/* ======== HERO ZÉNA ======== */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-20">
        {/* Avatar animé */}
        <ZenaAvatar isSpeaking={false} emotion="neutral" />

        {/* Titre principal */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent"
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
          pour mieux comprendre le bien-être au travail.
        </motion.p>
      </header>

      {/* ======== APPEL À L’ACTION ======== */}
      <motion.div
        className="flex flex-col items-center justify-center mt-10 mb-16 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={() => navigate("/ZenaChat")}
          className="px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg
                     bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all"
        >
          🎙️ Essayer ZÉNA en direct
        </button>

        <p className="text-sm text-[#212121]/60 max-w-sm text-center">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>
      </motion.div>

      {/* ======== FOOTER ======== */}
      <footer className="w-full py-6 text-center border-t border-[#78A085]/30 bg-white/40 backdrop-blur-sm">
        <p className="text-sm">
          © {new Date().getFullYear()} QVT Box —{" "}
          <span className="text-[#005B5F] font-semibold">
            Le coup de pouce bien-être
          </span>{" "}
          💡
        </p>
        <p className="text-xs opacity-75 mt-1">Made with 💜 en Bretagne</p>
      </footer>
    </div>
  );
}
