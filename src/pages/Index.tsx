// src/pages/Index.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaRippleFace from "@/components/ZenaRippleFace";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="relative min-h-screen">
      <Navigation />

      {/* Background halo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fffaf2] via-[#f1e6d1] to-[#e8dac0] -z-10" />

      {/* HERO */}
      <section className="pt-32 pb-28 px-8 md:px-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Texte */}
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-[#1B1A18]">
            L’IA émotionnelle<br />
            qui <span className="text-[#C8A66A]">veille sur vous</span>
          </h1>

          <p className="text-[#4A4134] text-lg mt-6 leading-relaxed">
            ZÉNA détecte la fatigue invisible, fluidifie les relations
            et protège les équipes. Une présence douce, humaine et souveraine
            au cœur de votre organisation.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              to="/zena-chat"
              className="px-6 py-3 rounded-full bg-[#C8A66A] text-[#1B1A18] font-medium hover:bg-[#d8c6a0] transition inline-flex items-center gap-2"
            >
              Essayer ZÉNA <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/onboarding-company"
              className="px-6 py-3 rounded-full border border-[#C8A66A]/60 text-[#1B1A18] font-medium hover:bg-[#ffffff50]"
            >
              Espace RH
            </Link>
          </div>
        </div>

        {/* Image Zéna */}
        <div className="flex justify-center">
          <ZenaRippleFace
            imageUrl="/images/zena-face.png"
            size={380}
            targetUrl="/zena-chat"
          />
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-24 px-8 md:px-20 bg-white/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl text-[#1B1A18] font-light">
            Comment ZÉNA accompagne vos équipes ?
          </h2>

          <div className="grid md:grid-cols-3 gap-12 mt-16 text-left">
            <div>
              <h3 className="text-xl mb-2 text-[#1B1A18]">1. Elle écoute</h3>
              <p className="text-[#6F6454]">
                Conversations naturelles, écrites ou vocales, sans jugement.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-2 text-[#1B1A18]">2. Elle détecte</h3>
              <p className="text-[#6F6454]">
                Micro-signaux, fatigue mentale, irritabilité et tensions.
              </p>
            </div>

            <div>
              <h3 className="text-xl mb-2 text-[#1B1A18]">3. Elle protège</h3>
              <p className="text-[#6F6454]">
                Météo émotionnelle anonyme, alertes précoces et soutien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-28 bg-[#151515] text-[#FDF9F0] text-center">
        <h2 className="text-3xl font-light">
          Une nouvelle façon d’écouter le travail.
        </h2>

        <p className="text-[#E5D7BF]/85 mt-4 max-w-xl mx-auto">
          ZÉNA répare les liens, apaise les équipes et éclaire les décisions RH.
        </p>

        <div className="flex justify-center gap-4 mt-10">
          <Link
            to="/contact"
            className="px-6 py-3 bg-[#C3A878] text-[#151515] rounded-full hover:bg-[#d9c7a4] transition"
          >
            Prendre contact
          </Link>

          <Link
            to="/zena-chat"
            className="px-6 py-3 border border-[#EADCC7] rounded-full hover:bg-white/10"
          >
            Tester ZÉNA
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
