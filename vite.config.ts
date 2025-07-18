import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'class-variance-authority': path.resolve(__dirname, './node_modules/class-variance-authority'),
      '@radix-ui/react-avatar': path.resolve(__dirname, './node_modules/@radix-ui/react-avatar'),
      '@radix-ui/react-checkbox': path.resolve(__dirname, './node_modules/@radix-ui/react-checkbox'),
      '@radix-ui/react-dialog': path.resolve(__dirname, './node_modules/@radix-ui/react-dialog'),
      '@radix-ui/react-label': path.resolve(__dirname, './node_modules/@radix-ui/react-label'),
      '@radix-ui/react-progress': path.resolve(__dirname, './node_modules/@radix-ui/react-progress'),
      '@radix-ui/react-radio-group': path.resolve(__dirname, './node_modules/@radix-ui/react-radio-group'),
      '@radix-ui/react-select': path.resolve(__dirname, './node_modules/@radix-ui/react-select'),
      '@radix-ui/react-slot': path.resolve(__dirname, './node_modules/@radix-ui/react-slot'),
      '@radix-ui/react-tabs': path.resolve(__dirname, './node_modules/@radix-ui/react-tabs'),
    },
  },
});
