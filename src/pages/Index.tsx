import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ZenaAvatar from "@/components/ZenaAvatar";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-y-auto relative">
      {/* ==== Halo d'ambiance général ==== */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/15 rounded-full blur-[140px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* ==== HERO ZÉNA ==== */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-44 md:pt-52">
        {/* Avatar ZÉNA avec halo */}
        <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#4FD1C5]/20 mb-4">
          <ZenaAvatar isSpeaking={false} emotion="neutral" />
        </div>

        {/* Titre principal */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-8 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ZÉNA — L’IA émotionnelle de QVT Box
        </motion.h1>

        {/* Sous-texte inspirant */}
        <motion.p
          className="mt-4 text-lg max-w-2xl leading-relaxed text-[#212121]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Une voix bienveillante, un regard attentif et une bulle d’écoute
          pour mieux comprendre le bien-être au travail.
        </motion.p>

        {/* Boutons d’action */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
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
        </motion.div>

        <p className="text-sm text-[#212121]/60 mt-6 max-w-md mx-auto">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>
      </header>

      {/* ==== MÉTÉO ÉMOTIONNELLE ==== */}
      <section className="mt-10 w-full max-w-lg bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[#EAF4F3] mx-4">
        <h2 className="text-lg md:text-xl font-semibold text-[#005B5F] mb-3 flex items-center justify-center gap-2">
          🌤️ <span>Météo émotionnelle de votre entreprise</span>
        </h2>
        <p className="text-sm text-[#212121]/80 text-center leading-relaxed mb-3">
          ZÉNA agrège les émotions anonymisées de vos équipes pour aider les RH
          à anticiper la fatigue, la démotivation ou le stress.
        </p>
        <div className="w-full bg-[#EAF4F3] rounded-full h-3 overflow-hidden mb-1">
          <motion.div
            className="h-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5]"
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs text-gray-600 text-center">
          Indice global QVT : <span className="font-semibold">10,5 / 15</span>
        </p>
      </section>

      {/* ==== CAGNOTTE KENGO ==== */}
      <section className="my-12 w-full flex justify-center">
        <iframe
          scrolling="no"
          src="https://kengo.bzh/projet-embed/5212/qvt-box"
          style={{
            border: "none",
            width: "90%",
            maxWidth: "320px",
            height: "320px",
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
          title="Cagnotte QVT Box sur Kengo"
        />
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="py-6 text-center text-sm text-[#6b7280]">
        © 2025 QVT Box — Made with 💜 en Bretagne
      </footer>
    </div>
  );
}
