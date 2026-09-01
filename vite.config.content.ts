import tailwindcss from "@tailwindcss/vite";
import {resolve} from "path";
import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({mode}) => ({
    plugins: [tsconfigPaths(), tailwindcss()],
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
