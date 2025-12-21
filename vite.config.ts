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
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router'],

          // MUI core components
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],

          // MUI icons (large bundle)
          'mui-icons': ['@mui/icons-material'],

          // MUI charts (large bundle)
          'mui-charts': ['@mui/x-charts'],

          // Form libraries
          'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],

          // State management
          'query-libs': ['@tanstack/react-query', '@tanstack/react-query-devtools'],

          // Auth (only client-side code)
          'auth-libs': ['better-auth/react']
        }
      }
    }
  }
});
