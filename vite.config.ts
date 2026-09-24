import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import apiProxyPlugin from './vite-plugin-api-proxy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiProxyPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
