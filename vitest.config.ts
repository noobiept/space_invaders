import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // the game logic is pure, so there's no need for a dom environment
        environment: "node",
        include: ["scripts/**/*.test.ts"],
        coverage: {
            provider: "v8",
            include: ["scripts/logic/**"],
            reporter: ["text", "html"],
        },
    },
});
