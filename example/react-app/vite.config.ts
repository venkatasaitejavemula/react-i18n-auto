import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'i18n-direct-react': path.resolve(__dirname, '../..', 'packages/i18n-direct-react/dist/index.esm.js')
    }
  }
});