import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/background.js",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
    },
  },
});
