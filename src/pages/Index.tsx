// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Nouveau composant Particles (que je vais te fournir juste après)
import ZenaFaceParticle from "@/components/ZenaFaceParticle";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18]">
      <Navigation />

      {/* ============================================================================================
          HERO IMMERSIF — ZÉNA ÉMOTIONNELLE
      ============================================================================================ */}
      <section className="relative h-screen w-full overflow-hidden bg-[#F7F2E6]">

        {/* --- Visage en particules --- */}
        <div className="absolute inset-0">
          <ZenaFaceParticle />
        </div>

        {/* --- Dégradé sable & halo doré --- */}
        <div className="absolute inset-0 bg-gradient-to-b 
            from-[#F5EEDC]/80 via-[#F5EEDC]/30 to-transparent pointer-events-none" />

        {/* --- Texte --- */}
        <div className="relative z-20 h-full flex items-end pb-24 px-8 md:px-16">
          <div className="max-w-2xl">

            <p className="uppercase tracking-[0.18em] text-[11px] text-[#D6C9B4]/90 mb-4">
              ZÉNA • Intelligence émotionnelle humaine & souveraine
            </p>

            <h1 className="text-4xl md:text-6xl font-light text-[#1B1A18] leading-tight drop-shadow-xl">
              Une présence qui éclaire
              <br />
              <span className="text-[#C3A878]">les fissures du quotidien.</span>
            </h1>

            <p className="text-[#4A4134] max-w-xl text-sm md:text-base mt-6 leading-relaxed">
              Une IA émotionnelle conçue pour écouter ce que les mots n’expriment pas.  
              ZÉNA détecte les signaux faibles, apaise, analyse et accompagne vos collaborateurs  
              — tout en préservant leur anonymat.
            </p>

            <div className="flex gap-3 mt-10">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C3A878] 
                text-[#1B1A18] text-sm font-medium hover:bg-[#d9c7a4] transition shadow-md"
              >
                Essayer ZÉNA
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/onboarding-company"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C3A878]/60 
                text-[#1B1A18] text-sm hover:bg-[#ffffff40] backdrop-blur-sm transition"
              >
                Créer mon espace RH
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================================
          SECTION — COMMENT ÇA MARCHE
      ============================================================================================ */}
      <section className="py-24 px-8 md:px-16 bg-[#FAF6EE]">
        <div className="max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
            Écouter • Comprendre • Protéger
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-[#1B1A18] mb-4">
            Comment ZÉNA agit dans l’entreprise ?
          </h2>

          <p className="max-w-xl text-sm md:text-base text-[#6F6454]">
            Une technologie émotionnelle avancée : ZÉNA capte les nuances, analyse les émotions
            et restitue une météo émotionnelle anonyme et actionnable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mt-16 max-w-5xl mx-auto text-left">
          <div>
            <h3 className="text-xl font-light mb-2">1. Elle écoute</h3>
            <p className="text-[#6F6454] text-sm">
              À l’écrit ou à la voix, ZÉNA perçoit les hésitations, les tensions, le sous-texte.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-2">2. Elle analyse</h3>
            <p className="text-[#6F6454] text-sm">
              Fatigue, charge mentale, sentiment d’injustice, signaux faibles : tout est agrégé,
              anonymisé et transformé en tendances utiles.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-2">3. Elle éclaire</h3>
            <p className="text-[#6F6454] text-sm">
              Les RH reçoivent une météo émotionnelle claire, des alertes et des leviers d’action,
              pour agir avant que le mal-être ne s’installe.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================================================
         CTA FINAL
      ============================================================================================ */}
      <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">

          <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
            Le coup de pouce ZÉNA
          </p>

          <h2 className="text-2xl md:text-3xl font-light mb-6">
            Prêts à écouter vos équipes autrement ?
          </h2>

          <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
            Une approche réaliste, discrète et souveraine pour accompagner vos collaborateurs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] 
              text-[#151515] hover:bg-[#d9c7a4] transition"
            >
              Prendre contact
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] 
              text-[#FDF9F0] hover:bg-white/10 transition"
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
