// src/pages/Index.tsx

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  BriefcaseBusiness,
  MessageCircle,
  Users,
} from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaFaceParticles from "@/components/ZenaFaceParticles";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#E7D4B9] text-[#1B1A18] flex flex-col">
      {/* Bandeau navigation QVT Box / ZÉNA */}
      <Navigation />

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 md:py-16">
        <section className="relative w-full max-w-6xl rounded-[32px] bg-[#FFF9F0]/95 border border-white/70 shadow-[0_40px_120px_rgba(124,88,36,0.45)] overflow-hidden">
          {/* halo de fond façon Sandbar */}
          <div className="pointer-events-none absolute inset-[-30%] bg-[radial-gradient(circle_at_10%_0%,#FFFDF7_0%,#F7E6C9_35%,#E7CFAD_60%,#D7BFA0_80%,#C5A98C_100%)] opacity-90" />
          <div className="relative grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] px-6 md:px-12 py-10 md:py-14 items-center">
            {/* Texte à gauche */}
            <div className="space-y-6 md:space-y-7">
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#7A6A52]/80">
                QVT BOX PRÉSENTE
              </p>

              <div className="space-y-2">
                <h1 className="text-[2.2rem] md:text-[2.6rem] leading-snug font-semibold text-[#1F1307]">
                  ZÉNA,
                  <span className="font-normal italic text-[#C49A4D]">
                    {" "}
                    la voix qui veille sur vos équipes
                  </span>
                </h1>

                <p className="text-sm md:text-base text-[#5A4C3A] font-medium">
                  Une IA émotionnelle qui écoute, rassure et alerte avant le
                  burn-out.
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-[15px] text-[#5F513F] leading-relaxed max-w-xl">
                <p>
                  ZÉNA prend des nouvelles en douceur, détecte la fatigue
                  invisible et transforme des milliers de « ça va » automatiques
                  en une véritable météo émotionnelle pour vos RH.
                </p>
                <p>
                  Sans stigmatiser, sans fliquer. Juste pour intervenir à temps
                  et prendre soin de celles et ceux qui tiennent la maison.
                </p>
              </div>

              {/* Boutons principaux */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://qvtbox.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C89A53] to-[#F7C97A] text-[#3A2A13] text-sm font-semibold px-5 py-2.5 shadow-[0_14px_30px_rgba(200,154,83,0.45)] hover:shadow-[0_18px_40px_rgba(200,154,83,0.6)] hover:brightness-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Découvrir QVT Box
                </a>

                <a
                  href="mailto:contact@qvtbox.com?subject=Demande%20de%20d%C3%A9mo%20Z%C3%89NA%20Entreprise"
                  className="inline-flex items-center gap-2 rounded-full border border-[#C49A4D]/40 bg-white/60 backdrop-blur text-sm font-semibold px-5 py-2.5 text-[#3A2A13] hover:bg-white hover:border-[#C49A4D]/70 transition-all"
                >
                  <BriefcaseBusiness className="w-4 h-4" />
                  Demander une démo entreprise
                </a>

                <a
                  href="#tester-zena"
                  className="inline-flex items-center gap-2 rounded-full bg-[#F8EFE0] text-sm font-semibold px-4 py-2.5 text-[#5B4732] border border-[#E0C9A4]/70 hover:bg-[#FFF7EA] transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tester comment ZÉNA parle
                </a>
              </div>

              {/* Lien discret Famille / Ados */}
              <div className="pt-2 text-[13px] text-[#7A6A52] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C49A4D]" />
                <a
                  href="https://zena-family.qvtbox.com"
                  className="underline-offset-2 hover:underline"
                >
                  Découvrir aussi ZÉNA Famille & Ados – pour les maisons où « ça
                  va » veut tout dire.
                </a>
              </div>
            </div>

            {/* Bulle 3D ZÉNA à droite */}
            <div className="flex items-center justify-center">
              <ZenaFaceParticles />
            </div>
          </div>
        </section>
      </main>

      {/* Section "Tester comment ZÉNA parle" – placeholder scroll cible */}
      <section
        id="tester-zena"
        className="px-4 pb-10 md:pb-16 flex justify-center"
      >
        <div className="w-full max-w-4xl rounded-3xl bg-[#1F1309] text-[#FDF3E0] px-6 md:px-8 py-6 md:py-7 shadow-[0_26px_70px_rgba(0,0,0,0.55)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <p className="text-[11px] tracking-[0.24em] uppercase text-[#F1D7A1]/80">
                espace de test
              </p>
              <h2 className="text-lg md:text-xl font-medium">
                Écoutez comment ZÉNA prend des nouvelles.
              </h2>
              <p className="text-sm text-[#F6E4C6]/85">
                Ici, tu pourras bientôt parler directement avec ZÉNA (texte ou
                voix). On branchera ensuite ton moteur IA et ta logique métier.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#F5D091] text-[#352313] text-sm font-semibold px-5 py-2.5 shadow-[0_10px_26px_rgba(245,208,145,0.55)] hover:shadow-[0_14px_34px_rgba(245,208,145,0.7)] hover:brightness-105 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Prototype chat ZÉNA à intégrer
            </button>
          </div>
        </div>
      </section>

      {/* Footer global QVT Box (déjà existant) */}
      <Footer />
    </div>
  );
}
