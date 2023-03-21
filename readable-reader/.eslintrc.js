module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['__tests__', '.eslintrc.js', 'node_modules'],
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'react/prop-types': 'off',
  },
};
