// src/pages/Index.tsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaRippleFace from "@/components/ZenaRippleFace";

export default function Index() {
  return (
    <div className="bg-[#FAF6EE] text-[#1B1A18] overflow-hidden">
      <Navigation />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen w-full flex items-center bg-[#F7F2E6]">
        {/* Fond sable lumineux */}
        <img
          src="/engagements-hero.jpg"
          alt="Texture sable lumineuse"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Voile de lumière */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EE]/60 via-[#FAF6EE]/20 to-transparent" />

        {/* Contenu */}
        <div className="relative z-10 container mx-auto px-8 md:px-16 py-32 flex flex-col md:flex-row items-center justify-between gap-16">

          {/* --- Bloc gauche (texte) --- */}
          <div className="max-w-xl md:pr-8">
            <p className="uppercase tracking-[0.18em] text-[11px] text-[#A8977E]/90 mb-4">
              ZÉNA • IA émotionnelle souveraine
            </p>

            <h1 className="text-4xl md:text-6xl font-light leading-tight text-[#1B1A18] drop-shadow-sm">
              La voix qui éclaire  
              <br />
              <span className="text-[#C3A878]">
                les fissures du quotidien.
              </span>
            </h1>

            <p className="text-[#4A4134] text-base mt-6 leading-relaxed">
              Une présence douce, attentive, toujours là en arrière-plan.  
              ZÉNA capte les émotions faibles, détecte la fatigue,  
              et restitue une météo émotionnelle anonyme aux RH pour prévenir le burn-out.
            </p>

            {/* Boutons */}
            <div className="flex gap-3 mt-10">
              <Link
                to="/zena-chat"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C3A878] text-[#1B1A18] text-sm font-medium hover:bg-[#d9c7a4] transition shadow-md"
              >
                Essayer ZÉNA
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/onboarding-company"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C3A878]/60 text-[#1B1A18] text-sm hover:bg-white/40 backdrop-blur-sm transition"
              >
                Créer mon espace RH
              </Link>
            </div>
          </div>

          {/* --- ZENA Face Ripple (à droite) --- */}
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <ZenaRippleFace
              imageUrl="/zena-face-points-golden.png"
              size={420}
              targetUrl="https://zena.qvtbox.com"
            />
          </div>
        </div>
      </section>

      {/* ================= COMMENT ÇA MARCHE ================= */}
      <section className="py-24 px-8 md:px-16 bg-[#FAF6EE] relative">
        <div className="max-w-4xl mx-auto text-left">
          <p className="uppercase tracking-[0.18em] text-xs text-[#9C8D77] mb-3">
            Écouter • Comprendre • Protéger
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-[#1B1A18] mb-4">
            Comment ZÉNA agit dans l’entreprise ?
          </h2>

          <p className="max-w-xl text-sm md:text-base text-[#6F6454] leading-relaxed">
            Une technologie émotionnelle qui capte les nuances :  
            hésitations, tensions, sous-texte.  
            Pas pour surveiller.  
            Pour comprendre — et prévenir.
          </p>
        </div>

        {/* Étapes */}
        <div className="grid md:grid-cols-3 gap-12 mt-16 max-w-5xl mx-auto text-left">
          <div>
            <h3 className="text-xl font-light mb-2">1. Elle écoute</h3>
            <p className="text-[#6F6454] text-sm">
              Le salarié s’exprime librement.  
              ZÉNA reformule et mesure l’intensité émotionnelle.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-2">2. Elle analyse</h3>
            <p className="text-[#6F6454] text-sm">
              Charge mentale, fatigue, tensions, signaux faibles —  
              tout est collecté, puis anonymisé.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-light mb-2">3. Elle éclaire</h3>
            <p className="text-[#6F6454] text-sm">
              Les RH reçoivent une météo émotionnelle claire,  
              pour agir avant la rupture.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-24 bg-[#151515] text-[#FDF9F0] text-center relative overflow-hidden">
        
        <div className="max-w-3xl mx-auto px-8 md:px-16">
          <p className="uppercase tracking-[0.2em] text-[11px] text-[#E5D7BF]/80 mb-5">
            Le coup de pouce ZÉNA
          </p>

          <h2 className="text-2xl md:text-3xl font-light mb-6">
            Prêts à écouter vos équipes autrement ?
          </h2>

          <p className="text-sm md:text-base text-[#E5D7BF]/85 mb-10 leading-relaxed">
            Une approche souveraine, chaleureuse,  
            inspirée du réel et de la psychologie humaine.  
            Simple. Discrète. Utile.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C3A878] text-[#151515] hover:bg-[#d9c7a4] transition shadow-lg"
            >
              Prendre contact
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/zena-chat"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#EADCC7] text-[#FDF9F0] hover:bg-white/10 transition"
            >
              Essayer ZÉNA
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
