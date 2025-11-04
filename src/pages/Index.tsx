import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 🧩 Ces deux composants doivent exister dans /src/components
import ZenaAvatar from "@/components/ZenaAvatar";
import MagicAmbiance from "@/components/MagicAmbiance";

import { Heart, Shield, TrendingUp, Brain, Lock, BarChart3 } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-y-auto relative">
      {/* 🌫️ Ambiance magique */}
      <MagicAmbiance intensity="medium" />

      {/* ✨ Halos décoratifs */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/15 rounded-full blur-[140px] -z-10 animate-breathe-slow" />

      {/* ==== HERO ==== */}
      <header className="container mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white border-0">
            Intelligence Émotionnelle IA
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
            ZÉNA écoute vos équipes avant qu’il ne soit trop tard
          </h1>

          <p className="text-xl md:text-2xl text-[#212121]/80 mb-8 leading-relaxed">
            60 % des signaux de burn-out passent inaperçus jusqu’à l’arrêt maladie.
            <br />
            ZÉNA détecte les émotions faibles et restaure la confiance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/zena-chat">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all shadow-xl"
              >
                🎙️ Essayer ZÉNA gratuitement
              </Button>
            </Link>
            <Link to="/onboarding-company">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-[#4FD1C5]"
              >
                Créer mon espace RH
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#212121]/60">
            Aucune carte bancaire requise • Essai gratuit illimité
          </p>
        </motion.div>

        {/* 👩‍💻 Avatar ZÉNA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12"
        >
          <ZenaAvatar isSpeaking={false} emotion="positive" />
        </motion.div>
      </header>

      {/* ==== PROBLÈME ==== */}
      <section className="bg-white/70 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#005B5F]">
            Le coût du silence émotionnel
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { stat: "60 %", text: "des burn-outs passent inaperçus" },
              { stat: "45 000 €", text: "coût moyen d’un burn-out" },
              { stat: "+30 %", text: "d’absentéisme sans prévention" },
            ].map(({ stat, text }) => (
              <Card key={stat}>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-[#5B4B8A]">{stat}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==== SOLUTION ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
            3 piliers pour prévenir, pas guérir
          </h2>
          <p className="text-muted-foreground mb-12">Une approche proactive du bien-être</p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Brain className="w-12 h-12 text-[#4FD1C5] mb-4 mx-auto" />
                <CardTitle>Écoute proactive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ZÉNA écoute les émotions et détecte les signaux faibles avec empathie.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-[#5B4B8A] mb-4 mx-auto" />
                <CardTitle>Analyse RPS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Scoring des risques psycho-sociaux et alertes précoces pour les RH.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-[#4FD1C5] mb-4 mx-auto" />
                <CardTitle>Solutions concrètes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recommandations personnalisées et box bien-être adaptées à chaque profil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== GARANTIES ==== */}
      <section className="py-16 bg-[#F9FAFA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#005B5F]">
            Vos garanties
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <Lock className="w-12 h-12 text-[#4FD1C5] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Anonymat garanti</h3>
              <p className="text-sm text-muted-foreground">
                Données confidentielles, jamais visibles individuellement.
              </p>
            </div>
            <div>
              <Shield className="w-12 h-12 text-[#5B4B8A] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Conforme RGPD</h3>
              <p className="text-sm text-muted-foreground">
                Hébergement France 🇫🇷, chiffrement et droit à l’oubli.
              </p>
            </div>
            <div>
              <TrendingUp className="w-12 h-12 text-[#4FD1C5] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">ROI prouvé</h3>
              <p className="text-sm text-muted-foreground">
                -30 % d’absentéisme, +25 % d’engagement en 6 mois.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==== CTA ==== */}
      <section className="py-20 bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Prêt à écouter vos équipes ?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Commencez gratuitement dès aujourd’hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/zena-chat">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                🎙️ Essayer ZÉNA maintenant
              </Button>
            </Link>
            <Link to="/onboarding-company">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10"
              >
                Créer mon espace RH
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="py-12 bg-[#005B5F]/5 text-center text-sm text-[#6b7280]">
        <p>© 2025 QVT Box — Made with 💜 en Bretagne</p>
      </footer>
    </div>
  );
}
