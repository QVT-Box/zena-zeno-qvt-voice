import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import ZenaChat from "@/pages/ZenaChat";
import { Toaster } from "@/components/ui/sonner";

/**
 * 🌿 App principale QVT Box – ZÉNA Voice
 * ---------------------------------------------------------
 * - Gère les routes de l'application
 * - Applique le fond dégradé et la palette globale
 * - Affiche les notifications (Toaster)
 */
function App() {
  return (
    <Router>
      {/* 💫 Fond global en dégradé QVT Box */}
      <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121]">
        <Routes>
          {/* 🏠 Page d’accueil principale – ZÉNA Voice */}
          <Route path="/" element={<Index />} />

          {/* 💬 Page secondaire – Chat dédié à ZÉNA */}
          <Route path="/zena-chat" element={<ZenaChat />} />

          {/* 🚦 Fallback : redirection vers l’accueil si route inconnue */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 🔔 Notifications globales (ex. réponses IA, erreurs, etc.) */}
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
