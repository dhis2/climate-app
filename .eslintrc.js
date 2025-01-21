const { config } = require('@dhis2/cli-style')

module.exports = {
    extends: [config.eslint],
    // Needed to add this to support ?? and ?. operators, for some reason
    parserOptions: { ecmaVersion: 'latest' },
    // These are common lint errors
    // TODO: remove these options to let them create errors again
    rules: {
        'import/extensions': 'warn',
        'max-params': 'warn',
        'no-unused-vars': 'warn',
    },
}
