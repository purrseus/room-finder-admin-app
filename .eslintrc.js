module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    // '@react-native-community',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-alert': 'error',
    'no-console': 'warn',
    'no-var': 'error',
    'no-duplicate-imports': 'error',
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
};
