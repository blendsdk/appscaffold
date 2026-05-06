import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: {{FRONTEND_PORT}},
        // Listen on all interfaces so the nginx HTTPS proxy (Docker) can
        // reach the Vite dev server running on the host machine
        host: true,
        // Allow the custom dev hostname used by the nginx HTTPS proxy
        allowedHosts: ['dev.{{PROJECT_NAME_LOWER}}.local'],
        proxy: {
            // Fallback proxy for direct access (without nginx HTTPS proxy).
            // When using the recommended HTTPS workflow via nginx, this proxy
            // is not used — nginx routes /api to the webapi directly.
            '/api': {
                target: 'http://localhost:{{BACKEND_PORT}}',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: '../webapi/resources/public/static',
        emptyOutDir: true,
    },
});
