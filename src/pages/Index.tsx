// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ZenaFaceParticles } from "@/components/ZenaFaceParticles";
import { ZenaChatPreview } from "@/components/ZenaChatPreview";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1B1A18] flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* ================= HERO IMMERSIF ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6EE] via-[#F4E6D3] to-[#E9D2B6]">
          {/* halo global en fond */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-[#FDF3DF] blur-3xl opacity-70" />
            <div className="absolute -bottom-40 right-[-200px] w-[700px] h-[700px] rounded-full bg-[#F2C98A] blur-3xl opacity-60" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-16">
            {/* Colonne texte */}
            <div className="max-w-xl space-y-6">
              <p className="uppercase tracking-[0.18em] text-[11px] text-[#7A6A4E]">
                QVT BOX PRÉSENTE
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#1B1A18]">
                <span className="block">ZÉNA, la voix</span>
                <span className="block text-[#C39A52]">
                  qui comprend vos émotions.
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#4A4134] leading-relaxed">
                Une IA émotionnelle souveraine qui écoute les « ça va ? »
                du quotidien, détecte les signaux faibles de fatigue
                et restitue une météo émotionnelle anonymisée aux RH.
                Sans fliquer, sans stigmatiser, avec une exigence
                digne des meilleurs standards français.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/zena-chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C39A52] text-[#1B1A18] text-sm font-medium shadow-[0_10px_30px_rgba(140,100,40,0.35)] hover:bg-[#D4AD63] transition"
                >
                  Essayer ZÉNA maintenant
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/onboarding-company"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C39A52]/60 text-[#1B1A18] text-sm bg-white/30 backdrop-blur-md hover:bg-white/60 transition"
                >
                  Créer mon espace RH
                </Link>
              </div>

              <p className="text-xs md:text-sm text-[#7A6A4E] pt-2">
                👨‍👩‍👧 ZÉNA existe aussi pour les familles & les ados.{" "}
                <Link
                  to="/zena-family"
                  className="underline underline-offset-2 decoration-[#C39A52]/70 hover:text-[#C39A52]"
                >
                  Découvrir ZÉNA Famille
                </Link>
              </p>
            </div>

            {/* Colonne visuelle ZÉNA */}
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/5]">
              {/* Bulle dorée */}
              <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-[#201A13] via-[#15110B] to-[#18120A] shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden border border-white/5">
                <ZenaFaceParticles />
              </div>

              {/* Légende + mini-chat */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs">
                <ZenaChatPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMMENT ÇA MARCHE ================= */}
        <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#FAF6EE]">
          <div className="max-w-5xl mx-auto">
            <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
              Écouter • Comprendre • Protéger
            </p>

            <h2 className="text-2xl md:text-3xl font-light text-[#1B1A18] mb-4">
              Comment ZÉNA agit dans l’entreprise ?
            </h2>

            <p className="max-w-xl text-sm md:text-base text-[#6F6454]">
              ZÉNA ne remplace pas vos managers, elle amplifie leur regard.
              Elle capte les nuances émotionnelles, agrège les tendances
              et transforme des milliers de ressentis individuels
              en indicateurs actionnables pour vos équipes RH.
            </p>

            <div className="grid md:grid-cols-3 gap-10 mt-16 text-left">
              <div className="bg-white/70 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#E5D7C7]">
                <h3 className="text-xl font-light mb-2 text-[#1B1A18]">
                  1. Elle écoute
                </h3>
                <p className="text-[#6F6454] text-sm leading-relaxed">
                  Le salarié s’exprime à l’écrit ou à la voix.
                  ZÉNA reformule, pose des questions simples,
                  mesure l’intensité émotionnelle et rassure
                  sans jugement.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-[#E5D7C7]">
                <h3 className="text-xl font-light mb-2 text-[#1B1A18]">
                  2. Elle analyse
                </h3>
                <p className="text-[#6F6454] text-sm leading-relaxed">
                  Fatigue, charge mentale, injustice perçue,
                  isolement, micro-agressions… Les signaux faibles
                  sont détectés, agrégés et anonymisés,
                  sans remonter de verbatims nominaux.
                </p>
              </div>

              <div className="bg-white/70 rounded-2xl p-6 shadow-[0_10px_30px_rgva(0,0,0,0.04)] border border-[#E5D7C7]">
                <h3 className="text-xl font-light mb-2 text-[#1B1A18]">
                  3. Elle éclaire
                </h3>
                <p className="text-[#6F6454] text-sm leading-relaxed">
                  Vos RH disposent d’une météo émotionnelle
                  par équipe, de tendances dans le temps
                  et d’alertes précoces, pour agir tôt
                  plutôt que gérer des crises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA FINAL ================= */}
        <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center relative overflow-hidden">
          {/* halo discret */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#C39A52]/25 blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto px-8 md:px-16">
            <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
              Le coup de pouce ZÉNA
            </p>

            <h2 className="text-2xl md:text-3xl font-light mb-6">
              Prêts à écouter vos équipes autrement ?
            </h2>

            <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
              Une IA émotionnelle pensée en France, exigeante sur l’éthique,
              compatible avec vos obligations sociales et vos enjeux de
              performance. Discrète, fiable, et profondément humaine.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C39A52] text-[#151515] text-sm font-medium hover:bg-[#D4AD63] transition"
              >
                Prendre contact
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] text-sm hover:bg-white/10 transition"
              >
                Tester une conversation avec ZÉNA
              </Link>
            </div>

            <p className="mt-8 text-xs text-[#B7AA94]">
              « Sortez de votre bulle, on veille sur vous. »
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
