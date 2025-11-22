// src/pages/Index.tsx

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaRippleFace from "@/components/ZenaRippleFace";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen flex flex-col overflow-hidden">
      <Navigation />

      {/* ================= HERO IMMERSIF ================= */}
      <section
        className="
        relative flex flex-col items-center justify-center 
        px-8 md:px-16 pt-32 pb-24
        min-h-[92vh]"
      >
        {/* Voile doré en rétro-éclairage */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#FFF7E8] via-[#FAF0D8] to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Poussière dorée flottante */}
        {Array.from({ length: 55 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 2 + (i % 4),
              height: 2 + (i % 4),
              background:
                i % 2 === 0
                  ? "rgba(255,228,180,0.9)"
                  : "rgba(255,196,120,0.7)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: "blur(0.8px)",
            }}
            animate={{
              y: [0, -12, 0],
              x: [0, 3, -2, 0],
              opacity: [0.4, 1, 0.3],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.12,
            }}
          />
        ))}

        {/* TITRE */}
        <motion.div
          className="relative z-10 text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <p className="uppercase tracking-[0.2em] text-[11px] text-[#C3A878]/90 mb-3">
            ZÉNA — Intelligence Émotionnelle Augmentée
          </p>

          <h1 className="text-4xl md:text-6xl font-light leading-tight text-[#1B1A18]">
            La lumière qui révèle  
            <br />
            <span className="text-[#C3A878]">vos émotions silencieuses</span>
          </h1>
        </motion.div>

        {/* VISAGE ZENA INÉDIT – Révélation depuis la poussière */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="relative z-20"
        >
          <ZenaRippleFace
            imageUrl="/images/zena-face-golden.png"
            size={400}
            targetUrl="/zena-chat"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          className="relative z-20 mt-16 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2 }}
        >
          <Link
            to="/zena-chat"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] text-[#1B1A18] hover:bg-[#d4be98] transition"
          >
            Essayer ZÉNA <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/onboarding-company"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#C3A878]/60 text-[#1B1A18] hover:bg-[#ffffff40] transition backdrop-blur-sm"
          >
            Créer mon espace RH
          </Link>
        </motion.div>
      </section>

      {/* ================= SCROLL NARRATIF ÉMOTIONNEL ================= */}
      <section className="py-24 bg-[#FFFDF7] px-8 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-10">
            Comment ZÉNA vous accompagne ?
          </h2>

          <div className="space-y-14">
            <div>
              <h3 className="text-xl text-[#B09268] mb-2">1. Elle écoute</h3>
              <p className="text-[#6F6454]">
                Une présence douce, sans jugement. ZÉNA recueille vos émotions
                écrites ou vocales, même quand vous ne trouvez pas les mots.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-[#B09268] mb-2">2. Elle détecte</h3>
              <p className="text-[#6F6454]">
                Grâce à son IA émotionnelle souveraine, elle capte les signaux faibles :
                micro-fatigue, tristesse masquée, surcharge mentale.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-[#B09268] mb-2">3. Elle éclaire</h3>
              <p className="text-[#6F6454]">
                Elle transforme ces nuances en météo émotionnelle anonymisée pour guider les RH et prévenir le burn-out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <p className="uppercase tracking-[0.25em] text-[11px] text-[#E5D7BF]/80 mb-5">
            Le coup de pouce ZÉNA
          </p>

          <h2 className="text-2xl md:text-3xl font-light mb-6">
            Et si vous écoutiez autrement ?
          </h2>

          <p className="text-sm md:text-base text-[#E5D7BF]/80 mb-10">
            Une approche douce, vraie, souveraine, et profondément humaine.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] text-[#151515] hover:bg-[#d9c7a4] transition"
            >
              Prendre contact <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
            >
              Essayer ZÉNA
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
