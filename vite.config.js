import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        listado: resolve(__dirname, 'listado.html'),
        ficha: resolve(__dirname, 'ficha.html'),
      },
    },
  },
});
