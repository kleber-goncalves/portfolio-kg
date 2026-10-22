import { defineConfig } from "vitest/config"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0", // não usa loopback
        port: 3000, // porta ALTA (fora de políticas)
        strictPort: true,
        hmr: {
            port: 3000,
            protocol: "ws",
        },
    },
    plugins: [react(), tailwindcss()],

    test: {
        environment: "jsdom",
        include: ["src/**/*.test.{js,jsx}"],
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
});
