import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  { ignores: ['**/dist/*', '**/.astro/*', '**/.cache/*'] },
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
      '@typescript-eslint': tseslint.plugin,
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeCheckedOnly.map((tseslintConfig) => ({
    ...tseslintConfig,
    files: ['**/packages/**/*.ts'],
    ignores: ['**/*.d.ts', '**/vitest.config.ts'],
    languageOptions: {
      parserOptions: { projectService: true },
    },
  })),
  {
    rules: {
      'unicorn/prefer-node-protocol': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', disallowTypeAnnotations: false },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  // Run prettier before adding astro.
  // Prettier reports syntax errors in astro files.
  eslintPluginPrettierRecommended,
  ...eslintPluginAstro.configs.recommended,
  // This turns off all lint rules conflicting with Prettier
  eslintConfigPrettier,
]);
