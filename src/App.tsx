// src/App.tsx

import React from "react";
import ZenaFaceParticles from "./components/ZenaFaceParticles";

function App() {
  return (
    <div className="page-root">
      <main className="page-main">
        <section className="zena-card">
          {/* Texte gauche */}
          <div className="zena-card-left">
            <p className="zena-eyebrow">QVT BOX PRÉSENTE</p>

            <h1 className="zena-title">
              <span>ZÉNA,</span>{" "}
              <span className="zena-title-accent">
                la voix qui veille sur vos équipes
              </span>
            </h1>

            <p className="zena-subtitle">
              Une IA émotionnelle qui écoute, rassure et alerte avant le
              burn-out.
            </p>

            <p className="zena-body">
              ZÉNA prend des nouvelles en douceur, détecte la fatigue invisible
              et transforme des milliers de « ça va » automatiques en une
              véritable météo émotionnelle pour vos RH.
            </p>

            <p className="zena-body">
              Sans stigmatiser, sans fliquer. Juste pour intervenir à temps et
              prendre soin de celles et ceux qui tiennent la maison.
            </p>

            {/* Boutons principaux */}
            <div className="zena-buttons-row">
              <a
                href="https://qvtbox.com"
                className="btn btn-primary"
                target="_blank"
                rel="noreferrer"
              >
                ⚡ Découvrir QVT Box
              </a>

              <a
                href="mailto:contact@qvtbox.com?subject=Démo%20ZÉNA%20Entreprise"
                className="btn btn-secondary"
              >
                🧳 Demander une démo entreprise
              </a>
            </div>

            {/* Bouton test dialogue */}
            <div className="zena-test-wrapper">
              <a href="/chat" className="btn btn-ghost">
                💬 Tester comment ZÉNA parle
              </a>
            </div>

            {/* Lien Famille / Ados */}
            <p className="zena-family-link">
              👨‍👩‍👧 Découvrir aussi{" "}
              <a
                href="https://zena-family.qvtbox.com"
                target="_blank"
                rel="noreferrer"
              >
                ZÉNA Famille &amp; Ados
              </a>
            </p>
          </div>

          {/* Visuel ZÉNA à droite */}
          <div className="zena-card-right">
            <ZenaFaceParticles />
          </div>
        </section>

        <p className="zena-baseline">
          « Sortez de votre bulle, on veille sur vous. »
        </p>
      </main>
    </div>
  );
}

export default App;
