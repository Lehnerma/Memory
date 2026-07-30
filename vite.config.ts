import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "",  //hier können wir eine pfand angeben wie auf die sachen zugegriffen wird wenn das project nicht als root abgespeichert wird.
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        settings: resolve(root, 'pages/settings.html'),
      },
    },
  },
});