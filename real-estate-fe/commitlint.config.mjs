// ──────────────────────────────────────────────────────────────
// Duotech — Commitlint Config (Conventional Commits)
// ──────────────────────────────────────────────────────────────
// Cài:  npm i -D @commitlint/cli @commitlint/config-conventional husky
// Hook: npx husky init && echo 'npx --no -- commitlint --edit $1' > .husky/commit-msg
//
// Format:  <type>(<scope>): <subject>
// Ví dụ :  feat(auth): thêm đăng nhập Google
//          fix(checkout): sửa lỗi tính phí ship âm
// ──────────────────────────────────────────────────────────────

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // tính năng mới
        'fix', // sửa bug
        'docs', // tài liệu
        'style', // format, không đổi logic
        'refactor', // đổi code không thêm feature / sửa bug
        'perf', // tối ưu hiệu năng
        'test', // thêm/sửa test
        'build', // build system, dependencies
        'ci', // CI/CD config
        'chore', // việc lặt vặt khác
        'revert', // revert commit trước
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
  },
};
