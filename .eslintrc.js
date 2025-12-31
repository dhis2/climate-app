const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslintReact],
    // These are common lint errors
    // TODO: address lines flagged with these rules (either turn off or back on)
    rules: {
        'import/extensions': 'warn',
        'max-params': 'warn',
        'no-unused-vars': 'warn',
        'react/react-in-jsx-scope': 'off',
    },
    settings: {
        'import/resolver': { node: { extensions: ['.js', '.jsx'] } },
    },
    overrides: [
        {
            files: [
                '**/*.cy.{js,jsx,ts,tsx}',
                '**/cypress/**/*.{js,jsx,ts,tsx}',
            ],
            env: {
                'cypress/globals': true,
            },
            extends: ['plugin:cypress/recommended'],
            plugins: ['cypress'],
            rules: {
                // Allow Cypress globals like cy, Cypress, expect, etc.
                'no-undef': 'off',
                // Cypress-specific rules
                'cypress/no-assigning-return-values': 'error',
                'cypress/no-unnecessary-waiting': 'error',
                'cypress/assertion-before-screenshot': 'warn',
                'cypress/no-force': 'warn',
                'cypress/no-async-tests': 'error',
                'cypress/no-pause': 'error',
            },
        },
    ],
}
