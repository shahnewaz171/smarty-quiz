import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      sourcemap: true,
      emitFile: true,
      title: 'Bundle Analysis',
      filename: 'dist/bundle-report.html'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'mui-charts': ['@mui/x-charts'],
          'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'query-libs': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'auth-libs': ['better-auth/react']
        }
      }
    }
  }
});
