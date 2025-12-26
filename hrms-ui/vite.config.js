import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/prakuratms/", // ✅ MUST match repo name exactly
});
