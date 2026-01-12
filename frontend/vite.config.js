import { defineConfig } from 'vite' // Main function to define Vite configuration
import react from '@vitejs/plugin-react' // Plugin to enable React support
import tailwindcss from '@tailwindcss/vite' // Plugin to integrate Tailwind CSS
import path from 'path' // Node.js module to work with file paths
import { fileURLToPath } from 'url' // Utility to convert file URLs to paths

// Derive the current filename and directory name since these are not available in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  // Array of plugins used by Vite
  plugins: [
    tailwindcss(), // Initialize Tailwind CSS
    react({
      // Add this for better fast refresh support (hot reloading)
      fastRefresh: true,
      // Include JSX and TSX files for transpilation
      include: "**/*.{jsx,tsx}",
    })
  ],
  resolve: {
    // Define path aliases for cleaner imports
    alias: {
      '@': path.resolve(__dirname, './src'), // map '@' to the './src' directory
    },

    // List of file extensions to try when resolving imports
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
