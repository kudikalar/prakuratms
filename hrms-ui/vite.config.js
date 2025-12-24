import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // MUST match GitHub repo name
  base: "/prakuratms/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
