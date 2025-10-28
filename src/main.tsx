import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// --- Enregistrement du Service Worker (PWA installable) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker enregistré avec succès :', registration.scope);
      })
      .catch((error) => {
        console.error('❌ Erreur d’enregistrement du Service Worker :', error);
      });
  });
}

