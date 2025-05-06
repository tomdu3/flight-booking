import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind(),
  ],
  server: { // Add server configuration
    proxy: {
      // Proxy requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Set to true if your backend uses HTTPS
        // Optionally rewrite path: remove /api prefix if backend doesn't expect it
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})
