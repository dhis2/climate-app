const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslint],
    // Needed to add this to support ?? and ?. operators, for some reason
    parserOptions: { ecmaVersion: 'latest' },
    // These are common lint errors
    // TODO: address lines flagged with these rules (either turn off or back on)
    rules: {
        'import/extensions': 'warn',
        'max-params': 'warn',
        'no-unused-vars': 'warn',
    },
}
