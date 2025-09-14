import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      // Add this for better fast refresh support
      fastRefresh: true,
      // Include JSX files
      include: "**/*.{jsx,tsx}",
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },

    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
