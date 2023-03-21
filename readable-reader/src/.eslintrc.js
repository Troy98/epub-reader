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
    "max-len": ["warn", { code: 150 }],
    'no-nested-ternary': 'off',
    'no-mixed-operators': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/button-has-type': 'off',
    'no-underscore-dangle': 'off',
    'linebreak-style': ['error', 'windows'],
    'react/prop-types': 'off',
  },
};
