import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import ZenaChat from "@/pages/ZenaChat";
import Auth from "@/pages/Auth";
import WellnessHub from "@/pages/WellnessHub";
import Dashboard from "@/pages/Dashboard";
import DashboardRH from "@/pages/DashboardRH";
import OnboardingCompany from "@/pages/OnboardingCompany";
import IngestKnowledge from "@/pages/admin/IngestKnowledge"; // ✅ Nouvelle page d’ingestion
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";

/**
 *  🌿 Application principale – ZÉNA Voice / QVT Box
 * ----------------------------------------------------------
 *  - Gère la navigation entre les univers (accueil, chat, dashboards, etc.)
 *  - Applique le thème émotionnel global (couleurs, halos, ambiance)
 *  - Active le système de notifications contextuelles
 */
function App() {
  return (
    <Router>
      <div className="relative min-h-screen text-[#212121] font-sans overflow-hidden">
        {/* === Fond global et ambiance === */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7F6] via-[#EAF4F3] to-[#E9F9F5] -z-10" />

        {/* Halos d’ambiance (effet respiration douce) */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
          aria-hidden="true"
        />

        {/* === Routes principales === */}
        <Routes>
          {/* Accueil */}
          <Route path="/" element={<Index />} />

          {/* Authentification */}
          <Route path="/auth" element={<Auth />} />

          {/* Chat ZÉNA */}
          <Route path="/zena-chat" element={<ZenaChat />} />

          {/* Hub Bien-être */}
          <Route path="/wellness-hub" element={<WellnessHub />} />

          {/* Dashboard personnel */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Dashboard RH */}
          <Route path="/dashboard-rh" element={<DashboardRH />} />

          {/* Onboarding entreprise */}
          <Route path="/onboarding-company" element={<OnboardingCompany />} />

          {/* ✅ Page d’administration – Ingestion de documents */}
          <Route path="/admin/ingest-knowledge" element={<IngestKnowledge />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Notifications globales */}
        <Toaster position="bottom-center" />

        {/* Barre de navigation mobile */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
