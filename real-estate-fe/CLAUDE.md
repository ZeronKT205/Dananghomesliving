# DanangHomesLiving — `real-estate-fe`

> Frontend web đăng tin bất động sản Đà Nẵng (mua bán / cho thuê nhà đất, căn hộ).
> Next.js 15 (App Router) + React 19 + TypeScript. Tuân theo Duotech Engineering Conventions.

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

| Tạo gì                   | Đặt vào                                               |
| :----------------------- | :---------------------------------------------------- |
| Trang mới (URL)          | `app/<route>/page.tsx`                                |
| Component dùng nhiều nơi | `components/ui/` hoặc `components/features/<domain>/` |
| Component dùng 1 route   | `app/<route>/_components/`                            |
| Mutation (tạo/sửa/xoá)   | `server/actions/`                                     |
| Business logic           | `server/services/`                                    |
| Endpoint HTTP            | `app/api/<name>/route.ts`                             |
| Truy vấn DB              | `lib/db/`                                             |
| Zod schema               | `lib/validations/`                                    |
| Hook tái sử dụng         | `hooks/use-*.ts`                                      |

## 📝 Naming & Style

- Component: `PascalCase.tsx`. File khác (lib/hook/route/action): `kebab-case.ts`. Thư mục: `kebab-case`.
- Biến/hàm `camelCase`, type/component `PascalCase`, hằng `UPPER_SNAKE_CASE`, boolean `is/has/can*`.
- Import alias `@/` thay vì `../../`. `import type` cho type.
- File ≤ ~250 dòng, component ≤ ~150 dòng. Format do Prettier lo (đừng tự canh).

## 🔧 Mẫu code chuẩn

```tsx
// Server Component fetch thẳng — không useEffect, không client waterfall
export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  return <ListingDetail listing={listing} />;
}
```

```ts
// Server Action — validate input + check auth NGAY đầu hàm
'use server';
export async function createListing(input: unknown) {
  const data = CreateListingSchema.parse(input); // Zod, không tin client
  const session = await requireSession();
  return listingService.create(data, session.userId);
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

## 🏠 Từ vựng nghiệp vụ (dùng thống nhất trong code)

Tiếng Anh trong code, tiếng Việt trong UI. Không trộn lẫn, không viết tắt tự chế.

| Nghiệp vụ                 | Tên trong code       | Ghi chú                                   |
| :------------------------ | :------------------- | :---------------------------------------- |
| Tin đăng                  | `listing`            | KHÔNG dùng `post`, `product`, `item`      |
| Bất động sản (tài sản)    | `property`           | Nhà/đất/căn hộ cụ thể                     |
| Loại hình BĐS             | `propertyType`       | `apartment` / `house` / `land` / `office` |
| Hình thức                 | `listingType`        | `sale` (bán) / `rent` (cho thuê)          |
| Chủ tin / môi giới        | `agent`              | Người đăng tin                            |
| Người dùng cuối           | `user`               |                                           |
| Khu vực (quận/phường)     | `district` / `ward`  |                                           |
| Tìm kiếm + bộ lọc         | `search` / `filters` |                                           |
| Tin đã lưu                | `savedListing`       | KHÔNG dùng `favorite`, `wishlist`         |
| Liên hệ / yêu cầu xem nhà | `inquiry`            |                                           |

Áp dụng nhất quán cho: `components/features/<domain>/`, `server/services/<domain>-service.ts`,
`lib/validations/<domain>.ts`, `lib/db/<domain>.ts`, route `app/<domain>/`.

<!-- Project-specific notes: thêm bên dưới (schema DB, service ngoài, quirk riêng...) -->
