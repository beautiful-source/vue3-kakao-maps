/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: ['love', 'plugin:vue/vue3-essential', 'prettier', 'plugin:storybook/recommended'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.node.json', './tsconfig.vitest.json'],
    extraFileExtensions: ['.vue'] // .vue 파일 확장자 추가
  },
  plugins: ['vue'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off',
    'vue/no-undef-components': 'error'
  }
};
