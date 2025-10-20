import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ZenaAvatar from "@/components/ZenaAvatar";
import MagicAmbiance from "@/components/MagicAmbiance";
import { CheckCircle2, Heart, Shield, TrendingUp, Users, Brain, Lock, BarChart3 } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121] font-sans overflow-y-auto relative">
      {/* Ambiance magique */}
      <MagicAmbiance intensity="medium" />
      
      {/* Halos d'ambiance */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe" aria-hidden="true" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/15 rounded-full blur-[140px] -z-10 animate-breathe-slow" aria-hidden="true" />

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
            ZÉNA écoute vos équipes avant qu'il ne soit trop tard
          </h1>
          
          <p className="text-xl md:text-2xl text-[#212121]/80 mb-8 leading-relaxed">
            60% des burn-outs passent inaperçus jusqu'à l'arrêt maladie.<br />
            ZÉNA détecte les signaux faibles de démotivation et agit en prévention.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/zena-chat">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] hover:opacity-90 transition-all shadow-xl">
                🎙️ Essayer ZÉNA gratuitement
              </Button>
            </Link>
            <Link to="/onboarding-company">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-[#4FD1C5]">
                Créer mon espace RH
              </Button>
            </Link>
          </div>

          <p className="text-sm text-[#212121]/60">
            Aucune carte bancaire requise • Essai gratuit illimité
          </p>
        </motion.div>

        {/* Avatar ZÉNA */}
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
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#005B5F]">
              Le coût du silence émotionnel au travail
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-[#5B4B8A]">60%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">des burn-outs passent inaperçus jusqu'à l'arrêt maladie</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-[#5B4B8A]">45 000€</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">coût moyen d'un burn-out pour l'entreprise</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-[#5B4B8A]">30%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">d'absentéisme en plus sans prévention RPS</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==== SOLUTION - 3 PILIERS ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
              3 piliers pour prévenir, pas guérir
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Une approche proactive du bien-être au travail
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Brain className="w-12 h-12 text-[#4FD1C5] mb-4" />
                  <CardTitle>1. Écoute proactive</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    ZÉNA dialogue avec vos équipes en toute confidentialité. Reconnaissance vocale et IA émotionnelle pour détecter stress, fatigue, perte de sens.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <BarChart3 className="w-12 h-12 text-[#5B4B8A] mb-4" />
                  <CardTitle>2. Analyse RPS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Scoring sur les 6 dimensions RPS (intensité travail, autonomie, conflits de valeurs...). Dashboard RH avec alertes précoces.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Heart className="w-12 h-12 text-[#4FD1C5] mb-4" />
                  <CardTitle>3. Solutions QVT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Recommandations personnalisées (box bien-être, ressources d'aide, protocoles d'intervention adaptés).
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==== PREUVE SOCIALE ==== */}
      <section className="bg-gradient-to-r from-[#5B4B8A]/10 to-[#4FD1C5]/10 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-3xl font-bold mb-8 text-[#005B5F]">
              Déjà <span className="text-[#4FD1C5]">127 entreprises</span> nous font confiance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">PME Innovantes</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">Startups Tech</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">Associations</Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">Services Publics</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==== RÉASSURANCE ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#005B5F]">
              Vos garanties
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <Lock className="w-12 h-12 text-[#4FD1C5] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">🔒 Anonymat garanti</h3>
                <p className="text-sm text-muted-foreground">
                  Les données individuelles ne sont jamais accessibles aux RH. Seules les tendances collectives sont visibles.
                </p>
              </div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-[#5B4B8A] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">📊 Conforme RGPD</h3>
                <p className="text-sm text-muted-foreground">
                  Hébergement en France, chiffrement des données, droit à l'oubli.
                </p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-[#4FD1C5] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">💡 ROI prouvé</h3>
                <p className="text-sm text-muted-foreground">
                  -30% d'absentéisme, +25% d'engagement après 6 mois d'utilisation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==== CTA FINAL ==== */}
      <section className="py-20 bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à écouter vos équipes ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Commencez gratuitement dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/zena-chat">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  🎙️ Essayer ZÉNA maintenant
                </Button>
              </Link>
              <Link to="/onboarding-company">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
                  Créer mon espace RH
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==== CAGNOTTE KENGO ==== */}
      <section className="py-16 bg-white/70">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-[#005B5F]">Soutenez le projet</h2>
            <iframe
              scrolling="no"
              src="https://kengo.bzh/projet-embed/5212/qvt-box"
              style={{
                border: "none",
                width: "100%",
                maxWidth: "320px",
                height: "320px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                margin: "0 auto",
              }}
              title="Cagnotte QVT Box sur Kengo"
            />
          </div>
        </div>
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="py-12 bg-[#005B5F]/5 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/auth" className="text-sm text-[#005B5F] hover:underline">
              Se connecter
            </Link>
            <Link to="/dashboard-rh" className="text-sm text-[#005B5F] hover:underline">
              Dashboard RH
            </Link>
            <Link to="/wellness-hub" className="text-sm text-[#005B5F] hover:underline">
              Bibliothèque QVT
            </Link>
          </div>
          <p className="text-sm text-[#6b7280]">
            © 2025 QVT Box — Made with 💜 en Bretagne
          </p>
        </div>
      </footer>
    </div>
  );
}
