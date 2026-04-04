import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: {{FRONTEND_PORT}},
        proxy: {
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
