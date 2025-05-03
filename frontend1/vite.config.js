import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// vite.config.js
export default {
  server: {
    plugins: [react()],
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5175,      // Optional: Specify the port explicitly
  },
};