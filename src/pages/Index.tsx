import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Shield,
  TrendingUp,
  Brain,
  Lock,
  BarChart3,
} from "lucide-react";

// ✅ Assure-toi que ces composants existent bien :
import ZenaAvatar from "@/components/ZenaAvatar";
import MagicAmbiance from "@/components/MagicAmbiance";

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
            Intelligence Émotionnelle IA • Made in France
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
            ZÉNA écoute vos équipes avant qu’il ne soit trop tard
          </h1>

          <p className="text-xl md:text-2xl text-[#212121]/80 mb-8 leading-relaxed">
            60 % des signaux de burn-out passent inaperçus jusqu’à l’arrêt maladie.
            <br />
            ZÉNA détecte les émotions faibles, protège vos salariés et éclaire vos décisions.
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
            Aucune carte bancaire requise • Essai gratuit illimité • Hébergement France 🇫🇷
          </p>
        </motion.div>

        {/* 👩‍💻 Avatar ZÉNA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <ZenaAvatar emotion="positive" mouthLevel={0} />
        </motion.div>
      </header>

      {/* ==== PROBLÈME ==== */}
      <section className="bg-white/70 backdrop-blur-sm py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F]">
            Le coût du silence émotionnel
          </h2>
          <p className="text-[#4b5563] max-w-2xl mx-auto mb-8">
            Derrière chaque burn-out, il y a des signaux qui n’ont pas été entendus.
            ZÉNA donne une voix aux émotions avant qu’elles ne se transforment en crise.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { stat: "60 %", text: "des burn-outs passent inaperçus" },
              { stat: "45 000 €", text: "coût moyen d’un burn-out complet" },
              { stat: "+30 %", text: "d’absentéisme sans prévention structurée" },
            ].map(({ stat, text }) => (
              <Card key={stat} className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-4xl font-bold text-[#5B4B8A]">
                    {stat}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ==== QUI EST ZÉNA ? ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
              Qui est ZÉNA ?
            </h2>
            <p className="text-[#4b5563] mb-4">
              ZÉNA n’est pas un simple chatbot. C’est une IA émotionnelle
              humanoïde, conçue pour représenter ce que la France a de meilleur :
              son exigence, son droit, son excellence sociale et sa protection
              des plus fragiles.
            </p>
            <p className="text-[#4b5563] mb-6">
              Elle écoute vos salariés, vos managers et vous-même avec une
              attention discrète, sans jugement, et fait remonter uniquement ce
              qui est utile pour agir sans jamais trahir la confiance.
            </p>
            <ul className="space-y-2 text-sm text-[#374151]">
              <li>• Ton calme, professionnel, rassurant</li>
              <li>• Compréhension émotionnelle fine du langage naturel</li>
              <li>• Jamais intrusive, toujours explicite sur ce qu’elle fait</li>
              <li>• Orientée action : écoute → analyse → recommandation</li>
            </ul>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-white/60">
            <h3 className="text-lg font-semibold mb-3 text-[#005B5F]">
              Ce que ZÉNA pourrait dire à vos équipes
            </h3>
            <p className="text-sm italic text-[#374151] leading-relaxed">
              « Je suis ZÉNA. Je ne remplace personne. Je rassemble ce que vous
              ressentez pour que personne ne tombe dans le silence. Je vous
              écoute, je protège vos données et j’alerte vos responsables
              seulement quand c’est nécessaire pour vous préserver. »
            </p>
          </div>
        </div>
      </section>

      {/* ==== COMMENT ÇA FONCTIONNE ? ==== */}
      <section className="py-16 bg-[#F9FAFA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F]">
            Comment ZÉNA écoute et agit ?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Une boucle simple, transparente et sécurisée. Pas de questionnaire
            fleuve, pas de jargon. Juste une conversation guidée.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-[#4FD1C5]" />
                  1. Elle écoute
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Le salarié parle librement, par écrit ou à la voix. ZÉNA
                  reformule, pose des questions douces et précise l’intensité
                  des émotions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#5B4B8A]" />
                  2. Elle analyse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les signaux sont traduits en scores de risques
                  psycho-sociaux, tendances par équipe, alertes de signaux
                  faibles et niveaux de charge émotionnelle.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-[#4FD1C5]" />
                  3. Elle recommande
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ZÉNA propose des actions concrètes : ajustements managériaux,
                  micro-changements d’organisation, et box bien-être adaptées à
                  chaque profil et contexte.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== 3 PILIERS ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
            3 piliers pour prévenir, pas guérir
          </h2>
          <p className="text-muted-foreground mb-12">
            Une approche proactive du bien-être, pensée pour les réalités du terrain.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow border-none">
              <CardHeader>
                <Brain className="w-12 h-12 text-[#4FD1C5] mb-4 mx-auto" />
                <CardTitle>Écoute proactive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  ZÉNA écoute les émotions avec empathie, sans jugement, et
                  repère les signaux faibles cachés derrière le “ça va”.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-none">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-[#5B4B8A] mb-4 mx-auto" />
                <CardTitle>Analyse RPS</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Scoring des risques psycho-sociaux, cartographie émotionnelle
                  par équipe et alertes précoces pour les RH et managers.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow border-none">
              <CardHeader>
                <Heart className="w-12 h-12 text-[#4FD1C5] mb-4 mx-auto" />
                <CardTitle>Solutions concrètes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recommandations actionnables et box bien-être ciblées :
                  sommeil, charge mentale, isolement, tensions d’équipe, etc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== FONCTIONNALITÉS CLÉS ==== */}
      <section className="py-16 bg-[#F9FAFA]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F] text-center">
            Les briques ZÉNA Entreprise
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-center">
            Une IA humanoïde, un socle QVT, des dashboards lisibles.
            Pas de complexité inutile, juste le nécessaire pour agir.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Baromètre émotionnel continu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Suivi régulier de l’humeur, de la charge mentale et du
                  sentiment de reconnaissance, sans harcèlement de questionnaires.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Heatmap des risques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualisation des zones à risque par équipe, métier ou site pour
                  prioriser les actions QVT et managériales.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Alertes signaux faibles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Détection de combinaisons à risque (charge + isolement +
                  injustices perçues) avant que la situation n’explose.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Espace RH & managers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dashboard clair, filtres simples, indicateurs actionnables.
                  Vous savez où agir, quand et avec qui.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Intégration QVT Box</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Liens directs entre signaux émotionnels et box bien-être
                  adaptées : individuel, équipe, managers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Rapports pour la direction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Synthèses prêtes à l’emploi pour CODIR, CSE, CSSCT :
                  séries temporelles, risques, actions menées et impacts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== POUR QUI ? ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] bg-clip-text text-transparent">
            Pour qui est faite ZÉNA ?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            ZÉNA a été pensée pour relier les réalités du terrain, du management
            et de la direction, sans opposer les mondes.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Salariés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Une oreille neutre, disponible 24/7, pour exprimer ce qu’on
                  n’ose pas toujours dire en direct, sans crainte de jugement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Managers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Des signaux lisibles sur la santé émotionnelle de l’équipe,
                  sans violer la confidentialité individuelle.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>RH & QVT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Un outil de pilotage QVT qui traduit des ressentis en
                  indicateurs fiables, conformes et exploitables.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== TECHNO & SOUVERAINETÉ ==== */}
      <section className="py-16 bg-[#F9FAFA]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F]">
              Une IA émotionnelle souveraine
            </h2>
            <p className="text-[#4b5563] mb-4">
              ZÉNA s’appuie sur les meilleures briques d’IA linguistique et
              émotionnelle, tout en restant alignée avec le cadre français et
              européen de protection sociale.
            </p>
            <ul className="space-y-2 text-sm text-[#374151]">
              <li>• Analyse sémantique & émotionnelle du langage naturel</li>
              <li>• Agrégation des données au niveau collectif, jamais individuel</li>
              <li>• Chiffrement des échanges et hébergement en France 🇫🇷</li>
              <li>• Gouvernance claire : ce qui est mesuré, pourquoi et pour qui</li>
            </ul>
          </div>
          <div className="bg-white/70 rounded-3xl p-6 shadow-lg border border-white/60">
            <h3 className="text-lg font-semibold mb-3 text-[#005B5F]">
              France, exigence et protection
            </h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              ZÉNA est pensée comme une extension numérique de la protection
              sociale à la française : elle ne remplace ni les médecins, ni les
              psychologues, ni les partenaires sociaux. Elle rend visibles les
              signaux pour que vous puissiez agir à temps, dans le respect de
              chacun.
            </p>
          </div>
        </div>
      </section>

      {/* ==== COMPARAISON ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#005B5F]">
            ZÉNA vs outils classiques
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Questionnaires annuels, enquêtes QVT, hotline… utiles, mais
            insuffisants pour capter la réalité émotionnelle du quotidien.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-[#6b7280]">
                  <th className="px-4 py-2"> </th>
                  <th className="px-4 py-2">Questionnaire annuel</th>
                  <th className="px-4 py-2">Hotline / cellule</th>
                  <th className="px-4 py-2">ZÉNA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    crit: "Fréquence",
                    q: "1 fois / an",
                    h: "Ponctuelle",
                    z: "Continue & douce",
                  },
                  {
                    crit: "Expression libre",
                    q: "Très limitée",
                    h: "Oui, mais peu utilisée",
                    z: "Naturelle, guidée par l’IA",
                  },
                  {
                    crit: "Signaux faibles",
                    q: "Peu visibles",
                    h: "Dépend de l’appel",
                    z: "Détection structurée",
                  },
                  {
                    crit: "Pilotage RH",
                    q: "Rapports lourds",
                    h: "Peu de données",
                    z: "Dashboards QVT prêts à l’emploi",
                  },
                ].map((row) => (
                  <tr key={row.crit} className="bg-white/70">
                    <td className="px-4 py-3 font-medium text-[#374151]">
                      {row.crit}
                    </td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.q}</td>
                    <td className="px-4 py-3 text-[#6b7280]">{row.h}</td>
                    <td className="px-4 py-3 font-semibold text-[#005B5F]">
                      {row.z}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Données agrégées, jamais visibles individuellement. ZÉNA
                n’expose jamais un salarié isolé.
              </p>
            </div>
            <div>
              <Shield className="w-12 h-12 text-[#5B4B8A] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Conforme RGPD</h3>
              <p className="text-sm text-muted-foreground">
                Hébergement France 🇫🇷, chiffrement, droit à l’oubli et contrôle
                clair sur les durées de conservation.
              </p>
            </div>
            <div>
              <TrendingUp className="w-12 h-12 text-[#4FD1C5] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">ROI QVT</h3>
              <p className="text-sm text-muted-foreground">
                Objectif : -30 % d’absentéisme évitable et +25 % d’engagement
                en 6 à 12 mois de déploiement structuré.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==== TÉMOIGNAGES (FUTURS) ==== */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F]">
            Ce que disent les équipes accompagnées
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            En phase de bêta, ZÉNA est déployée dans des environnements variés :
            services, terrain, logistique, IT. Voici le type de retours que nous
            visons et que vous pourrez afficher demain.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151] mb-4 italic">
                  « Pour la première fois, j’ai eu l’impression de pouvoir dire
                  que je n’allais pas bien sans mettre ma carrière en danger. »
                </p>
                <p className="text-xs text-[#6b7280]">
                  Salariée, support client multisite
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151] mb-4 italic">
                  « ZÉNA ne me donne pas des graphiques pour des graphiques.
                  Elle me montre où je dois agir, cette semaine, avec qui. »
                </p>
                <p className="text-xs text-[#6b7280]">
                  Manager de proximité, réseau terrain
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-[#374151] mb-4 italic">
                  « On a enfin une vision claire des risques RPS, sans violer
                  la confidentialité, et avec des actions QVT à piloter. »
                </p>
                <p className="text-xs text-[#6b7280]">
                  Responsable QVT & RH, secteur services B2B
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== OFFRE & TARIFS (SIMPLE) ==== */}
      <section className="py-16 bg-[#F9FAFA]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#005B5F]">
            Une offre simple, progressive
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Commencez petit, testez avec un périmètre pilote, puis étendez.
            ZÉNA est pensée pour s’adapter à la taille de votre organisation.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-[#E5E7EB]">
              <CardHeader>
                <CardTitle>Pilote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Sur devis</p>
                <p className="text-xs text-muted-foreground mb-4">
                  1 équipe ou 1 service
                </p>
                <ul className="text-sm text-[#374151] space-y-1 mb-4">
                  <li>• Accès ZÉNA pour les salariés</li>
                  <li>• Dashboard RH & manager</li>
                  <li>• Support au déploiement</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Idéal pour tester l’adoption et le ROI.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#4FD1C5] shadow-xl relative">
              <CardHeader>
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white border-0">
                  Recommandé
                </Badge>
                <CardTitle>Entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">
                  À partir de XX € / salarié / mois
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  À ajuster selon vos volumes et besoins.
                </p>
                <ul className="text-sm text-[#374151] space-y-1 mb-4">
                  <li>• Accès illimité à ZÉNA</li>
                  <li>• Dashboards avancés RH & direction</li>
                  <li>• Intégration QVT Box & box bien-être</li>
                  <li>• Accompagnement déploiement & reporting</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Pensé pour les ETI et grands comptes.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-[#E5E7EB]">
              <CardHeader>
                <CardTitle>Sur-mesure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Sur devis</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Multi-pays, multi-entités
                </p>
                <ul className="text-sm text-[#374151] space-y-1 mb-4">
                  <li>• Intégrations spécifiques (SIRH, SSO…)</li>
                  <li>• Ateliers QVT & cadrage RPS</li>
                  <li>• Accompagnement au changement</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Pour des trajectoires QVT ambitieuses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ==== CTA FINAL ==== */}
      <section className="py-20 bg-gradient-to-r from-[#005B5F] to-[#4FD1C5] text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Prêt à écouter vos équipes autrement ?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Lancez un pilote ZÉNA sur un service ou une équipe et mesurez
            l’impact réel sur le climat social.
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
        <p>© 2025 QVT Box & ZÉNA — Made with 💜 en Bretagne</p>
      </footer>
    </div>
  );
}
