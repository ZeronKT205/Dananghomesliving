/**
 * `server-only` ném lỗi ngay khi được nạp ngoài môi trường Server Component,
 * nên vitest không import nổi bất kỳ service nào. Alias sang file rỗng này để
 * test chạy được mà vẫn giữ nguyên `import 'server-only'` trong mã thật — đó là
 * lớp chặn thật sự lúc build, không phải thứ nên gỡ đi vì test.
 */
export {};
