// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, Mic, BriefcaseBusiness } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";

export default function Index() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#FFF6E7_0,_#E7D4B8_55%,_#C6B49A_100%)] text-[#1B1A18]">
      <Navigation />

      <main className="flex min-h-screen items-center justify-center px-4 pb-24 pt-28 md:px-8 md:pt-32">
        <section className="relative w-full max-w-6xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFFDF8] via-[#FBF2E3] to-[#F2E3D0] shadow-[0_40px_120px_rgba(0,0,0,0.22)] border border-white/60">
          {/* halo global */}
          <div className="pointer-events-none absolute inset-[-30%] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.9),transparent_60%),radial-gradient(circle_at_80%_100%,rgba(197,168,255,0.45),transparent_60%)] mix-blend-screen" />

          <div className="relative z-10 flex flex-col gap-10 px-6 py-10 md:flex-row md:items-center md:gap-12 md:px-12 md:py-14">
            {/* Texte gauche */}
            <div className="w-full md:w-1/2 space-y-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9C8D77]">
                QVT Box présente
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-[2.7rem] leading-tight font-light">
                <span className="block text-[#1B1A18] font-semibold">
                  ZÉNA,
                </span>
                <span className="italic text-[#C3A878]">
                  la voix qui veille sur vos équipes
                </span>
              </h1>

              <p className="text-sm md:text-base font-medium text-[#4A3C29]">
                Une IA émotionnelle qui écoute, rassure et alerte avant le
                burn-out.
              </p>

              <p className="text-sm md:text-[15px] text-[#6F6454] leading-relaxed">
                ZÉNA prend des nouvelles en douceur, détecte la fatigue
                invisible et transforme des milliers de « ça va ? » automatiques
                en une véritable météo émotionnelle pour vos RH. Sans
                stigmatiser, sans fliquer. Juste pour intervenir à temps et
                prendre soin de celles et ceux qui tiennent la maison.
              </p>

              {/* CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/boutique"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C3A878] px-6 py-3 text-sm font-medium text-[#1B1A18] shadow-[0_12px_30px_rgba(195,168,120,0.55)] hover:bg-[#d9c7a4] transition"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Découvrir QVT Box
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C3A878]/60 bg-white/40 px-6 py-3 text-sm font-medium text-[#4A3C29] backdrop-blur-md hover:bg-white/80 transition"
                >
                  <ArrowRight className="h-4 w-4" />
                  Demander une démo entreprise
                </Link>
              </div>

              {/* Bouton test direct de ZÉNA */}
              <div className="mt-4 flex flex-col gap-2 text-xs text-[#6F6454]">
                <Link
                  to="/zena-chat"
                  className="inline-flex items-center gap-2 self-start rounded-full border border-[#B89AFC]/50 bg-white/70 px-4 py-2 text-[13px] font-medium text-[#4C3A60] shadow-sm hover:bg-white/100 transition"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#B89AFC] via-[#EAD9FF] to-[#F5E3C3]">
                    <Mic className="h-3 w-3" />
                  </span>
                  Tester comment ZÉNA parle
                  <span className="text-[11px] opacity-80">
                    (démo anonyme, sans compte)
                  </span>
                </Link>

                <Link
                  to="/zena-family"
                  className="text-[12px] text-[#7B6C5A] hover:text-[#C3A878] underline-offset-2 hover:underline"
                >
                  👨‍👩‍👧 Découvrir aussi ZÉNA Famille & Ados – pour les maisons
                  où « ça va » veut tout dire.
                </Link>
              </div>
            </div>

            {/* Visuel 3D ZÉNA droite */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="relative w-full max-w-[380px]">
                {/* label discret */}
                <p className="absolute -top-6 left-2 text-[11px] uppercase tracking-[0.18em] text-[#B59A7A]/90">
                  Visage émotionnel de ZÉNA
                </p>

                <ZenaFaceParticles />

                {/* anneau de lumière au sol */}
                <div className="pointer-events-none absolute inset-x-6 -bottom-10 h-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.18),transparent_70%)] blur-md opacity-80" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="pb-12 text-center text-[11px] text-[#6F6454]">
        « Sortez de votre bulle, on veille sur vous. »
      </section>

      <Footer />
    </div>
  );
}
