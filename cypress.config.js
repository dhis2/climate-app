import { defineConfig } from 'cypress'

export default defineConfig({
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite',
            viteConfig: {
                // Point to our custom vite config
                configFile: './vite.config.js',
            },
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.js',
        indexHtmlFile: 'cypress/support/component-index.html',
    },
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(_on, _config) {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.js',
    },
    video: false,
    screenshotOnRunFailure: false,
})
