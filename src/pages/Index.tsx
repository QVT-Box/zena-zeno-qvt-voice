import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, BriefcaseBusiness, MessageCircle, Users, Heart, Shield, Brain } from "lucide-react";
import { motion } from "framer-motion";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ZenaZoomIntro from "@/components/scroll-narrative/ZenaZoomIntro";
import FloatingZenaBubble from "@/components/scroll-narrative/FloatingZenaBubble";
import ScrollIndicator from "@/components/scroll-narrative/ScrollIndicator";
import { useScrollNarrative } from "@/hooks/useScrollNarrative";

export default function Index() {
  const navigate = useNavigate();
  const { currentSection, scrollProgress, isIntroComplete, skipIntro } = useScrollNarrative();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9F0] via-[#E7D4B9] to-[#FFF9F0] text-[#1B1A18]">
      {/* Intro zoom animation */}
      {!isIntroComplete && <ZenaZoomIntro onComplete={skipIntro} skipable={true} />}

      {/* Floating ZÉNA bubble */}
      {isIntroComplete && (
        <FloatingZenaBubble
          currentSection={currentSection}
          scrollProgress={scrollProgress}
          onClick={() => navigate("/zena-chat")}
        />
      )}

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <motion.section
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isIntroComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Animated halo background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F5D091_0%,transparent_70%)] opacity-30 animate-pulse" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <motion.p
            className="text-xs tracking-[0.3em] uppercase text-[#7A6A52]/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            QVT BOX PRÉSENTE
          </motion.p>

          <motion.h1
            className="text-5xl md:text-7xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-[#1F1307]">ZÉNA,</span>
            <br />
            <span className="bg-gradient-to-r from-[#C89A53] to-[#F7C97A] bg-clip-text text-transparent italic font-normal">
              la voix qui veille sur vos équipes
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#5A4C3A] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Une IA émotionnelle qui écoute, rassure et alerte avant le burn-out.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => navigate("/zena-chat")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C89A53] to-[#F7C97A] text-[#3A2A13] text-base font-semibold px-8 py-4 shadow-[0_20px_40px_rgba(200,154,83,0.5)] hover:shadow-[0_24px_50px_rgba(200,154,83,0.65)] hover:brightness-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Parler à ZÉNA maintenant
            </button>

            <a
              href="mailto:contact@qvtbox.com?subject=Demande%20de%20d%C3%A9mo%20Z%C3%89NA%20Entreprise"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#C49A4D]/40 bg-white/70 backdrop-blur text-base font-semibold px-8 py-4 text-[#3A2A13] hover:bg-white hover:border-[#C49A4D]/70 transition-all"
            >
              <BriefcaseBusiness className="w-5 h-5" />
              Demander une démo
            </a>
          </motion.div>

          <ScrollIndicator />
        </div>
      </motion.section>

      {/* Capacités Section */}
      <section id="capacites" className="py-24 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1307] mb-4">
              Les capacités de ZÉNA
            </h2>
            <p className="text-lg text-[#5A4C3A] max-w-2xl mx-auto">
              Une intelligence émotionnelle au service du bien-être de vos équipes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Écoute empathique 24/7",
                description: "ZÉNA est toujours disponible pour prendre des nouvelles, sans jugement.",
              },
              {
                icon: Brain,
                title: "Détection de burn-out",
                description: "Analyse les signaux faibles avant qu'il ne soit trop tard.",
              },
              {
                icon: Users,
                title: "Météo émotionnelle",
                description: "Vue d'ensemble du climat émotionnel de vos équipes.",
              },
              {
                icon: Sparkles,
                title: "Recommandations personnalisées",
                description: "Conseils adaptés à chaque situation individuelle.",
              },
              {
                icon: MessageCircle,
                title: "Analyse de sentiment",
                description: "Compréhension fine des émotions exprimées.",
              },
              {
                icon: Shield,
                title: "Alertes RH proactives",
                description: "Notification des situations à risque en toute confidentialité.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group p-8 rounded-3xl bg-white border-2 border-[#E7D4B9] hover:border-[#C89A53] hover:shadow-[0_20px_50px_rgba(200,154,83,0.3)] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <item.icon className="w-12 h-12 text-[#C89A53] mb-4" />
                <h3 className="text-xl font-semibold text-[#1F1307] mb-2">{item.title}</h3>
                <p className="text-[#5A4C3A]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section id="comment-ca-marche" className="py-24 px-4 bg-gradient-to-b from-white/50 to-[#FFF9F0]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1307] mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-[#5A4C3A]">
              Un processus simple et efficace pour prendre soin de vos équipes
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Conversation naturelle",
                description: "ZÉNA prend des nouvelles par texte ou voix, de manière douce et bienveillante.",
              },
              {
                step: "02",
                title: "Analyse émotionnelle",
                description: "L'IA analyse en temps réel le ton, les mots et le contexte pour comprendre l'état émotionnel.",
              },
              {
                step: "03",
                title: "Détection des signaux faibles",
                description: "Identification précoce des signes de fatigue, stress ou démotivation.",
              },
              {
                step: "04",
                title: "Alertes RH proactives",
                description: "Les RH reçoivent des alertes anonymisées pour intervenir avant le burn-out.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-8 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#C89A53] to-[#F7C97A] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#1F1307] mb-2">{item.title}</h3>
                  <p className="text-lg text-[#5A4C3A]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui Section */}
      <section id="pour-qui" className="py-24 px-4 bg-[#FFF9F0]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1F1307] mb-4">
              Pour qui ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="group p-10 rounded-3xl bg-gradient-to-br from-white to-[#F5D091]/20 border-2 border-[#C89A53] hover:shadow-[0_30px_60px_rgba(200,154,83,0.4)] transition-all"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <BriefcaseBusiness className="w-16 h-16 text-[#C89A53] mb-6" />
              <h3 className="text-3xl font-bold text-[#1F1307] mb-4">QVT Box pour les entreprises</h3>
              <ul className="space-y-3 text-lg text-[#5A4C3A] mb-8">
                <li>✓ Prévention des RPS</li>
                <li>✓ Tableaux de bord RH en temps réel</li>
                <li>✓ Conformité RGPD et confidentialité totale</li>
                <li>✓ Intervention précoce avant le burn-out</li>
              </ul>
              <a
                href="mailto:contact@qvtbox.com"
                className="inline-flex items-center gap-2 text-[#C89A53] font-semibold hover:gap-4 transition-all"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div
              className="group p-10 rounded-3xl bg-gradient-to-br from-white to-[#F5D091]/20 border-2 border-[#C89A53] hover:shadow-[0_30px_60px_rgba(200,154,83,0.4)] transition-all"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Users className="w-16 h-16 text-[#C89A53] mb-6" />
              <h3 className="text-3xl font-bold text-[#1F1307] mb-4">ZÉNA pour les familles</h3>
              <ul className="space-y-3 text-lg text-[#5A4C3A] mb-8">
                <li>✓ Écoute pour adolescents et enfants</li>
                <li>✓ Détection du mal-être précoce</li>
                <li>✓ Accompagnement des parents</li>
                <li>✓ Espace sécurisé et bienveillant</li>
              </ul>
              <a
                href="https://zena-family.qvtbox.com"
                className="inline-flex items-center gap-2 text-[#C89A53] font-semibold hover:gap-4 transition-all"
              >
                Découvrir ZÉNA Famille
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rencontrer ZÉNA Section */}
      <section id="rencontrer-zena" className="relative min-h-screen flex items-center justify-center px-4 py-24 overflow-hidden">
        {/* Portal effect background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F5D091_0%,#E7D4B9_50%,#FFF9F0_100%)] opacity-60 animate-pulse" />
        
        <motion.div
          className="relative z-10 text-center space-y-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-[#1F1307]">
            Prêt à rencontrer ZÉNA ?
          </h2>
          <p className="text-xl md:text-2xl text-[#5A4C3A]">
            Cliquez sur la bulle dorée ou sur le bouton ci-dessous pour commencer à parler avec ZÉNA
          </p>
          <motion.button
            onClick={() => navigate("/zena-chat")}
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#C89A53] to-[#F7C97A] text-white text-xl font-bold px-12 py-6 shadow-[0_30px_60px_rgba(200,154,83,0.6)] hover:shadow-[0_40px_80px_rgba(200,154,83,0.8)] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6" />
            Parler à ZÉNA maintenant
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
