# Next.js app — Duotech architecture

Scaffold bằng `npx duotech nextjs`. Kiến trúc & convention chuẩn Duotech (xem `CLAUDE.md`).

## Bắt đầu

```bash
npm install
cp .env.example .env.local   # điền giá trị thật
npm run dev                  # http://localhost:3000
```

## Lệnh

```bash
npm run dev          # dev server
npm run build        # production build (phải pass trước khi push)
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest
npm run format       # prettier --write .
```

## Kiến trúc thư mục

```text
src/
├── app/              # Routes (page/layout/loading/error), api/*/route.ts
│   └── <route>/_components/   # Component chỉ dùng trong route đó
├── components/
│   ├── ui/           # Primitive tái sử dụng (Button, Input)
│   └── features/<domain>/     # Component theo nghiệp vụ
├── server/
│   ├── actions/      # Server Actions ('use server') — mutation
│   └── services/     # Business logic thuần (test được)
├── lib/
│   ├── db/           # Truy cập DB (server-only)
│   ├── api/          # Gọi service ngoài
│   ├── validations/  # Zod schema
│   └── utils.ts
├── hooks/            # use-*.ts
├── types/            # type/interface dùng chung
└── config/           # env.ts (Zod-validated), constants.ts
```

Chi tiết quy tắc đặt file: đọc `CLAUDE.md`.
