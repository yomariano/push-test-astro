import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  server: {
    port: 3001,
    host: '0.0.0.0'
  },
  vite: {
    server: {
      host: '0.0.0.0',
      port: 3000
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: [
        'push.signalstrading.app',
        '.signalstrading.app',
        'localhost',
        '127.0.0.1'
      ]
    }
  }
});