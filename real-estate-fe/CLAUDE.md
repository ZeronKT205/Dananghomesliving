<!-- ──────────────────────────────────────────────────────────────
  Duotech — Template CLAUDE.md cho project Next.js mới
  Copy vào ROOT của project. Claude Code / Cursor / AI agents đọc file
  này tự động để tuân theo kiến trúc & convention khi sinh code.
  Thay <PLACEHOLDER> và xoá phần không dùng.
─────────────────────────────────────────────────────────────── -->

# real-estate-fe

> Next.js (App Router) + TypeScript. Tuân theo Duotech Engineering Conventions.

## ⚡ Quy tắc tối quan trọng (đọc trước khi sinh bất kỳ code nào)

1. **Server Component mặc định.** Chỉ thêm `'use client'` khi cần state/effect/event handler/browser API. Đẩy `'use client'` xuống component lá nhỏ nhất.
2. **`strict: true`, KHÔNG dùng `any`.** Dùng `unknown` + narrow. Validate mọi dữ liệu vào (API, form, env, params) bằng **Zod**.
3. **Ranh giới server/client là thiêng liêng.** Code trong `src/server/` và `src/lib/db/` thêm `import 'server-only'`. KHÔNG bao giờ import chúng vào Client Component.
4. **Secret không bao giờ ra client.** Chỉ `NEXT_PUBLIC_*` mới lộ ra trình duyệt. Đọc env qua `src/config/env.ts` (đã validate).
5. **Không `console.log` trong code lên prod.** Không hardcode secret/key.

## 🌳 Đặt file ở đâu (kiến trúc bắt buộc)

```text
src/
├── app/              # Routes: page.tsx, layout.tsx, loading.tsx, error.tsx, api/*/route.ts
│   └── <route>/_components/   # Component CHỈ dùng trong route này
├── components/
│   ├── ui/           # Primitive tái sử dụng (Button, Input) — "dumb", không fetch data
│   └── features/<domain>/     # Component theo nghiệp vụ
├── server/
│   ├── actions/      # Server Actions ('use server') — mutation
│   └── services/     # Business logic thuần (không biết HTTP, test được)
├── lib/
│   ├── db/           # Truy cập DB (server-only)
│   ├── api/          # Gọi service ngoài
│   ├── validations/  # Zod schema
│   └── utils.ts
├── hooks/            # use-*.ts
├── types/            # type/interface dùng chung
└── config/           # env.ts (Zod-validated), constants.ts
```

**Bảng quyết định nhanh:**

| Tạo gì | Đặt vào |
|:-------|:--------|
| Trang mới (URL) | `app/<route>/page.tsx` |
| Component dùng nhiều nơi | `components/ui/` hoặc `components/features/<domain>/` |
| Component dùng 1 route | `app/<route>/_components/` |
| Mutation (tạo/sửa/xoá) | `server/actions/` |
| Business logic | `server/services/` |
| Endpoint HTTP | `app/api/<name>/route.ts` |
| Truy vấn DB | `lib/db/` |
| Zod schema | `lib/validations/` |
| Hook tái sử dụng | `hooks/use-*.ts` |

## 📝 Naming & Style

- Component: `PascalCase.tsx`. File khác (lib/hook/route/action): `kebab-case.ts`. Thư mục: `kebab-case`.
- Biến/hàm `camelCase`, type/component `PascalCase`, hằng `UPPER_SNAKE_CASE`, boolean `is/has/can*`.
- Import alias `@/` thay vì `../../`. `import type` cho type.
- File ≤ ~250 dòng, component ≤ ~150 dòng. Format do Prettier lo (đừng tự canh).

## 🔧 Mẫu code chuẩn

```tsx
// Server Component fetch thẳng — không useEffect, không client waterfall
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  return <ProductView product={product} />;
}
```

```ts
// Server Action — validate input + check auth NGAY đầu hàm
'use server';
export async function createOrder(input: unknown) {
  const data = CreateOrderSchema.parse(input); // Zod, không tin client
  const session = await requireSession();
  return orderService.create(data, session.userId);
}
```

## ✅ Trước khi coi là xong

- `npm run lint` + `npm run typecheck` + `npm run build` đều xanh.
- Logic mới có test (Vitest) nếu là business logic / luồng quan trọng.
- Mọi env var mới thêm vào `.env.example` + `src/config/env.ts`.

## 🛠️ Lệnh

```bash
npm run dev          # dev server
npm run build        # production build (phải pass trước khi push)
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm test             # vitest
```

## 📚 Tài liệu đầy đủ

Convention chi tiết: repo `duotech-workflows/conventions/` — `nextjs.md` (kiến trúc + RSC + testing), `nodejs.md`, `deployment.md`. Naming + git workflow nằm trong `conventions/README.md`.

<!-- Project-specific notes: thêm bên dưới (schema DB, service ngoài, quirk riêng...) -->
