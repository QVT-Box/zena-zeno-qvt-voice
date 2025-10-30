import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";

/* ---------------- Code-splitting (lazy) ---------------- */
const Index = lazy(() => import("@/pages/Index"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ZenaChat = lazy(() => import("@/pages/ZenaChat"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const IngestKnowledge = lazy(() => import("@/pages/admin/IngestKnowledge"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/* ---------------- Utilities ---------------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

/**
 * ProfileGate
 * - redirige vers /onboarding si aucun profil local
 * - laisse passer /onboarding et les routes /admin
 */
function ProfileGate() {
  const { pathname } = useLocation();
  const allow = pathname.startsWith("/onboarding") || pathname.startsWith("/admin");

  // Autoriser la home "/" (marketing) sans profil
  const isHome = pathname === "/" || pathname === "";

  if (allow || isHome) return <Outlet />;

  const hasProfile = !!localStorage.getItem("zena_profile");
  if (!hasProfile) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
}

/* ---------------- Layout principal ---------------- */
function AppLayout() {
  return (
    <div className="relative min-h-screen text-[#212121] font-sans overflow-x-hidden">
      {/* Fond bulles / halos */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F2F7F6] via-[#EAF4F3] to-[#E9F9F5] -z-10" />
      <div className="pointer-events-none absolute top-[-12%] left-[-10%] w-[320px] h-[320px] bg-[#4FD1C5]/30 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-8%] w-[420px] h-[420px] bg-[#5B4B8A]/25 rounded-full blur-[140px] -z-10" />

      {/* Contenu */}
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>

      {/* UI globales */}
      <Toaster position="bottom-center" />
      <BottomNav />
    </div>
  );
}

/* ---------------- Error boundary simple ---------------- */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#5B4B8A]">
          <div className="px-6 py-4 bg-white/80 rounded-2xl shadow">
            Chargement de ZÉNA…
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ErrorBoundary>
        <Routes>
          {/* Layout global */}
          <Route element={<AppLayout />}>
            {/* Gate d’onboarding (protège toutes les routes enfants) */}
            <Route element={<ProfileGate />}>
              {/* Public: home & onboarding */}
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* ZÉNA & Dashboard */}
              <Route path="/zena" element={<ZenaChat />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Admin minimal (ingestion / debug) */}
              <Route path="/admin/ingest" element={<IngestKnowledge />} />

              {/* Fallback 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
