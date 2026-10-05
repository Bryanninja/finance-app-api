import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node, // Variáveis do Node (process, console, etc.)
        ...globals.jest, // Variáveis do Jest (test, describe, expect, jest, etc.)
      },
    }, // Nota: como é API Node, trocamos browser por node!
  },
  eslintConfigPrettier, // Desativa qualquer regra do ESLint que possa conflitar com o Prettier
]);
