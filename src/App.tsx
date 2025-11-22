// src/App.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ZenaChatPage from "./pages/ZenaChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/zena-chat" element={<ZenaChatPage />} />
        {/* placeholder pour la future page démo entreprise */}
        <Route
          path="/demo-entreprise"
          element={
            <div className="min-h-screen flex items-center justify-center bg-[#F5E8D4]">
              <p className="text-sm text-[#4D3F30]">
                La page de demande de démo entreprise arrive bientôt.
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
