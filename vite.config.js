import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: path.resolve(__dirname, "./src/assets/styles/style.css"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
