import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { BottomNav } from "@/components/BottomNav";
import ZenaAvatar from "@/components/ZenaAvatar";
import { Button } from "@/components/ui/button";

/**
 * 🪷 Page d’accueil de ZÉNA
 * -----------------------------------------------
 * - Navigation haute (desktop)
 * - Avatar Zéna + présentation
 * - Boutons de test et d’inscription
 * - Navigation mobile (bottom)
 */
export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-hidden relative">
      {/* === Halo d’ambiance === */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
        aria-hidden="true"
      />

      {/* === Barre de navigation principale === */}
      <Navigation />

      {/* === Section principale ZÉNA === */}
      <header className="flex flex-col items-center justify-center text-center px-6 pt-28 md:pt-36">
        {/* Avatar animé */}
        <div className="relative w-40 h-40 md:w-52 md:h-52">
          <ZenaAvatar isSpeaking={false} emotion="neutral" />
        </div>

        {/* Titre principal */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mt-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          ZÉNA — L’IA émotionnelle de QVT Box
        </motion.h1>

        {/* Sous-texte inspirant */}
        <motion.p
          className="mt-4 text-lg max-w-2xl leading-relaxed text-[#212121]/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >


          
          Une voix bienveillante, un regard attentif et une bulle d’écoute
          pour mieux comprendre le bien-être au travail.
        </motion.p>

        {/* CTA principaux */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center mt-10 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Button
            asChild
            size="lg"
            className="px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all"
          >
            <Link to="/zena-chat"> Essayer ZÉNA en direct</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-6 py-3 rounded-full font-medium text-base shadow-md bg-white text-[#005B5F] border-2 border-[#4FD1C5] hover:bg-[#4FD1C5]/10 transition-all"
          >
            <Link to="/auth">Se connecter / S’inscrire</Link>
          </Button>
        </motion.div>

        {/* Texte secondaire */}
        <p className="text-sm text-[#212121]/60 max-w-sm text-center mt-4">
          Découvrez comment ZÉNA écoute, analyse et vous recommande
          des solutions QVT concrètes grâce à son IA émotionnelle.
        </p>

        {/* Encadré Météo Émotionnelle */}
        <motion.div
          className="mt-12 bg-white/70 backdrop-blur-sm rounded-3xl shadow-inner p-6 border border-[#78A085]/30 max-w-md mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h2 className="text-xl font-semibold text-[#005B5F] mb-2">
            🌤️ Météo Émotionnelle de votre entreprise
          </h2>
          <p className="text-sm text-[#212121]/70 mb-3">
            ZÉNA agrège les émotions anonymisées de vos équipes pour aider
            les RH à anticiper la fatigue, la démotivation ou le stress.
          </p>
          <div className="w-full bg-[#EAF4F3] rounded-full h-3 overflow-hidden mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5]"
              initial={{ width: "0%" }}
              animate={{ width: "70%" }}
              transition={{ duration: 1.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Indice global QVT : <span className="font-semibold">10,5 / 15</span>
          </p>
        </motion.div>

        {/* Intégration Kengo (cagnotte) */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <iframe
            scrolling="no"
            src="https://kengo.bzh/projet-embed/5212/qvt-box"
            style={{
              border: "none",
              width: "320px",
              height: "380px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
            title="Kengo QVT Box"
          ></iframe>
        </motion.div>
      </header>

      {/* === Barre de navigation mobile === */}
      <BottomNav />
    </div>
  );
}
