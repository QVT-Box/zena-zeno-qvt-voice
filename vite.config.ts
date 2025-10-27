import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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

  // ✅ Important : optimise et autorise pdfjs-dist
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },

  // ✅ Et permet au bundler de l'intégrer proprement
  build: {
    rollupOptions: {
      external: [],
    },
  },
}));
