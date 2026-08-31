import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss()],
  build: {
    outDir: "dist/content",
    emptyOutDir: mode !== "development",
    lib: {
      entry: resolve(__dirname, "src/content/index.ts"),
      name: "contentScript",
      formats: ["iife"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  publicDir: false,
}));
