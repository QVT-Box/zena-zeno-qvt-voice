import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import ZenaChat from "@/pages/ZenaChat";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#F2F7F6] to-[#EAF4F3] text-[#212121]">
        <Routes>
          {/* Page d'accueil principale ZENA Voice */}
          <Route path="/" element={<Index />} />

          {/* Page de chat Zena */}
          <Route path="/zena-chat" element={<ZenaChat />} />

          {/* Redirection fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Notifications globales */}
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
