// vite.config.js
import { defineConfig } from 'vite';
import myPlugin from './custom-plugin';
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [myPlugin(), Inspect()]
});

