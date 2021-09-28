module.exports = {
    env: {
        browser: true,
        es2020: true,
        node: true
    },

    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },

    extends: ['eslint:recommended'],

    rules: {
        indent: ['warn', 4],
        'key-spacing': 'off',
        'no-multi-spaces': 'off',
        quotes: ['error', 'single']
    },
};
