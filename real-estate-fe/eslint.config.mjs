// ──────────────────────────────────────────────────────────────
// Duotech — ESLint Flat Config cho Next.js 15 (ESLint 9+)
// ──────────────────────────────────────────────────────────────
// Dùng FlatCompat để nạp config chính thức của Next (next/core-web-vitals
// + next/typescript), sau đó chồng thêm rule riêng của Duotech.
// Formatting để Prettier lo — eslint-config-prettier (đặt cuối) tắt rule xung đột.
// ──────────────────────────────────────────────────────────────

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  {
    ignores: ['.next/**', 'out/**', 'dist/**', 'build/**', 'coverage/**', 'node_modules/**'],
  },

  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    plugins: { import: importPlugin },
    rules: {
      // ── Correctness / an toàn ──
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // ── Tổ chức import — thứ tự cố định, dễ đọc & review ──
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
        },
      ],

      // ── Kỷ luật ──
      eqeqeq: ['error', 'always'],
    },
  },

  // File config / script — nới lỏng
  {
    files: ['**/*.config.{js,mjs,ts}', 'scripts/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },

  prettier, // PHẢI để cuối
];
