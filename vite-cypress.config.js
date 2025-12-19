import path from 'node:path'
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
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
})
