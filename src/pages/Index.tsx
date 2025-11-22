// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles, BriefcaseBusiness } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";
import ZenaAvatar from "@/components/ZenaAvatar";

/**
 * Page d’accueil ZÉNA – version minimaliste sans grosse carte blanche,
 * avec visage-particules à droite et CTA pour tester comment elle parle.
 */
export default function Index() {
  return (
    <div className="min-h-screen bg-[#F3E5CE] text-[#1B1A18] flex flex-col">
      {/* NAVBAR TRANSLUCIDE AU-DESSUS */}
      <div className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-[#F3E5CE]/90 via-[#F3E5CE]/70 to-transparent backdrop-blur-sm">
        <Navigation />
      </div>

      {/* HERO PLEIN ÉCRAN */}
      <main className="flex-1 pt-24 md:pt-28">
        <section
          className="
            relative max-w-6xl mx-auto px-6 md:px-10 lg:px-12
            flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20
            pb-20 md:pb-24
          "
        >
          {/* Halo de fond très doux derrière ZÉNA */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute right-[-10%] top-[10%] w-[420px] h-[420px] rounded-full
                            bg-[radial-gradient(circle_at_30%_0%,#FFFFFF_0%,transparent_55%),radial-gradient(circle_at_80%_80%,#D8B47A_0%,transparent_55%),radial-gradient(circle_at_0%_80%,#B494FF_0%,transparent_45%)]
                            opacity-70 blur-[4px]" />
            <div className="absolute left-[-15%] bottom-[-10%] w-[420px] h-[420px] rounded-full
                            bg-[radial-gradient(circle_at_10%_0%,#FFFFFF_0%,transparent_50%),radial-gradient(circle_at_80%_90%,#D8B47A_0%,transparent_55%)]
                            opacity-30 blur-[6px]" />
          </div>

          {/* COLONNE TEXTE */}
          <div className="flex-1 max-w-xl space-y-7">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#9A8160]">
              QVT BOX PRÉSENTE
            </p>

            <header className="space-y-3">
              <h1 className="text-[2.5rem] md:text-[3rem] leading-tight font-light">
                <span className="font-semibold">ZÉNA</span>
                <span className="text-[#C8913C] italic font-semibold">
                  , la voix qui veille sur vos équipes
                </span>
              </h1>

              <p className="text-sm md:text-[15px] font-medium text-[#3A3229]">
                Une IA émotionnelle qui écoute, rassure et alerte avant le burn-out.
              </p>
            </header>

            <p className="text-sm md:text-[15px] leading-relaxed text-[#5A4B3A]">
              ZÉNA prend des nouvelles en douceur, détecte la fatigue invisible et transforme
              des milliers de « ça va » automatiques en une météo émotionnelle claire
              pour vos RH. Sans stigmatiser, sans fliquer – juste pour intervenir à temps
              et prendre soin de celles et ceux qui tiennent la maison.
            </p>

            {/* CTA PRINCIPAUX */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 rounded-full bg-[#C8913C] text-[#1B1A18] px-5 py-2.5 text-sm font-medium shadow-[0_12px_35px_rgba(140,90,20,0.35)] hover:bg-[#D7A14C] transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Découvrir QVT Box
              </Link>

              <Link
                to="/onboarding-company"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8913C66] bg-[#F3E5CE]/60 px-5 py-2.5 text-sm text-[#2B231A] hover:bg-[#F8EEE0] transition-colors"
              >
                <BriefcaseBusiness className="w-4 h-4" />
                Demander une démo entreprise
              </Link>
            </div>

            {/* CTA TESTER COMMENT ZÉNA PARLE */}
            <div className="pt-1">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 rounded-full border border-[#C8913C33] bg-white/70 px-4 py-2 text-xs md:text-sm text-[#3A3229] hover:bg-white shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C8913C]" />
                Tester comment ZÉNA parle
              </Link>
            </div>

            {/* LIEN FAMILLE / ADOS */}
            <div className="pt-2 text-xs md:text-[13px] text-[#6D5A44] flex items-center gap-2">
              <span className="text-lg">👨‍👩‍👧</span>
              <Link to="https://zena-family.qvtbox.com" className="underline underline-offset-2 decoration-[#C8913C66] hover:text-[#C8913C]">
                Découvrir aussi ZÉNA Famille &amp; Ados
              </Link>
            </div>
          </div>

          {/* COLONNE VISUEL ZÉNA */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <div
              className="
                relative w-[260px] h-[260px] md:w-[300px] md:h-[300px]
                rounded-full overflow-hidden
                shadow-[0_22px_55px_rgba(0,0,0,0.35)]
                border border-white/35
                bg-[#0E0E10]
              "
            >
              {/* Visage particules (Three.js) */}
              <div className="absolute inset-0">
                <ZenaFaceParticles />
              </div>

              {/* Fallback image de ZÉNA au cas où WebGL ne charge pas */}
              <div className="absolute inset-0 pointer-events-none">
                <ZenaAvatar />
              </div>

              {/* léger halo au bord */}
              <div className="absolute inset-[-2px] rounded-full pointer-events-none border border-[#F5D9A8]/40 shadow-[0_0_60px_rgba(250,225,180,0.55)]" />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="py-6 text-center text-[11px] text-[#7C6950]">
        « Sortez de votre bulle, on veille sur vous. »
      </footer>

      {/* Footer global (si tu veux garder le composant existant) */}
      <Footer />
    </div>
  );
}
