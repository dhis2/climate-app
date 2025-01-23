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
}
