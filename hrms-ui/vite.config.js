import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // ✅ MUST MATCH REPO NAME
  base: "/prakuratms/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    cssCodeSplit: true,
  },
});
