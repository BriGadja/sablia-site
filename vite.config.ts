import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
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
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-toast"],
        },
      },
    },
  },
  server: {
    port: 3000,
    allowedHosts: ["code.sablia.io"],
  },
});
