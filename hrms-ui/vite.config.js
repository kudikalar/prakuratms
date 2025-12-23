import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // 🔴 REQUIRED FOR GITHUB PAGES
  base: "/prakuratms/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: true,
  },
});
