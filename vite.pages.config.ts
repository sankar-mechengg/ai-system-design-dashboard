import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Static build config for GitHub Pages deployment
// This builds only the frontend (no Express server needed)
export default defineConfig({
  plugins: [react()],
  root: "client",
  base: "/ai-system-design-dashboard/",
  build: {
    outDir: "../dist-pages",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
});
