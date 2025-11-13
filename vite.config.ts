import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // ✅ Indispensable pour Vercel (corrige le MIME "text/html" sur les modules JS)
  base: "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Compatibilité PDFJS & Supabase Edge
  optimizeDeps: {
    include: ["pdfjs-dist"],
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    assetsDir: "assets", // ✅ Explicite le dossier des assets
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
      output: {
        manualChunks: undefined, // ✅ Évite la fragmentation excessive
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js"
      }
    },
  },

  // ✅ Preview local fiable (même comportement que Vercel)
  preview: {
    port: 4173,
    strictPort: true,
  },
}));
