import { defineConfig } from "vite";
import { resolve } from "path";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [solidPlugin(), tailwindcss()],
  build: {
    outDir: "dist",
    emptyOutDir: mode !== "development",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "pages/popup.html"),
        background: resolve(__dirname, "src/background/index.ts"),
      },
      output: {
        entryFileNames: (chunk) => `${chunk.name}/index.js`,
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  publicDir: "public",
}));
