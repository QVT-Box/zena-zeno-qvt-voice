// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, MessageCircleMore, Sparkles } from "lucide-react";
import ZenaParticleFace from "@/components/ZenaParticleFace";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E8D4] via-[#F6EBDD] to-[#E7D3B3] text-[#1B1A18] flex items-center justify-center px-4 py-10">
      <main className="w-full max-w-6xl">
        {/* CARD PRINCIPALE */}
        <section className="relative w-full overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF7EA] via-[#FEF6EE] to-[#F4E2C9] shadow-[0_30px_80px_rgba(154,112,64,0.35)] px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* contenu gauche */}
          <div className="max-w-xl space-y-6">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[#B49B7B]">
              QVT BOX PRÉSENTE
            </p>

            <h1 className="text-[2.6rem] md:text-[3rem] leading-tight font-light">
              <span className="font-semibold">ZÉNA</span>
              <span className="text-[#C79A4B] font-semibold">,&nbsp;</span>
              <span className="italic text-[#C79A4B]">
                la voix qui veille sur vos équipes
              </span>
            </h1>

            <p className="text-sm md:text-base text-[#4D3F30] font-medium">
              Une IA émotionnelle qui écoute, rassure et alerte avant le burn-out.
            </p>

            <p className="text-sm md:text-base text-[#6C5C4B] leading-relaxed">
              ZÉNA prend des nouvelles en douceur, détecte la fatigue invisible et transforme
              des milliers de «&nbsp;ça va&nbsp;» automatiques en une météo émotionnelle
              claire pour vos RH. Sans stigmatiser, sans fliquer. Juste pour intervenir à temps
              et prendre soin de celles et ceux qui tiennent la maison.
            </p>

            {/* boutons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="https://qvtbox.com"
                className="inline-flex items-center gap-2 rounded-full bg-[#E6A44B] px-5 py-3 text-[0.9rem] font-semibold text-[#1F1307] shadow-[0_12px_30px_rgba(205,140,60,0.55)] hover:translate-y-[1px] hover:shadow-[0_8px_20px_rgba(205,140,60,0.45)] transition"
              >
                <Sparkles className="w-4 h-4" />
                Découvrir QVT Box
              </Link>

              <Link
                to="/demo-entreprise"
                className="inline-flex items-center gap-2 rounded-full border border-[#D1B48A] bg-white/60 px-5 py-3 text-[0.9rem] text-[#403125] hover:bg-white/90 transition shadow-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Demander une démo entreprise
              </Link>
            </div>

            {/* bouton de test de Zéna */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E4D2B8] mt-4">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 rounded-full bg-[#F6EEE1] px-4 py-2 text-[0.9rem] text-[#4F3E30] hover:bg-[#f2e0c5] transition shadow-inner"
              >
                <MessageCircleMore className="w-4 h-4 text-[#C4884B]" />
                Tester comment ZÉNA parle
              </Link>

              <Link
                to="https://zena-family.qvtbox.com"
                className="text-[0.85rem] text-[#8B7252] hover:text-[#5b4227] inline-flex items-center gap-2"
              >
                <span className="text-lg">👨‍👩‍👧</span>
                Découvrir aussi ZÉNA Famille &amp; Ados
              </Link>
            </div>
          </div>

          {/* visage particules à droite */}
          <div className="relative flex items-center justify-center">
            <ZenaParticleFace />
          </div>
        </section>

        {/* tagline bas de page */}
        <p className="mt-6 text-center text-[0.8rem] text-[#6B5B49]">
          «&nbsp;Sortez de votre bulle, on veille sur vous.&nbsp;»
        </p>
      </main>
    </div>
  );
}
