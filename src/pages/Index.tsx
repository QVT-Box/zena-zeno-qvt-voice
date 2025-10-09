import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-hidden relative">
      {/* ==== Halo d'ambiance général ==== */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* ==== HERO ZÉNA ==== */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-16 md:pt-20">
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

      {/* ==== CTA (Call To Action) ==== */}
      <motion.div
        className="flex flex-col items-center justify-center mt-10 mb-16 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {/* Bouton principal redirigeant vers le chat */}
        <Link
          to="/zena-chat"
          className="px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg
                     bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all"
        >
          🎙️ Essayer ZÉNA en direct
        </Link>

        {/* Bouton secondaire pour connexion */}
        <Link
          to="/auth"
          className="px-6 py-3 rounded-full font-medium text-base shadow-md
                     bg-white text-[#005B5F] border-2 border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-all"
        >
           Se connecter / S'inscrire
        </Link>

        {/* Texte secondaire */}
        <p className="text-sm text-[#212121]/60 max-w-sm text-center">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>
      </motion.div>

      {/* ==== FOOTER ==== */}
      <footer className="w-full py-6 text-center border-t border-[#78A085]/30 bg-white/40 backdrop-blur-sm">
        <p className="text-sm">
          © {new Date().getFullYear()} QVT Box —{" "}
          <span className="text-[#005B5F] font-semibold">
            Le coup de pouce bien-être
          </span>{" "}
          �
        </p>
        <p className="text-xs opacity-75 mt-1"></p>
      </footer>
    </div>
  );
}
