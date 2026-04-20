import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import { FontaineTransform } from "fontaine";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    // Generate fallback @font-face metrics (size-adjust, ascent/descent-override)
    // so the initial paint with system serif/sans closely matches Fraunces/Geist
    // → avoids CLS / FOUT jank on H1 64px+.
    FontaineTransform.vite({
      fallbacks: ["Georgia", "EB Garamond", "system-ui", "Arial"],
      resolvePath: (id) => new URL(`.${id}`, import.meta.url),
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ],
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@docs": path.resolve(__dirname, "docs"),
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "client/index.html"),
      },
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          "react-vendor": ["react", "react-dom", "react/jsx-runtime"],
          router: ["wouter"],
          animation: ["framer-motion"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          ui: ["@radix-ui/react-toast"],
        },
      },
    },
  },
  server: {
    port: 3000,
    allowedHosts: ["code.sablia.io"],
  },
});
