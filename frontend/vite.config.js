// vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
const isDev = process.env.NODE_ENV === "development";
export default defineConfig({
  plugins: [
    react(),
    ...(isDev ? [basicSsl()] : []),
  ],


  server: {
    https: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});