// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
  ],

  plugins: {
    prettier: eslintPluginPrettier,
  },

  ...eslintConfigPrettier,

  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'warn',
  },
});
