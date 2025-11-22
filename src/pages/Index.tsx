// src/pages/Index.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ZenaScrollReveal from "@/components/ZenaScrollReveal";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] min-h-screen flex flex-col">
      <Navigation />

      {/* ================= HERO ================= */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-20 px-8 md:px-16 py-24 overflow-hidden">

        {/* ===== TEXTE ===== */}
        <div className="max-w-xl mt-10 md:mt-0">
          <p className="uppercase tracking-[0.18em] text-[11px] text-[#C3A878]/90 mb-4">
            ZÉNA • Intelligence émotionnelle augmentée
          </p>

          <h1 className="text-4xl md:text-6xl font-light leading-tight text-[#1B1A18]">
            La lumière qui<br />
            <span className="text-[#C3A878]">révèle vos émotions</span>
          </h1>

          <p className="text-[#4A4134] max-w-md text-sm md:text-base mt-6 leading-relaxed">
            À mesure que vous explorez la page, ZÉNA apparaît comme une lumière
            qui surgit du calme. Laissez-la guider vos équipes avec douceur.
          </p>

          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C3A878] text-[#1B1A18] text-sm font-medium hover:bg-[#d8c6a0] transition"
            >
              Essayer ZÉNA <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/onboarding-company"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C3A878]/60 text-[#1B1A18] text-sm hover:bg-[#ffffff45] backdrop-blur-sm transition"
            >
              Créer mon espace RH
            </Link>
          </div>
        </div>

        {/* ===== ZÉNA AVEC EFFET SCROLL ===== */}
        <div className="flex justify-center w-full md:w-auto">
          <ZenaScrollReveal image="/images/zena-face.png" />
        </div>
      </section>

      {/* ================= COMMENT ÇA MARCHE ================= */}
      <section className="py-24 px-8 md:px-16 bg-[#FDF9F0]">
        <div className="max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
            Écouter • Comprendre • Protéger
          </p>

          <h2 className="text-3xl font-light text-[#1B1A18] mb-6">
            Comment ZÉNA agit dans votre quotidien ?
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mt-16">
            <div>
              <h3 className="text-xl text-[#1B1A18] mb-2">1. Elle écoute</h3>
              <p className="text-[#6F6454] text-sm">
                Conversations fluides, écrites ou vocales : ZÉNA écoute vos émotions comme une confidente discrète.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-[#1B1A18] mb-2">2. Elle analyse</h3>
              <p className="text-[#6F6454] text-sm">
                Détection des tensions, fatigue mentale et signaux invisibles grâce à son IA émotionnelle souveraine.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-[#1B1A18] mb-2">3. Elle éclaire</h3>
              <p className="text-[#6F6454] text-sm">
                Météo émotionnelle anonyme, tendances, alertes préventives.  
                Un outil RH puissant, sans surveillance individuelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center">
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
            Le coup de pouce ZÉNA
          </p>

          <h2 className="text-2xl md:text-3xl font-light mb-6">
            Prêts à écouter vos équipes autrement ?
          </h2>

          <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
            Une intelligence émotionnelle humaine, souveraine et protectrice.
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
