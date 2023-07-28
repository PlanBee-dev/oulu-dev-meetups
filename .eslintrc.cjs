/** @type {import('eslint/lib/shared/types').ConfigData} */
module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:astro/recommended',
  ],
  rules: {
    'unicorn/prefer-node-protocol': 'error',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    {
      files: ['./packages/**/*.ts'],
      excludedFiles: ['**/*.d.ts'],
      parserOptions: {
        project: ['./packages/*/tsconfig.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
};
