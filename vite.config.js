import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    // This config is primarily for Cypress component testing
    // The main app build still uses d2-app-scripts
    define: {
        // Add any global defines if needed for your components
    },
    optimizeDeps: {
        // Pre-bundle dependencies that might be needed for component testing
        include: ['react', 'react-dom'],
    },
})
