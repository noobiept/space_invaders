import { defineConfig } from "vite";

export default defineConfig({
        // relative paths, so that the build can be deployed in a sub-directory
    base: "./",
    build: {
        outDir: "dist",
        target: "es2022",
    },
});
