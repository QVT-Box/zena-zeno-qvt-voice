import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: "/", // ✅ Important pour Vercel & éviter les erreurs MIME
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Inclure pdfjs pour la compatibilité Vercel
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: "./index.html",
      external: [], // autoriser intégration de pdfjs-dist
    },
  },

  // ✅ Fix pour CORS & dev HTTPS si besoin futur (Zéna voix)
  preview: {
    port: 4173,
    https: false,
  },
}));
