module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-shadow': 'off', // fixes bug with enums https://stackoverflow.com/questions/63961803/eslint-says-all-enums-in-typescript-app-are-already-declared-in-the-upper-scope
    '@typescript-eslint/no-shadow': ['error'], // same as above
  },
  ignorePatterns: ['.eslintrc.js'], // ignore this file
};
