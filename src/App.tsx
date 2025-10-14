import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import ZenaChat from "@/pages/ZenaChat";
import Auth from "@/pages/Auth";
import WellnessHub from "@/pages/WellnessHub";
import Dashboard from "@/pages/Dashboard";
import DashboardRH from "@/pages/DashboardRH";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";

/**
 *  App principale – ZÉNA Voice / QVT Box
 * ----------------------------------------------------------
 * - Gère la navigation entre les univers (accueil, chat)
 * - Applique le thème émotionnel global (gradient, douceur)
 * - Active les notifications contextuelles
 */
function App() {
  return (
    <Router>
      {/* === Fond global et mise en page === */}
      <div className="relative min-h-screen text-[#212121] font-sans overflow-hidden">
        {/* Dégradé d'ambiance QVT Box */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7F6] via-[#EAF4F3] to-[#E9F9F5] -z-10" />

        {/* Halo d'ambiance douce */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
          aria-hidden="true"
        />

        {/* === Contenu principal === */}
        <Routes>
          {/*  Page d'accueil principale – ZÉNA Voice */}
          <Route path="/" element={<Index />} />

          {/*  Page d'authentification */}
          <Route path="/auth" element={<Auth />} />

          {/*  Page secondaire – Chat dédié à ZÉNA */}
          <Route path="/zena-chat" element={<ZenaChat />} />

          {/*  Hub de bien-être – Bibliothèque QVT */}
          <Route path="/wellness-hub" element={<WellnessHub />} />

          {/*  Dashboard personnel */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/*  Dashboard RH – Prévention RPS */}
          <Route path="/dashboard-rh" element={<DashboardRH />} />

          {/*  Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/*  Notifications globales (Toaster) */}
        <Toaster position="bottom-center" />

        {/*  Navigation mobile (Bottom Tab Bar) */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
