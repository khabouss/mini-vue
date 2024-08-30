// vite.config.js
import { defineConfig } from 'vite';
import myPlugin from './custom-plugin';

export default defineConfig({
  plugins: [myPlugin()]
});

