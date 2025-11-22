// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#F5E5C9] text-[#1E140B] overflow-hidden">
      {/* NAVIGATION */}
      <Navigation />

      {/* BACKGROUND GLOBAL (halo sable + vignette douce) */}
      <div className="fixed inset-0 pointer-events-none opacity-80">
        <div className="w-full h-full bg-[radial-gradient(circle_at_0%_0%,#ffffff,transparent_55%),radial-gradient(circle_at_100%_100%,#f1c99f,transparent_55%)]" />
      </div>

      {/* HERO */}
      <main className="relative z-10 flex items-center justify-center px-6 md:px-12 lg:px-20 pt-20 pb-16">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-20">
          {/* COLONNE GAUCHE : TEXTE */}
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.25em] text-[11px] text-[#A48755] mb-3">
              QVT BOX PRÉSENTE
            </p>

            <h1 className="text-[2.2rem] md:text-[2.8rem] leading-tight font-light text-[#23150A]">
              <span className="font-semibold tracking-tight">ZÉNA</span>
              <span className="italic text-[#C49A55]">
                , la voix qui veille sur vos équipes
              </span>
            </h1>

            <p className="mt-6 text-sm md:text-base text-[#4C3926] leading-relaxed">
              Une IA émotionnelle qui écoute, rassure et alerte avant le
              burn-out. ZÉNA prend des nouvelles en douceur, détecte la fatigue
              invisible et transforme des milliers de « ça va » automatiques en
              une météo émotionnelle claire pour vos RH.
            </p>

            <p className="mt-4 text-sm md:text-base text-[#4C3926] leading-relaxed">
              Sans stigmatiser, sans fliquer. Juste pour intervenir à temps et
              prendre soin de celles et ceux qui tiennent la maison.
            </p>

            {/* CTA PRINCIPAUX */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="https://qvtbox.com"
                className="inline-flex items-center gap-2 rounded-full bg-[#C49A55] text-white text-sm px-6 py-3 shadow-[0_10px_30px_rgba(163,117,55,0.35)] hover:bg-[#d2aa63] transition"
              >
                ⚡ Découvrir QVT Box
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-[#C49A55]/40 text-[#3A291A] text-sm px-6 py-3 bg-white/40 backdrop-blur-sm hover:bg-white/70 transition"
              >
                🧳 Demander une démo entreprise
              </Link>
            </div>

            {/* CTA TESTER LA VOIX */}
            <div className="mt-5">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 rounded-full border border-[#B7986A]/40 bg-white/60 text-[#3A2718] text-sm px-5 py-2.5 hover:bg-white transition shadow-sm"
              >
                <MessageCircleMore className="w-4 h-4" />
                Tester comment ZÉNA parle
              </Link>
            </div>

            {/* LIEN FAMILLE / ADOS */}
            <div className="mt-4 text-xs md:text-[13px] text-[#7A6245] flex items-center gap-2">
              <span>👨‍👩‍👧</span>
              <Link
                to="https://zena-family.qvtbox.com"
                className="underline underline-offset-2 decoration-[#C49A55]/60 hover:text-[#C49A55]"
              >
                Découvrir aussi ZÉNA Famille & Ados
              </Link>
            </div>
          </div>

          {/* COLONNE DROITE : VISAGE PARTICULES */}
          <div className="flex flex-col items-center gap-4">
            <ZenaFaceParticles />
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#A48755]/80">
              Interface lumineuse de ZÉNA
            </p>
          </div>
        </div>
      </main>

      {/* FOOTER (tagline discrète) */}
      <footer className="relative z-10 pb-6 text-center text-[11px] text-[#8B7150]">
        « Sortez de votre bulle, on veille sur vous. »
      </footer>

      {/* Footer global existant si tu veux le garder */}
      <Footer />
    </div>
  );
}
