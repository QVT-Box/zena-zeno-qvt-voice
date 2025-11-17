import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Index from "@/pages/Index";              // Page d'accueil entreprise
import ZenaChat from "@/pages/ZenaChat";
import Auth from "@/pages/Auth";
import WellnessHub from "@/pages/WellnessHub";
import Dashboard from "@/pages/Dashboard";
import DashboardRH from "@/pages/DashboardRH";
import QSHDashboard from "@/pages/QSHDashboard";
import OnboardingCompany from "@/pages/OnboardingCompany";
import IngestKnowledge from "@/pages/admin/IngestKnowledge";

import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";
import InstallZenaButton from "@/components/InstallZenaButton";

/**
 * 🌿 ZÉNA Travail – Application principale
 * Domaine : https://zena.qvtbox.com
 * Fonctions : IA émotionnelle salariés, RUDP, Dashboards RH, Onboarding entreprise
 */
function App() {
  return (
    <Router>
      <div className="relative min-h-screen text-[#212121] font-sans overflow-hidden">

        {/* === FOND GLOBAL === */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7F6] via-[#EAF4F3] to-[#E9F9F5] -z-10" />

        {/* === HALOS D’AMBIANCE === */}
        <div
          className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10 animate-breathe"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10 animate-breathe-slow"
          aria-hidden="true"
        />

        {/* === ROUTES INTERNES === */}
        <Routes>

          {/* 🏠 Accueil marketing entreprise */}
          <Route path="/" element={<Index />} />

          {/* 🔐 Authentification */}
          <Route path="/auth" element={<Auth />} />

          {/* 🎙️ Chat IA – cœur de Zéna Travail */}
          <Route path="/zena-chat" element={<ZenaChat />} />

          {/* 💙 Hub Bien-être personnel */}
          <Route path="/wellness-hub" element={<WellnessHub />} />

          {/* 📊 Dashboards */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-rh" element={<DashboardRH />} />

          {/* 🌦️ QSH – météo émotionnelle */}
          <Route path="/qsh" element={<QSHDashboard />} />

          {/* 🏢 Onboarding / supports entreprise */}
          <Route path="/onboarding-company" element={<OnboardingCompany />} />

          {/* 🧠 Admin : ingestion de documents internes */}
          <Route path="/admin/ingest-knowledge" element={<IngestKnowledge />} />

          {/* 🔗 Passerelles inter-domaines */}
          <Route
            path="/family"
            element={<Navigate to="https://zena-family.qvtbox.com" replace />}
          />
          <Route
            path="/qvtbox"
            element={<Navigate to="https://www.qvtbox.com" replace />}
          />

          {/* Route fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* === INSTALL PWA === */}
        <InstallZenaButton />

        {/* === NOTIFICATIONS === */}
        <Toaster position="bottom-center" />

        {/* === NAVIGATION MOBILE === */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
