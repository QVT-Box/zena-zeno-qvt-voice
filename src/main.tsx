import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// --- Root principal ---
const container = document.getElementById("root");
if (!container) throw new Error("❌ Élément #root introuvable dans index.html");
const root = createRoot(container);

// --- Rendu de l’application ---
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// --- Enregistrement du Service Worker (PWA installable) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("✅ Service Worker enregistré :", registration.scope);
      })
      .catch((error) => {
        console.error("❌ Erreur SW :", error);
      });
  });
}

// --- Gestion des erreurs globales ---
window.addEventListener("error", (event) => {
  console.error("💥 Erreur globale détectée :", event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("🚨 Promesse non gérée :", event.reason);
});
