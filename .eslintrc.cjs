/**
 * Indicates whether ESLint was run through `package.json` script.
 * Used to identify IDE integrations.
 */
const IS_SCRIPT = process.env.npm_lifecycle_event === 'lint';

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
    IS_SCRIPT && 'plugin:prettier/recommended',
    'plugin:astro/recommended',
  ].filter(Boolean),
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
      excludedFiles: ['**/*.d.ts', 'vitest.config.ts'],
      parserOptions: {
        project: ['./packages/*/tsconfig.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
    },
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
};
