import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_API_BASE_URL || env.VITE_BACKEND_URL || 'http://localhost:8083';
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    base: mode === 'production' ? '/metaverse/' : '/',
    server: {
      port: 5177,
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          secure: false,
          timeout: 300000,
        },
      },
    },
  };
});
