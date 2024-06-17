import react from '@vitejs/plugin-react-swc';
import { config } from 'dotenv';
import * as path from 'node:path';
import { defineConfig } from 'vite';

config({
  path: ['.env', '.env.local'],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://graph.tidb.ai',
        headers: {
          'X-Api-Key': `${process.env.GRAPH_RAG_API_KEY}`,
        },
        changeOrigin: true,
      },
    },
  },
});
