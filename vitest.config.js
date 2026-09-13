import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        coverage: {
            provider: "v8",
            reporter: ["text", "json-summary"],
            thresholds: {
                statements: 90,
                branches: 80,
                functions: 90,
                lines: 90,
            },
        },
    },
});
