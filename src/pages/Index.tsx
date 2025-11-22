// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaParticleFace from "@/components/ZenaParticleFace";
import ZenaChatDock from "@/components/ZenaChatDock";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F0E4] via-[#F1E2C7] to-[#E0CCAE] text-[#1B1A18]">
      {/* NAV */}
      <Navigation />

      {/* HERO */}
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 pt-28 pb-16 lg:flex-row lg:gap-20">
        {/* Colonne texte */}
        <section className="w-full flex-1 space-y-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#9D8563]">
            QVT BOX PRÉSENTE
          </p>

          <h1 className="text-3xl leading-snug text-[#1E1309] sm:text-4xl md:text-[42px] md:leading-snug">
            <span className="font-semibold tracking-tight">ZÉNA</span>
            <span className="text-[#C7913D]">, la voix qui veille sur vos équipes</span>
          </h1>

          <p className="max-w-xl text-sm font-medium text-[#4A3623]">
            Une IA émotionnelle qui écoute, rassure et alerte avant le burn-out.
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-[#5B4733]">
            ZÉNA prend des nouvelles en douceur, détecte la fatigue invisible et
            transforme des milliers de « ça va » automatiques en une météo
            émotionnelle claire pour vos RH. Sans stigmatiser, sans fliquer.
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-[#5B4733]">
            Juste ce qu’il faut pour intervenir à temps et prendre soin de celles
            et ceux qui tiennent la maison.
          </p>

          {/* CTA principaux */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="https://qvtbox.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#C58B3B] px-5 py-2.5 text-xs font-medium text-white shadow-[0_10px_30px_rgba(159,107,40,0.35)] hover:bg-[#D99A46] transition-colors"
            >
              ⚡ Découvrir QVT Box
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="mailto:contact@qvtbox.com?subject=Demande%20de%20d%C3%A9mo%20Z%C3%89NA%20Entreprise"
              className="inline-flex items-center gap-2 rounded-full border border-[#E6C49E] bg-white/70 px-5 py-2.5 text-xs font-medium text-[#42301D] hover:bg-white transition-colors"
            >
              🧳 Demander une démo entreprise
            </Link>
          </div>

          {/* CTA test direct */}
          <button
            onClick={() => {
              const el = document.getElementById("tester-zena");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F6E4C4] px-4 py-2 text-xs text-[#4B3521] hover:bg-[#F9E9CF] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Tester comment ZÉNA parle
          </button>

          {/* Lien discret Famille */}
          <div className="mt-3 text-xs text-[#7A6548]">
            <Link
              to="https://zena-family.qvtbox.com"
              className="inline-flex items-center gap-1 hover:text-[#A07B4D] transition-colors"
            >
              <span>👨‍👩‍👧</span>
              <span>Découvrir aussi ZÉNA Famille &amp; Ados</span>
            </Link>
          </div>
        </section>

        {/* Colonne ZÉNA visage particules */}
        <section className="relative flex w-full flex-1 items-center justify-center lg:justify-end">
          <div className="relative h-[270px] w-[270px] sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]">
            <ZenaParticleFace />
          </div>
        </section>
      </main>

      {/* DOCK DE TEST – CHAT + VOIX */}
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <ZenaChatDock />
      </div>

      {/* Bas de page */}
      <div className="pb-8 text-center text-[11px] text-[#8E7454]">
        « Sortez de votre bulle, on veille sur vous. »
      </div>

      <Footer />
    </div>
  );
}
