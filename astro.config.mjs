import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  server: {
    port: 3001,
    host: '0.0.0.0'
  }
});