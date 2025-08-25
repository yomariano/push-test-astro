import { defineConfig } from 'vite';

export default defineConfig({
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
});