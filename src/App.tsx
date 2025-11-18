// src/pages/Index.tsx
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  BarChart3,
  Brain,
  Mic,
  Users
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] via-[#EAF4F3] to-[#E9F9F5] overflow-hidden text-[#212121] font-sans">
      <Navigation />

      {/* ======================= HERO ======================= */}
      <section className="relative pt-28 pb-28 px-6">
        {/* Halo central */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[160px] opacity-50 animate-breathe -z-10" />

        {/* Lucioles */}
        <div className="absolute inset-0 -z-10">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="firefly absolute w-2 h-2 bg-secondary/70 rounded-full"
              style={{
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <img
            src="/logo-qvt.jpeg"
            alt="QVT Box"
            className="w-20 h-20 mx-auto mb-6 rounded-full shadow-xl"
          />

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#5B4B8A] via-[#4FD1C5] to-[#5B4B8A] bg-clip-text text-transparent">
            La nouvelle façon d’écouter vos équipes
          </h1>

          <p className="text-lg md:text-2xl text-[#212121]/70 mt-6 max-w-3xl mx-auto leading-relaxed">
            60 % des signaux de burn-out passent inaperçus.
            <br />
            QVT Box + ZÉNA IA Emotionnelle = prévention, écoute et bienveillance au quotidien.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            {/* 🔥 CORRECTION ICI : AUCUN <Link> vers domaine externe */}
            <a
              href="https://zena.qvtbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white shadow-lg hover:scale-[1.05] transition-all"
            >
              <Mic className="w-5 h-5" />
              Parler à ZÉNA maintenant
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary/10 transition-all"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= SECTION ZÉNA ======================= */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5B4B8A]/10 to-transparent blur-3xl opacity-30 -z-10" />

        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ZÉNA — L’IA émotionnelle de vos équipes
          </h2>

          <p className="text-lg text-[#212121]/70 max-w-3xl mx-auto mb-10">
            Une intelligence émotionnelle qui écoute, analyse, accompagne et prévient les risques,
            même lorsque les salariés ne sont pas au bureau.
          </p>

          <div className="rounded-3xl overflow-hidden shadow-xl border border-primary/20 mx-auto max-w-xl">
            <video
              src="/zena-avatar.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-[380px] object-cover"
            />
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { icon: Brain, title: "Analyse émotionnelle", text: "ZÉNA détecte les signaux faibles et donne une météo émotionnelle fiable." },
              { icon: ShieldCheck, title: "Prévention RPS", text: "Détection précoce des risques, burn-out, surcharge, conflits." },
              { icon: Users, title: "Écoute sans jugement", text: "Une présence bienveillante pour tous les salariés, 24/7." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="max-w-xs text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-[#212121]/70 mt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= SECTION QVT BOX ======================= */}
      <section className="py-20 px-6 bg-white/60 backdrop-blur">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Une solution phygitale pour mieux vivre au travail
          </h2>

          <p className="text-lg text-[#212121]/70 max-w-3xl mx-auto mb-10">
            Notre plateforme SaaS analyse.  
            ZÉNA écoute.  
            Les box bien-être agissent.  
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: BarChart3, title: "Tableau de bord RH", text: "Une vision claire des tendances émotionnelles et des risques RPS." },
              { icon: HeartHandshake, title: "Box bien-être", text: "40 box thématiques créées pour agir concrètement sur le bien-être." },
              { icon: Sparkles, title: "Support au quotidien", text: "Messages d’espoir, routines bien-être, micro-pauses guidées." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 bg-white rounded-xl shadow-md border border-primary/10 hover:shadow-xl transition-all">
                <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-[#212121]/70">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/saas"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-all"
            >
              Découvrir la licence SaaS
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= CTA FINAL ======================= */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Vos équipes méritent mieux. Votre entreprise aussi.
        </h2>

        <p className="text-lg opacity-90 max-w-3xl mx-auto mb-10">
          Commencez dès aujourd’hui avec QVT Box + ZÉNA, l’IA émotionnelle la plus bienveillante du marché.
        </p>

        <Link
          to="/contact"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 hover:bg-white/20 transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Prendre contact avec notre équipe
        </Link>
      </section>

      <Footer />
    </div>
  );
}
