// src/pages/Index.tsx

import { Link } from "react-router-dom";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="bg-[#050608] text-[#FDF9F0] min-h-screen flex flex-col">
      {/* NAV */}
      <Navigation />

      <main className="flex-1">
        {/* =============== HERO ZÉNA x QVT BOX =============== */}
        <section className="relative min-h-[90vh] overflow-hidden">
          {/* Image de fond fissures de lumière */}
          <img
            src="/engagements-hero.jpg"
            alt="Lumière dans les cicatrices du quotidien"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />

          {/* Voile sable doré */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#050608] via-[#131012]/70 to-[#F7F2E6]/40" />

          {/* Halo central */}
          <div className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.75),rgba(248,234,209,0.1),rgba(0,0,0,0))] blur-3xl opacity-70" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-24 flex flex-col lg:flex-row items-end gap-16">
            {/* TEXTE HERO */}
            <div className="flex-1 max-w-xl">
              <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-4">
                QVT BOX • IA Émotionnelle Souveraine
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-[#FDF9F0]">
                Faire jaillir la lumière
                <br />
                <span className="text-[#C3A878]">
                  des cicatrices du quotidien.
                </span>
              </h1>

              <p className="mt-6 text-sm md:text-base text-[#E5D7BF]/90 leading-relaxed">
                ZÉNA est la voix attentive de QVT Box. 
                Elle écoute les émotions faibles, repère les signaux de fatigue
                et restitue une météo émotionnelle anonyme aux RH. 
                Pour que chaque « ça va » devienne une vraie réponse.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-6 text-[11px] uppercase tracking-[0.16em] text-[#EADCC7]/80">
                <span className="px-3 py-1 rounded-full border border-[#EADCC7]/40 bg-black/20">
                  Écoute émotionnelle 24/7
                </span>
                <span className="px-3 py-1 rounded-full border border-[#EADCC7]/40 bg-black/20">
                  Données anonymisées & souveraines
                </span>
                <span className="px-3 py-1 rounded-full border border-[#EADCC7]/40 bg-black/20">
                  Prévention du burn-out
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <Link
                  to="/zena-chat"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] text-[#1B1A18] text-sm font-medium shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:bg-[#D9C7A4] transition"
                >
                  <Mic className="w-4 h-4" />
                  Parler à ZÉNA maintenant
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/onboarding-company"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7]/60 text-[#FDF9F0] text-sm hover:bg-white/5 backdrop-blur-sm transition"
                >
                  Créer mon espace RH
                </Link>
              </div>

              {/* Ligne de confiance */}
              <div className="mt-8 text-xs text-[#C9B89C]/80">
                Déployable en France, Belgique & Suisse • Compatible SSO • 
                Intégration possible à vos outils existants.
              </div>
            </div>

            {/* AVATAR ZÉNA + APERÇU CHAT */}
            <div className="flex-1 flex justify-end">
              <div className="relative w-full max-w-sm">
                {/* Cercle lumineux ZÉNA */}
                <div className="relative mx-auto h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle_at_20%_0%,#FFFFFF,rgba(255,255,255,0)_55%),radial-gradient(circle_at_80%_100%,#F5D79A,rgba(0,0,0,0)_55%),radial-gradient(circle_at_0%_100%,#C3A878,rgba(0,0,0,0)_60%)] shadow-[0_0_60px_rgba(243,215,160,0.7)] flex items-center justify-center overflow-hidden border border-white/35">
                  <img
                    src="/zena-face.png"
                    alt="Visage lumineux de ZÉNA"
                    className="w-[88%] h-[88%] object-cover rounded-full mix-blend-screen"
                  />
                </div>

                {/* Carte de dialogue flottante */}
                <div className="absolute -bottom-6 right-0 left-0 mx-auto w-full max-w-[320px]">
                  <div className="rounded-3xl bg-[#0D0D10]/80 border border-white/12 backdrop-blur-xl px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
                    <div className="flex items-center gap-2 mb-3 text-[11px] text-[#E5D7BF]/80 uppercase tracking-[0.16em]">
                      <Sparkles className="w-3 h-3 text-[#C3A878]" />
                      <span>Météo émotionnelle en direct</span>
                    </div>

                    <div className="space-y-3 text-[13px]">
                      <div className="flex gap-2 items-start">
                        <div className="mt-1 h-6 w-6 rounded-full bg-[#C3A878]/20 border border-[#C3A878]/60" />
                        <div className="px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-[#FDF9F0]">
                          Franchement… je commence à me sentir épuisé, mais je
                          n’ose pas le dire.
                        </div>
                      </div>
                      <div className="flex gap-2 items-start justify-end">
                        <div className="px-3 py-2 rounded-2xl bg-[#C3A878] text-[#1B1A18] max-w-[80%]">
                          Merci de me le confier. On va poser ça ensemble.
                          <br />
                          <span className="text-xs opacity-80">
                            Sur une échelle de 1 à 10, ton niveau de fatigue
                            émotionnelle serait où aujourd’hui ?
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-[#C9B89C]/80">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1" />
                      Vos mots restent anonymes. ZÉNA ne remonte que des
                      tendances, jamais de noms.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============== SECTION COMMENT ÇA MARCHE =============== */}
        <section className="py-20 bg-[#FAF6EE] text-[#1B1A18]">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
              Écouter • Comprendre • Agir sans stigmatiser
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-3">
              Comment ZÉNA agit dans votre entreprise ?
            </h2>
            <p className="max-w-2xl text-sm md:text-base text-[#6F6454]">
              ZÉNA ne remplace ni les managers, ni les RH. 
              Elle donne une voix à ce qui ne se dit pas : les micro-tensions,
              la fatigue qui s’installe, la sensation d’injustice, la charge
              mentale silencieuse.
            </p>

            <div className="grid md:grid-cols-3 gap-10 mt-14">
              <div className="space-y-3">
                <div className="h-9 w-9 rounded-full bg-[#C3A878]/20 border border-[#C3A878]/60 flex items-center justify-center text-xs text-[#C3A878]">
                  01
                </div>
                <h3 className="text-lg font-medium text-[#2F2920]">
                  Elle écoute sans juger
                </h3>
                <p className="text-sm text-[#6F6454]">
                  Le salarié parle à l’écrit ou à la voix, sur son temps
                  choisi. ZÉNA reformule, sécurise l’échange et crée un espace
                  où l’on peut dire « ça ne va pas » sans se justifier.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-9 w-9 rounded-full bg-[#78A085]/15 border border-[#78A085]/60 flex items-center justify-center text-xs text-[#48745C]">
                  02
                </div>
                <h3 className="text-lg font-medium text-[#2F2920]">
                  Elle analyse les signaux faibles
                </h3>
                <p className="text-sm text-[#6F6454]">
                  Fatigue émotionnelle, perte de sens, charge invisible,
                  tensions relationnelles : les signaux sont agrégés, scorés et
                  traduits en indicateurs compréhensibles.
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-9 w-9 rounded-full bg-[#5B4B8A]/12 border border-[#5B4B8A]/50 flex items-center justify-center text-xs text-[#5B4B8A]">
                  03
                </div>
                <h3 className="text-lg font-medium text-[#2F2920]">
                  Elle éclaire les décisions
                </h3>
                <p className="text-sm text-[#6F6454]">
                  Les RH et managers reçoivent une météo émotionnelle, des
                  tendances par équipe, des alertes précoces et des pistes
                  d’actions concrètes, sans jamais pointer une personne.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =============== SECTION UNIVERS =============== */}
        <section className="py-20 bg-[#F2EBDE]">
          <div className="max-w-5xl mx-auto px-6 md:px-10">
            <p className="uppercase tracking-[0.18em] text-xs text-[#8D7B61] mb-3">
              Un même cœur, plusieurs univers
            </p>
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-[#1B1A18]">
              ZÉNA veille sur les salariés, les parents et les ados.
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Entreprise */}
              <Link
                to="/zena-entreprise"
                className="group rounded-3xl bg-white/70 backdrop-blur-md border border-[#D8C9B3] p-5 hover:-translate-y-1 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium text-[#1B1A18] mb-2">
                    ZÉNA Entreprise
                  </h3>
                  <p className="text-sm text-[#6F6454] mb-4">
                    Météo émotionnelle, signaux de burnout, charge mentale :
                    une vigie discrète au cœur de vos équipes.
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#8D7B61] flex items-center gap-2">
                  Découvrir
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              {/* Famille */}
              <Link
                to="/zena-family"
                className="group rounded-3xl bg-white/70 backdrop-blur-md border border-[#D8C9B3] p-5 hover:-translate-y-1 hover:shadow-xl transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium text-[#1B1A18] mb-2">
                    ZÉNA Famille & Ados
                  </h3>
                  <p className="text-sm text-[#6F6454] mb-4">
                    Une bulle pour dire « en vrai, ça ne va pas trop » entre
                    parents, ados et grands-parents, sans filtre et sans
                    culpabilité.
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#8D7B61] flex items-center gap-2">
                  Explorer
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>

              {/* QVT Box */}
              <Link
                to="/professional-saas"
                className="group rounded-3xl bg-[#1B1A18] text-[#FDF9F0] border border-[#F2E1BF]/40 p-5 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.6)] transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Plateforme QVT Box
                  </h3>
                  <p className="text-sm text-[#F2E1BF]/90 mb-4">
                    Tableaux de bord RH, indicateurs émotionnels, catalogue de
                    QVT Box physiques et digitales, le tout dans un seul
                    écosystème.
                  </p>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] flex items-center gap-2 text-[#F2E1BF]">
                  Voir la solution complète
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* =============== CTA FINAL =============== */}
        <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center">
          <div className="max-w-3xl mx-auto px-6 md:px-10">
            <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
              Le coup de pouce ZÉNA
            </p>

            <h2 className="text-2xl md:text-3xl font-light mb-6">
              Prêts à écouter vos équipes autrement ?
            </h2>

            <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10">
              Nous ne promettons pas un monde sans fatigue.
              Nous vous donnons un radar émotionnel, discret, humain, pour agir
              avant que les équipes ne s’effondrent.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] text-[#151515] hover:bg-[#D9C7A4] transition"
              >
                Prendre contact
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
              >
                Tester ZÉNA en direct
              </Link>
            </div>

            <p className="mt-6 text-xs text-[#C9B89C]/80">
              « Sortez de votre bulle, on veille sur vous. »
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
