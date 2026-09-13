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
                statements: 65,
                branches: 55,
                functions: 65,
                lines: 65,
            },
        },
    },
});
