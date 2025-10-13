import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BoxCatalog from "@/components/BoxCatalog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Phone,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Euro,
  Box as BoxIcon,
  Activity,
} from "lucide-react";

import heroImage from "@/assets/qvt experience complete.png";
import saasImage from "@/assets/saas-dashboard-pro.jpg";
import partnersLocal from "@/assets/partners-local-producers.webp";
import shippingStation from "@/assets/shipping-station-parcel.webp";
import qvtLogo from "@/assets/qvtbox-logo.png";

const NewIndex = () => {
  const { t, language } = useLanguage();
  const [heroRef, heroVisible] = useScrollReveal();
  const [valueRef, valueVisible] = useStaggeredReveal(3, 160);
  const [howRef, howVisible] = useStaggeredReveal(3, 160);
  const [pricingRef, pricingVisible] = useStaggeredReveal(3, 140);
  const [ctaRef, ctaVisible] = useScrollReveal();

  const valueProps = [
    {
      icon: Activity,
      title: t("value.measure.title"),
      desc: t("value.measure.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("value.prevention.title"),
      desc: t("value.prevention.desc"),
    },
    {
      icon: CheckCircle2,
      title: t("value.actions.title"),
      desc: t("value.actions.desc"),
    },
  ];

  const plans = [
    {
      badge: t("offer.license.badge"),
      title: t("offer.license.title"),
      points: [
        t("offer.license.point1"),
        t("offer.license.point2"),
        t("offer.license.point3"),
        t("offer.license.point4"),
      ],
      cta: t("offer.license.cta"),
      icon: BarChart3,
      popular: true,
    },
    {
      badge: t("offer.boxes.badge"),
      title: t("offer.boxes.title"),
      price: t("offer.boxes.price"),
      unit: t("offer.boxes.unit"),
      points: [
        t("offer.boxes.point1"),
        t("offer.boxes.point2"),
        t("offer.boxes.point3"),
        t("offer.boxes.point4"),
      ],
      cta: t("offer.boxes.cta"),
      icon: BoxIcon,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      {/* 🌟 HERO */}
      <section ref={heroRef} className="relative overflow-visible py-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={qvtLogo}
                alt="QVT Box Logo"
                className="w-16 h-16 rounded-full shadow-lg"
              />
              <Badge className="bg-primary/15 text-primary hover:bg-primary/20">
                {t("hero.tagline")}
              </Badge>
            </div>

            <h1 className="font-inter text-5xl font-extrabold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-[#5B4B8A] via-[#4FD1C5] to-[#5B4B8A] bg-clip-text text-transparent">
                QVT Box
              </span>
            </h1>

            <p className="text-lg text-foreground/80 mb-7">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact">
                  <Phone className="w-5 h-5" />
                  {t("hero.cta.contact")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/saas">
                  <BarChart3 className="w-5 h-5" />
                  {t("hero.cta.demo")}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img
                src={heroImage}
                alt="QVT Box Hero"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 💜 Section ZÉNA */}
      <section className="relative py-16 px-6 text-center bg-gradient-to-b from-secondary/10 to-transparent">
        <div className="container mx-auto relative z-10 max-w-4xl">
          <video
            src="/zena-avatar.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-36 h-36 mb-6 rounded-full shadow-2xl object-cover ring-4 ring-primary/20 mx-auto"
          />
          <h2 className="text-3xl font-bold mb-4">
            Comment savoir si vos salariés vont bien… quand vous ne les voyez
            jamais ?
          </h2>
          <p className="text-foreground/70 mb-6">
            ZÉNA écoute, analyse et transforme les émotions collectées en
            **météo émotionnelle** : un baromètre RH anonyme et humain.
          </p>

          <a
            href="https://zena.qvtbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#5B4B8A] to-[#4FD1C5] text-white font-semibold text-lg shadow-xl hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5" />
            Parler à ZÉNA
          </a>
        </div>
      </section>

      {/* 💶 Section KENGO */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-center">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-[#005B5F] mb-4">
            💝 Soutenez QVT Box sur Kengo
          </h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Aidez-nous à faire grandir la première solution phygitale du
            bien-être au travail. Chaque contribution soutient l’innovation
            sociale et la fabrication locale 🇫🇷.
          </p>
          <div className="flex justify-center">
            <iframe
              scrolling="no"
              src="https://kengo.bzh/projet-embed/5212/qvt-box"
              style={{
                border: "none",
                height: "430px",
                width: "320px",
                borderRadius: "16px",
                overflow: "hidden",
              }}
              title="Cagnotte QVT Box"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 💼 Valeurs */}
      <section ref={valueRef} className="py-12 px-6">
        <div className="container mx-auto grid md:grid-cols-3 gap-6">
          {valueProps.map((v, i) => {
            const Icon = v.icon;
            return (
              <Card
                key={v.title}
                className={`stagger-item ${
                  valueVisible.has(i) ? "visible" : ""
                } border-transparent bg-gradient-to-b from-muted/40 to-background hover:from-muted/60 transition`}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{v.title}</h3>
                  <p className="text-sm text-foreground/70 mt-2">{v.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 🛍️ Box Catalog */}
      <BoxCatalog />

      {/* 🚚 Image shipping */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="rounded-3xl overflow-hidden ring-1 ring-black/5 shadow">
            <img
              src={shippingStation}
              alt="Shipping"
              className="w-full h-[260px] md:h-[320px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 📈 Tarifs */}
      <section className="py-16 px-6" ref={pricingRef}>
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t("offer.title")}</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => {
              const Icon = p.icon;
              return (
                <Card
                  key={p.title}
                  className={`stagger-item ${
                    pricingVisible.has(i) ? "visible" : ""
                  } ${p.popular ? "border-2 border-primary shadow-lg" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{p.title}</h3>
                          <Badge
                            className={
                              p.popular
                                ? "mt-1 bg-primary text-white"
                                : "mt-1"
                            }
                          >
                            {p.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <ul className="mt-5 space-y-2">
                      {p.points.map((pt) => (
                        <li
                          key={pt}
                          className="flex items-start gap-2 text-sm text-foreground/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Button asChild size="lg" className="w-full">
                        <Link to="/contact">
                          {p.cta}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 💬 CTA Final */}
      <section
        ref={ctaRef}
        className="py-16 px-6 bg-primary text-center text-white"
      >
        <h2 className="text-4xl font-bold mb-3 font-inter">
          {t("cta.title")}
        </h2>
        <p className="text-white/90 text-lg mb-6 max-w-3xl mx-auto">
          {t("cta.description")}
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link to="/contact">
              <Phone className="w-5 h-5" />
              {t("cta.button")}
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewIndex;
