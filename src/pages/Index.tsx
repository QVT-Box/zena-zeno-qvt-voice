// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaRippleFace from "@/components/ZenaRippleFace";

export default function Index() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#FFF8EC_0%,#F1E1C7_40%,#E0CFB3_75%,#C3B49C_100%)] text-[#20130C] flex flex-col">
      {/* NAVIGATION GLASS */}
      <Navigation />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-10 lg:px-0">
        <section className="mx-auto max-w-6xl grid md:grid-cols-[1.2fr_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
          {/* COLONNE GAUCHE — Texte principal */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8C7B61] mb-3">
              QVT BOX PRÉSENTE
            </p>

            <h1 className="text-[2.4rem] md:text-[3.1rem] leading-[1.1] text-[#23130C] font-[460]">
              ZÉNA,
              <br />
              <span className="italic text-[#B1833D]">
                la voix qui éclaire vos émotions invisibles
              </span>
            </h1>

            <p className="mt-4 md:mt-5 text-[0.95rem] md:text-[1rem] text-[#604632] max-w-xl leading-relaxed">
              Une IA émotionnelle souveraine qui capte les micro-signaux
              de fatigue, transforme des milliers de «&nbsp;ça va&nbsp;»
              automatiques en{" "}
              <span className="font-semibold">
                météo émotionnelle actionnable
              </span>{" "}
              pour vos RH, sans flicage individuel.
            </p>

            {/* TAGS / PUCES */}
            <div className="mt-5 flex flex-wrap gap-2.5 text-[11px] uppercase tracking-[0.18em] text-[#745A44]">
              <span className="px-3 py-1 rounded-full bg-white/70 border border-white/60 shadow-sm">
                Prévention du burn-out
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 border border-white/40">
                Signaux faibles émotionnels
              </span>
              <span className="px-3 py-1 rounded-full bg-white/60 border border-white/40">
                Données souveraines
              </span>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 rounded-full bg-[#20130C] text-[#FDF5E7] px-6 py-3 text-[13px] shadow-[0_16px_40px_rgba(20,8,2,0.7)] hover:bg-black transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tester comment ZÉNA parle</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/onboarding-company"
                className="inline-flex items-center gap-2 rounded-full border border-[#C9AE7A]/70 bg-white/60 text-[13px] text-[#332217] px-6 py-3 backdrop-blur-sm hover:bg-white/90 transition-colors"
              >
                Créer mon espace RH
              </Link>
            </div>

            {/* Ligne QVT Box + Famille */}
            <div className="mt-4 flex flex-wrap gap-3 items-center text-[13px] text-[#6E5943]">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                ZÉNA écoute déjà vos collaborateurs en douceur.
              </span>
              <span className="hidden md:inline text-[#B1833D]">•</span>
              <Link
                to="/zena-chat"
                className="underline underline-offset-4 decoration-[#D0A764]/60 hover:text-[#B1833D]"
              >
                Version Famille &amp; Ados bientôt disponible
              </Link>
            </div>
          </div>

          {/* COLONNE DROITE — Visage ZÉNA Ripple */}
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              {/* halo de fond ovale */}
              <div className="absolute -inset-10 md:-inset-12 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),transparent_60%),radial-gradient(circle_at_80%_120%,rgba(246,211,141,0.65),transparent_60%)] blur-2xl opacity-90" />
              <ZenaRippleFace
                imageUrl="/zena-face.png"
                size={340}
                targetUrl="/zena-chat"
              />
              <p className="mt-4 text-center text-[12px] text-[#7A6450]">
                Survolez ou cliquez&nbsp;: ZÉNA vous ouvre sa bulle.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Flow façon PI.ai : “Comment ça marche ?” */}
        <section className="mx-auto max-w-6xl mt-16 md:mt-20">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#9C8D77] mb-2">
                Parcours émotionnel
              </p>
              <h2 className="text-[1.5rem] md:text-[1.8rem] font-[430] text-[#23130C]">
                En 3 temps, ZÉNA transforme vos signaux faibles en décisions
                responsables.
              </h2>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-white/70 bg-[rgba(255,255,255,0.9)] shadow-[0_14px_36px_rgba(120,88,49,0.18)] p-5">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#A27F46]">
                01 • Salarié
              </div>
              <h3 className="text-[1.05rem] text-[#25160E] mb-2">
                Elle prend des nouvelles, sans jugement.
              </h3>
              <p className="text-[0.9rem] text-[#6A5240] leading-relaxed">
                En quelques phrases écrites ou vocales, le collaborateur
                confie son énergie, ses doutes, ses irritants du quotidien.
                ZÉNA reformule, clarifie et mesure la charge émotionnelle.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-white/70 bg-[rgba(255,255,255,0.92)] shadow-[0_16px_40px_rgba(120,88,49,0.22)] p-5">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#A27F46]">
                02 • IA émotionnelle
              </div>
              <h3 className="text-[1.05rem] text-[#25160E] mb-2">
                Elle détecte les signaux faibles, sans fliquer.
              </h3>
              <p className="text-[0.9rem] text-[#6A5240] leading-relaxed">
                Burn-out en approche, injustices perçues, surcharge chronique…
                Tout est <span className="font-semibold">agrégé</span> et{" "}
                <span className="font-semibold">anonymisé</span>, sans scoring
                individuel nominatif.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-white/70 bg-[rgba(20,10,3,0.96)] shadow-[0_18px_50px_rgba(13,6,2,0.75)] p-5 text-[#FDF2DE]">
              <div className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#F4D08C]">
                03 • RH / Direction
              </div>
              <h3 className="text-[1.05rem] mb-2">
                Vous voyez la météo émotionnelle, à temps.
              </h3>
              <p className="text-[0.9rem] text-[#F5E1BF] leading-relaxed">
                Tableau de bord “météo émotionnelle”, tendances par équipe,
                alertes précoces et pistes d’actions QVT.&nbsp;
                <span className="font-semibold">
                  Un outil d’arbitrage, pas un outil de surveillance.
                </span>
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="px-3 py-1 rounded-full bg-[#F6D38D]/15 border border-[#F6D38D]/40 text-[#F6D38D]">
                  Heatmap émotionnelle
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/20">
                  Données hébergées en Europe
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER QVT BOX */}
      <Footer />
    </div>
  );
}
