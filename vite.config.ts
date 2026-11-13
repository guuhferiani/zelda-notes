import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const dbUrl = env.VITE_DATABASE_URL || env.DATABASE_URL || '';

  return {
    plugins: [react()],
    define: {
      '__VITE_DATABASE_URL__': JSON.stringify(dbUrl)
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    }
  };
});


