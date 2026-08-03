// ──────────────────────────────────────────────────────────────
// Duotech — Prettier Config (Prettier 3+)
// ──────────────────────────────────────────────────────────────
// Copy vào root. Cài: npm i -D prettier prettier-plugin-tailwindcss
// Bỏ dòng plugin nếu project không dùng Tailwind.
// ──────────────────────────────────────────────────────────────

/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all', // diff git sạch hơn khi thêm phần tử cuối
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf', // tránh lệch CRLF/LF giữa macOS/Windows
  plugins: ['prettier-plugin-tailwindcss'], // tự sắp xếp class Tailwind theo thứ tự chuẩn
};
