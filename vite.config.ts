import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    // 🔥 Évite toutes les erreurs MIME et 404 sur Vercel
    base: "./",

    server: {
      host: "::",
      port: 8080,
      strictPort: false,
    },

    preview: {
      port: 8080,
    },

    plugins: [
      react(),
      // 🔥 Important : tagger uniquement en DEV (sinon build cassé sur Vercel)
      isDev && componentTagger(),
    ].filter(Boolean),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    build: {
      outDir: "dist",
      assetsDir: "assets",

      sourcemap: isDev,
      chunkSizeWarningLimit: 1300,

      rollupOptions: {
        output: {
          manualChunks: {
            // Découpage intelligent pour les dashboards RH / émotion / charts
            react: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts"],
            ui: ["lucide-react"],
            data: ["@tanstack/react-query"],
          },
        },
      },
    },

    esbuild: {
      // 🔥 enlève console.log et debugger en production
      drop: isDev ? [] : ["console", "debugger"],
    },
  };
});
