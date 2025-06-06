import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    target: 'es2017',
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
});
