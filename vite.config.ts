import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

/**
 * En GitHub Pages el sitio vive en https://<usuario>.github.io/<repo>/
 * Por eso el build usa base "/AFILIAME/" y el dev server sigue en "/".
 * Si renombras el repositorio, cambia BASE y el `basename` se ajusta solo
 * porque el router lee import.meta.env.BASE_URL.
 */
const BASE = "/AFILIAME/";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : BASE,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
