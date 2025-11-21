// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";

export default function Index() {
  return (
    <div className="bg-[#0B0907] text-[#FDF7E8] min-h-screen flex flex-col">
      <Navigation />

      {/* =============== HERO 3D ZÉNA =============== */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* halo global dans le fond */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-[#FBE6B5]/40 via-transparent to-transparent blur-3xl opacity-80" />
            <div className="absolute bottom-[-30%] right-[-10%] h-[520px] w-[520px] rounded-full bg-gradient-to-tl from-[#FAD7A0]/30 via-transparent to-transparent blur-3xl opacity-80" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 md:px-10 lg:px-14 pt-24 pb-16 lg:pb-24 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 items-center">
            {/* Texte hero */}
            <div className="space-y-6">
              <p className="uppercase tracking-[0.22em] text-[11px] text-[#D8C8AA]/80">
                QVT BOX PRÉSENTE
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-[#FDF7E8]">
                ZÉNA,{" "}
                <span className="italic text-[#F6D38D]">
                  la voix qui veille sur vos équipes
                </span>
              </h1>

              <p className="text-sm md:text-base text-[#E5D7BF]/90 leading-relaxed max-w-xl">
                Une IA émotionnelle qui écoute les salariés, capte les « petits
                ça va » qui cachent une vraie fatigue, et restitue une météo
                émotionnelle anonyme à vos RH. Sans fliquer. Sans stigmatiser.
                Juste pour intervenir à temps.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/zena-chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F6D38D] text-[#1B130A] text-sm font-medium shadow-[0_14px_40px_rgba(250,205,120,0.35)] hover:bg-[#FFE2A8] transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tester la voix de ZÉNA
                </Link>

                <Link
                  to="/onboarding-company"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#F6D38D]/60 text-[#FDF7E8] text-sm hover:bg-white/5 backdrop-blur-sm transition"
                >
                  Créer mon espace RH
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-xs text-[#C2B49D]/90 pt-4">
                👨‍👩‍👧{" "}
                <Link
                  to="/zena-family"
                  className="underline-offset-4 underline decoration-[#F6D38D]/70 hover:text-[#F6D38D]"
                >
                  ZÉNA Famille & Ados
                </Link>{" "}
                pour les maisons où « ça va » veut tout dire.
              </p>
            </div>

            {/* Bloc visuel Zéna : halo 3D + visage doré */}
            <div className="relative h-[420px] md:h-[460px]">
              {/* carte 3D */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-[#141013] via-[#06030A] to-[#0C090E] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.65)] overflow-hidden">
                <div className="absolute inset-0 opacity-70">
                  <ZenaFaceParticles />
                </div>

                {/* visage de Zéna en médaillon, légèrement au-dessus des particules */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden shadow-[0_0_60px_rgba(246,211,141,0.6)]">
                    {/* halo circulaire */}
                    <div className="absolute inset-[-16%] rounded-full bg-radial from-[#FCE3AE] via-transparent to-transparent opacity-80" />
                    {/* portrait */}
                    <img
                      src="/zena-face.png"
                      alt="ZÉNA, visage lumineux"
                      className="relative z-10 w-full h-full object-cover"
                    />
                    {/* voile doré sur le visage */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#7A5525]/40 via-transparent to-transparent mix-blend-soft-light" />
                  </div>
                </div>

                {/* petit texte en bas de la carte */}
                <div className="absolute bottom-5 left-6 right-6 text-xs text-[#D8C8AA]/80 flex items-center justify-between">
                  <span>Météo émotionnelle en temps réel</span>
                  <span className="opacity-70">100% anonyme côté salarié</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============== SECTION : COMMENT ÇA MARCHE =============== */}
        <section className="bg-[#0F0D0B] border-t border-[#2B2116] py-20 px-6 md:px-10 lg:px-14">
          <div className="max-w-5xl mx-auto">
            <p className="uppercase tracking-[0.22em] text-[11px] text-[#D1C0A3]/80 mb-3">
              Écouter • Comprendre • Protéger
            </p>

            <h2 className="text-2xl md:text-3xl font-light text-[#FDF7E8] mb-4">
              Comment ZÉNA agit dans l’entreprise ?
            </h2>

            <p className="max-w-2xl text-sm md:text-base text-[#D9CCB7]/90">
              ZÉNA capte les nuances du quotidien : fatigue diffuse, injustice
              ressentie, charge mentale qui grimpe. Elle transforme ces signaux
              faibles en une vision claire pour vos RH, sans jamais livrer de
              nom.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-14">
              <div className="bg-[#18120D] border border-[#312419] rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E5D7BF]/70 mb-2">
                  01 • Elle écoute
                </p>
                <h3 className="text-lg text-[#FDF7E8] mb-2">
                  Des « ça va » pris au sérieux
                </h3>
                <p className="text-sm text-[#D9CCB7]/90">
                  Le salarié parle à l’écrit ou à la voix. ZÉNA reformule,
                  sécurise l’échange et mesure l’intensité émotionnelle derrière
                  les mots.
                </p>
              </div>

              <div className="bg-[#18120D] border border-[#312419] rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E5D7BF]/70 mb-2">
                  02 • Elle analyse
                </p>
                <h3 className="text-lg text-[#FDF7E8] mb-2">
                  Signaux faibles, tendances fortes
                </h3>
                <p className="text-sm text-[#D9CCB7]/90">
                  Charge de travail, tensions d’équipe, sentiment d’injustice,
                  isolement… Les signaux sont agrégés, lissés, anonymisés au
                  niveau équipe / service.
                </p>
              </div>

              <div className="bg-[#18120D] border border-[#312419] rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                <p className="text-xs uppercase tracking-[0.18em] text-[#E5D7BF]/70 mb-2">
                  03 • Elle éclaire
                </p>
                <h3 className="text-lg text-[#FDF7E8] mb-2">
                  Une météo émotionnelle actionnable
                </h3>
                <p className="text-sm text-[#D9CCB7]/90">
                  Vos RH voient où ça chauffe, où ça décroche, et ce qui
                  s’améliore. Avec des alertes précoces pour agir avant le
                  burn-out ou la rupture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =============== SECTION : MINI DÉMO / DIALOGUE =============== */}
        <section className="bg-[#0F0D0B] border-t border-[#2B2116] py-20 px-6 md:px-10 lg:px-14">
          <div className="max-w-5xl mx-auto grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
            <div className="space-y-4">
              <p className="uppercase tracking-[0.22em] text-[11px] text-[#D1C0A3]/80">
                LUI PARLER POUR DE VRAI
              </p>
              <h2 className="text-2xl md:text-3xl font-light text-[#FDF7E8]">
                Testez comment ZÉNA parle à vos équipes
              </h2>
              <p className="text-sm md:text-base text-[#D9CCB7]/90">
                Une interface simple, en mode chat. Vous lui confiez une
                situation réelle — surcharge, conflit, doute — et vous voyez
                comment elle répond, rassure et reformule.
              </p>

              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F6D38D] text-[#1B130A] text-sm font-medium shadow-[0_14px_40px_rgba(250,205,120,0.35)] hover:bg-[#FFE2A8] transition"
              >
                Ouvrir la démo de ZÉNA
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* mini fenêtre de chat factice pour le visuel */}
            <div className="bg-[#161219] rounded-2xl border border-[#3C2A1C] shadow-[0_18px_50px_rgba(0,0,0,0.65)] p-5 text-xs text-[#F8F0DE] space-y-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#D1C0A3]/80">
                EXEMPLE DE DIALOGUE
              </div>

              <div className="space-y-2">
                <div className="inline-flex max-w-full rounded-2xl bg-[#27202F] px-3 py-2">
                  Honnêtement… je me sens épuisé, mais j’ai peur de le dire à ma
                  hiérarchie.
                </div>
                <div className="inline-flex max-w-full rounded-2xl bg-[#F6D38D] text-[#23160B] px-3 py-2 ml-auto">
                  Merci de me le confier. On va poser ça ensemble. Sur une
                  échelle de 1 à 10, où placerais-tu ta fatigue aujourd’hui ?
                </div>
                <div className="inline-flex max-w-full rounded-2xl bg-[#27202F] px-3 py-2">
                  8… Je tiens encore, mais je n’y arrive plus sereinement.
                </div>
                <div className="inline-flex max-w-full rounded-2xl bg-[#F6D38D] text-[#23160B] px-3 py-2 ml-auto">
                  D’accord. Ce que tu ressens est légitime. On peut explorer
                  ce qui t’épuise le plus, et voir ensemble les pistes d’action
                  possibles.
                </div>
              </div>

              <p className="pt-2 text-[10px] text-[#B9AA93]/85">
                Les échanges restent anonymes. ZÉNA ne remonte jamais
                d’informations nominatives aux RH.
              </p>
            </div>
          </div>
        </section>

        {/* =============== CTA FINAL =============== */}
        <section className="bg-[#050404] py-20 text-center border-t border-[#2B2116]">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <p className="uppercase tracking-[0.22em] text-[11px] text-[#D1C0A3]/80 mb-3">
              LE COUP DE POUCE ZÉNA
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-[#FDF7E8] mb-4">
              Prêts à écouter vos équipes autrement ?
            </h2>
            <p className="text-sm md:text-base text-[#D9CCB7]/90 mb-8">
              QVT Box + ZÉNA, c’est une façon sobre, réaliste et souveraine de
              prendre soin de vos salariés, sans gadget ni injonction au
              bonheur.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#F6D38D] text-[#1B130A] text-sm font-medium shadow-[0_14px_40px_rgba(250,205,120,0.35)] hover:bg-[#FFE2A8] transition"
              >
                Prendre contact
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#F6D38D]/70 text-[#FDF7E8] text-sm hover:bg-white/5 transition"
              >
                Voir la démo en live
              </Link>
            </div>

            <p className="text-[11px] text-[#B9AA93]/80 mt-6">
              « Sortez de votre bulle, on veille sur vous. »
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
