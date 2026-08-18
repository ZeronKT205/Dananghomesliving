# Kế hoạch Backend — DanangHomesLiving

> Trạng thái: **BẢN THẢO ĐỂ DUYỆT**. Chưa viết dòng code backend nào.
> Mục tiêu: chốt xong mô hình dữ liệu + ranh giới hệ thống rồi mới code, để không phải migrate dữ liệu thật sau này.

---

## 0. Tóm tắt cho người duyệt nhanh

Tôi đọc toàn bộ UI hiện có và suy ngược ra mô hình dữ liệu. Trong quá trình đó phát hiện **6 mâu thuẫn trong code hiện tại** — chúng không phải lỗi nhỏ, mà là những chỗ nếu không chốt bây giờ thì schema sẽ sai và phải migrate lại khi đã có dữ liệu thật.

**Cần anh quyết 4 việc** (mục 1). Còn lại tôi tự quyết được và đã ghi rõ lý do.

Khối lượng: 7 collection, 5 giai đoạn, mỗi giai đoạn có checkpoint chạy được và tự kiểm chứng.

---

## 1. Những mâu thuẫn phải chốt trước — CẦN ANH QUYẾT

### 1.1. Đang có HAI bộ dữ liệu bất động sản song song, khác ngôn ngữ, khác nội dung

| | `src/lib/db/listings.ts` | `src/lib/mock-data.ts` |
|---|---|---|
| Type | `Listing` | `Property` |
| Ngôn ngữ | Tiếng Anh | Tiếng Việt |
| Dùng ở | `/[locale]/properties` (danh sách) | `/[locale]/properties/[id]` (chi tiết) |
| Giá | `price: string` (`"$3,596,000"`) | `price: { usd, vnd }` |
| Diện tích | `area: string` (`"917 m²"`) | `stats: { internalArea: number, ... }` |

Tệ hơn: **cùng slug nhưng khác nội dung**. `riverfront-penthouse` ở `listings.ts` là *"The Riverfront Sky Penthouse"* ở Hải Châu, còn ở `mock-data.ts` lại là *"Biệt thự Trên không Sơn Trà"* ở Sơn Trà. Người dùng bấm từ danh sách vào chi tiết sẽ thấy hai bất động sản khác nhau.

> **QUYẾT ĐỊNH CẦN CÓ:** Gộp về một model duy nhất. Tôi đề xuất lấy cấu trúc của `Property` (số liệu là **number**, không phải string đã format) làm gốc, vì chỉ có số mới lọc/sắp xếp theo khoảng giá và diện tích được. Chuỗi `"917 m²"` không lọc được.

### 1.2. Giá: USD hay VND?

- `admin/_data/mock.ts` ghi rõ ở đầu file: *"Giá hiển thị bằng USD, KHÔNG phải VND"* và chỉ có `priceUsd: number`.
- Nhưng form `basic-info.tsx` có **cả hai ô** "Giá (USD)" và "Giá (VND)" nhập tay.
- `mock-data.ts` lưu cả hai dưới dạng **chuỗi đã format** (`'90.000.000.000'`).

Nhập tay cả hai nghĩa là biên tập viên phải tự quy đổi, và hai số sẽ lệch nhau ngay khi tỷ giá đổi.

> **QUYẾT ĐỊNH CẦN CÓ:** Chọn một trong ba:
> - **(A)** Lưu USD là số gốc, VND tính tự động theo tỷ giá cấu hình được — *đề xuất*, một nguồn sự thật.
> - **(B)** Lưu cả hai, nhập tay cả hai, chấp nhận lệch.
> - **(C)** Chỉ USD, bỏ hẳn ô VND khỏi form.

### 1.3. Đa ngôn ngữ: hiện KHÔNG có gì cả

Site khai 4 locale (`en`, `vi`, `zh`, `ko`) nhưng:
- `messages/ko.json` và `messages/zh.json` chỉ có **14 dòng**, nội dung là **tiếng Anh copy nguyên**.
- Nội dung thật (tên BĐS, mô tả, tiện ích) **không hề được dịch** — chỉ tồn tại một ngôn ngữ.
- Admin CMS **không có ô nhập cho locale nào khác**.

Đây là quyết định đắt nhất trong toàn bộ thiết kế. Sửa sau khi đã có dữ liệu thật là phải migrate toàn bộ.

> **QUYẾT ĐỊNH CẦN CÓ:**
> - **(A)** Dịch đầy đủ 4 thứ tiếng — trường dịch được lưu dạng `{ en, vi, zh, ko }`. CMS phải có tab chuyển ngôn ngữ cho từng trường. *Đắt nhất nhưng đúng với việc site đã mở 4 locale.*
> - **(B)** Chỉ VI + EN, `zh`/`ko` fallback về EN. Bỏ 2 locale khỏi routing.
> - **(C)** Nội dung một ngôn ngữ, chỉ dịch phần giao diện. Rẻ nhất, nhưng khách Hàn/Trung vào vẫn thấy tiếng Việt.
>
> Schema tôi thiết kế bên dưới theo hướng **(A)** vì nó bao được cả (B) và (C) — dùng ít locale hơn thì chỉ là không điền, không phải đổi schema.

### 1.4. Nhóm bất động sản không khớp nhau

- `GROUPS` khai 4 nhóm: `apartment`, `villa`, `house`, `penthouse`.
- Form `basic-info.tsx` chỉ cho chọn 3: `apartment`, `villa`, `penthouse` — **thiếu hẳn "Nhà riêng"**, dù đây là 1 trong 3 khối bắt buộc lên trang chủ theo ghi chú hợp đồng.
- `SEARCH_PROPERTY_TYPES` ở `constants.ts` lại là bộ khác nữa: `Apartment`, `Penthouse`, `Villa`, `Beach residence`.

Ba danh sách, ba nội dung khác nhau.

> **QUYẾT ĐỊNH CẦN CÓ:** Chốt một bộ danh mục duy nhất, quản lý trong DB (collection `categories`) chứ không hardcode 3 nơi. Tôi cần anh xác nhận danh sách cuối cùng.

### 1.5. `/admin` hiện KHÔNG có bất kỳ lớp bảo vệ nào

`middleware.ts` chỉ chạy next-intl và matcher **loại trừ** `/admin`. Nghĩa là hiện tại bất kỳ ai gõ đúng URL đều vào được toàn bộ trang quản trị. Chưa nguy hiểm vì chưa có dữ liệu thật, nhưng phải xử lý trước khi lên production.

*Không cần anh quyết — tôi sẽ làm auth. Ghi ở đây để anh biết mức độ.*

### 1.6. Slug trong SEO không khớp route thật

`seo-settings.tsx` hiển thị tiền tố `/vi/mua/`, nhưng route thật là `/[locale]/properties/[id]`. Cần chốt cấu trúc URL cuối cùng vì nó ảnh hưởng SEO và không nên đổi sau khi Google đã index.

---

## 2. Nguyên tắc thiết kế

1. **Zod là nguồn sự thật duy nhất về hình dạng dữ liệu.** Suy ra TypeScript type từ Zod (`z.infer`), không khai hai lần. Đúng quy ước trong `CLAUDE.md`.
2. **Không dùng Mongoose.** Dùng driver `mongodb` gốc + Zod. Mongoose sẽ tạo ra hệ schema thứ hai chồng lên Zod, hai bên lệch nhau là chuyện sớm muộn. Thêm `$jsonSchema` validator ở tầng Mongo làm lớp phòng thủ cuối.
3. **Mọi truy vấn đi qua repository.** Không gọi `db.collection()` rải rác trong page/route. Repository là chỗ duy nhất biết về soft delete — để không ai quên lọc `deletedAt`.
4. **Không bao giờ lộ `ObjectId` ra URL.** Public dùng `slug`, admin dùng `_id`.
5. **Service không biết HTTP.** Nhận object, trả object, ném lỗi có kiểu. Test được mà không cần dựng request.
6. **Validate ở biên.** Mọi dữ liệu vào (form, API, params) parse qua Zod trước khi chạm business logic.

---

## 3. Quyết định kỹ thuật — và lý do

### 3.1. Middleware chạy Edge runtime → ràng buộc cứng

Next.js chạy `middleware.ts` trên **Edge runtime**, không phải Node. Hệ quả bắt buộc:

| Không dùng được | Dùng thay bằng |
|---|---|
| driver `mongodb` | Không truy vấn DB trong middleware. Điểm dừng. |
| `jsonwebtoken` (cần `crypto` của Node) | **`jose`** — chạy được trên Edge, dùng WebCrypto |
| `bcrypt` (native binding) | `bcryptjs` trong route handler (Node), không phải middleware |

Đây là chỗ hầu hết dự án làm sai: viết middleware gọi DB kiểm tra session, deploy lên là chết. Middleware chỉ được phép **verify chữ ký JWT** — thao tác thuần CPU, không I/O.

**Hệ quả về bảo mật:** không tra DB được nghĩa là không thu hồi token ngay lập tức được. Xử lý bằng:
- Access token **sống ngắn (15 phút)**, chỉ verify chữ ký ở middleware.
- Refresh token **sống dài (30 ngày)**, lưu trong DB, mỗi lần refresh đi qua route handler (Node runtime) — chỗ này mới kiểm tra được đã thu hồi hay chưa.
- Đăng xuất/khoá tài khoản → xoá refresh token. Trường hợp xấu nhất kẻ tấn công còn 15 phút.

### 3.2. Kết nối MongoDB trong môi trường serverless

Mỗi lambda là một tiến trình riêng. Tạo `MongoClient` mới mỗi request sẽ làm cạn connection pool của Atlas (M0 chỉ cho 500 kết nối). Phải cache client vào biến global và tái dùng qua các lần gọi nóng. Đây là mẫu bắt buộc, không phải tối ưu tuỳ chọn.

### 3.3. Xoá mềm — thiết kế để không thể quên

Chỉ thêm `deletedAt` là chưa đủ; sớm muộn sẽ có truy vấn quên lọc và dữ liệu đã xoá lòi ra ngoài trang public.

Cách làm:
- Mọi document có `deletedAt: Date | null` (mặc định `null`).
- Repository có **hai nhóm hàm tách bạch**: `find*()` luôn tự chèn `deletedAt: null`; muốn lấy cả bản đã xoá phải gọi `findIncludingDeleted*()` — dài dòng có chủ đích, để việc lách thành hành động cố ý.
- **Partial unique index** trên `slug` với điều kiện `deletedAt: null` — cho phép tạo lại BĐS trùng slug sau khi đã xoá bản cũ, mà vẫn cấm trùng giữa các bản đang sống.
- Xoá cứng chỉ qua job dọn dẹp thủ công, không có endpoint.

### 3.4. Đếm lượt xem — không ghi DB mỗi lần xem trang

Trường `views` đang có trong admin mock. Mỗi lượt xem mà `$inc` một phát là mỗi request public thành một lần ghi DB — vừa chậm vừa phá cache static của Next.

Cách làm: gom trong bộ nhớ, `bulkWrite` định kỳ (60s/lần) hoặc đẩy qua route handler riêng gọi bằng `fetch` sau khi trang đã render. Trang vẫn giữ được SSG.

---

## 4. Schema chi tiết

Ký hiệu: `L<T>` = trường dịch được, lưu `{ en?: T; vi?: T; zh?: T; ko?: T }`.

### 4.1. Trường chung cho MỌI collection

```ts
{
  _id: ObjectId,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,     // xoá mềm
  createdBy: ObjectId | null, // → users
  updatedBy: ObjectId | null,
}
```

### 4.2. `properties` — bất động sản

Suy ra từ: `basic-info`, `specifications`, `location-editor`, `amenities-selector`, `media-manager`, `seo-settings`, `publishing-settings`, `mock-data.ts`.

```ts
{
  // --- Định danh ---
  slug: string,                    // duy nhất trong các bản chưa xoá
  code: string,                    // mã nội bộ, vd "BDS-0042"

  // --- Nội dung (dịch được) ---
  title: L<string>,
  summary: L<string>,              // 1 dòng, dùng cho card + meta
  description: L<string[]>,        // mảng đoạn văn, khớp mock-data hiện tại

  // --- Phân loại ---
  deal: 'sale' | 'rent',
  categoryId: ObjectId,            // → categories
  status: 'available' | 'pending' | 'sold' | 'rented',

  // --- Giá ---
  price: {
    usd: number,                   // số gốc, KHÔNG format sẵn
    vnd: number | null,            // theo quyết định 1.2
    period: 'total' | 'month',     // 'month' cho thuê
    negotiable: boolean,
  },

  // --- Thông số ---
  specs: {
    bedrooms: number,
    bathrooms: number,
    internalArea: number,          // m²
    landArea: number | null,
    buildingArea: number | null,
    floors: number | null,
    yearBuilt: number | null,
    parking: number | null,
    furnishing: 'full' | 'basic' | 'none',
    ownership: 'freehold' | 'leasehold',
  },

  // --- Vị trí ---
  location: {
    address: L<string>,
    ward: string,
    district: string,
    city: string,
    geo: { type: 'Point', coordinates: [number, number] }, // [lng, lat] — thứ tự GeoJSON
  },

  // --- Tiện ích & điểm nhấn ---
  amenityIds: ObjectId[],          // → amenities
  keyInfo: Array<{ label: L<string>; value: L<string> }>,
  nearby: Array<{ place: L<string>; minutes: number }>, // minutes là SỐ, không phải "5 phút"

  // --- Ảnh ---
  coverId: ObjectId | null,        // → media
  mediaIds: ObjectId[],            // có thứ tự

  // --- Cờ hiển thị ---
  isFeatured: boolean,
  isVerified: boolean,
  badges: L<string>[],

  // --- SEO ---
  seo: {
    title: L<string>,
    description: L<string>,
    focusKeyword: L<string>,
    ogImageId: ObjectId | null,
  },

  // --- Xuất bản ---
  publishState: 'draft' | 'published' | 'archived',
  isPublic: boolean,
  publishedAt: Date | null,

  // --- Thống kê ---
  viewCount: number,
  inquiryCount: number,
}
```

**Ghi chú thiết kế:**
- `nearby.minutes` là **số**, không phải chuỗi `"5 phút"` — để dịch được và sắp xếp được.
- `geo` dùng đúng chuẩn GeoJSON `[lng, lat]` (ngược với thói quen `lat, lng`) để dùng được `$near`, phục vụ "BĐS gần đây".
- `publishState` và `isPublic` là **hai thứ khác nhau** — đúng như UI đang có: một tin `published` nhưng `isPublic=false` là đã duyệt nhưng chưa mở cho khách xem.

### 4.3. `categories` — nhóm bất động sản

```ts
{
  slug: string,                    // 'apartment' | 'villa' | 'house' | ...
  name: L<string>,
  description: L<string> | null,
  showOnHome: boolean,             // hợp đồng: đúng 3 nhóm true
  order: number,
  coverId: ObjectId | null,
  propertyCount: number,           // cache, tính lại theo lịch
}
```

Thay thế cho 3 danh sách hardcode rời rạc ở mục 1.4.

### 4.4. `amenities` — tiện ích

```ts
{
  slug: string,
  name: L<string>,
  icon: string,                    // tên icon, KHÔNG phải chuỗi path SVG
  group: 'indoor' | 'outdoor' | 'security' | 'service',
  order: number,
}
```

> `mock-data.ts` đang nhúng thẳng chuỗi `d=""` của SVG vào dữ liệu. Không nên — đó là tài sản giao diện, không phải dữ liệu. Lưu tên icon, map sang component ở tầng UI.

### 4.5. `articles` — tips / bài viết

```ts
{
  slug: string,
  title: L<string>,
  excerpt: L<string>,
  content: L<string>,              // Markdown
  categoryId: ObjectId,            // → articleCategories
  tags: string[],
  coverId: ObjectId | null,
  author: {
    name: string,
    role: string | null,
    avatarId: ObjectId | null,
  },
  readingMinutes: number,          // SỐ, tính tự động từ content
  isFeatured: boolean,
  publishState: 'draft' | 'published' | 'archived',
  publishedAt: Date | null,
  viewCount: number,
  seo: { title: L<string>; description: L<string>; ogImageId: ObjectId | null },
}
```

### 4.6. `articleCategories`

```ts
{ slug: string, name: L<string>, order: number, articleCount: number }
```

Khởi tạo từ `NEWS_CATEGORIES`: Hướng dẫn mua, Thiết kế, Khu vực, Thị trường.

### 4.7. `inquiries` — form tư vấn

Hiện có **hai form khác nhau** cùng đổ về đây:

| Nguồn | Trường |
|---|---|
| `quote-request-section` (trang chủ / danh sách) | name, email, phone, service, message |
| `enquiry-form` (trang chi tiết BĐS) | name, email, phone, **preferredViewingDate**, message, propertyId |

```ts
{
  code: string,                    // "YC-1041", sinh tự động, dùng để tra cứu
  source: 'quote_form' | 'property_form',

  // Thông tin khách
  name: string,
  email: string,
  phone: string | null,            // quote-form không bắt buộc, property-form bắt buộc
  locale: 'en' | 'vi' | 'zh' | 'ko',

  // Nội dung
  service: 'buy' | 'rent' | 'invest' | 'valuation' | 'other' | null,
  message: string,
  preferredViewingDate: Date | null,

  // Liên kết
  propertyId: ObjectId | null,
  propertySnapshot: {              // chụp lại lúc gửi
    slug: string,
    title: string,
  } | null,

  // Xử lý
  status: 'new' | 'contacted' | 'done' | 'cancelled',
  assignedTo: ObjectId | null,
  notes: Array<{ by: ObjectId; at: Date; text: string }>,
  respondedAt: Date | null,

  // Chống spam & truy vết
  ipHash: string,                  // BĂM, không lưu IP thô
  userAgent: string | null,
  utm: Record<string, string> | null,
}
```

**Ghi chú thiết kế:**
- `propertySnapshot` chụp lại tên BĐS **tại thời điểm khách gửi**. BĐS có thể bị đổi tên hoặc xoá; yêu cầu tư vấn phải giữ nguyên bối cảnh lúc đó. Không dựa vào join.
- `overdue` trong admin mock **không lưu** — nó là giá trị tính được từ `createdAt` + SLA. Lưu cờ tính được là tự chuốc dữ liệu lệch.
- `ipHash` băm chứ không lưu IP thô — dữ liệu cá nhân, chỉ cần để chặn spam.

### 4.8. `media` — file trên R2

```ts
{
  key: string,                     // đường dẫn trong bucket R2
  url: string,                     // URL công khai đầy đủ
  mimeType: string,
  size: number,
  width: number | null,
  height: number | null,
  alt: L<string>,
  blurDataUrl: string | null,      // placeholder cho <Image>
  ownerType: 'property' | 'article' | 'category' | 'site' | null,
  ownerId: ObjectId | null,
}
```

### 4.9. `users` — quản trị viên

```ts
{
  email: string,                   // duy nhất
  passwordHash: string,            // bcryptjs, cost 12
  name: string,
  role: 'admin' | 'editor' | 'viewer',
  avatarId: ObjectId | null,
  isActive: boolean,
  lastLoginAt: Date | null,
  refreshTokens: Array<{
    tokenHash: string,             // BĂM, không lưu token thô
    expiresAt: Date,
    userAgent: string | null,
    createdAt: Date,
  }>,
  failedLoginCount: number,
  lockedUntil: Date | null,        // khoá tạm sau nhiều lần sai
}
```

Phân quyền: `admin` toàn quyền · `editor` sửa nội dung, không quản user · `viewer` chỉ đọc.

---

## 5. Index

Thiếu index thì mọi thứ vẫn chạy lúc có 10 bản ghi và sập lúc có 10.000.

```
properties:
  { slug: 1 }                      unique, partial deletedAt=null
  { publishState, isPublic, deletedAt, publishedAt: -1 }   ← truy vấn trang danh sách
  { deal, categoryId, deletedAt }
  { 'price.usd': 1, deletedAt }    ← lọc khoảng giá
  { 'location.geo': '2dsphere' }   ← BĐS gần đây
  { isFeatured, publishState, deletedAt }
  text index trên title.* + summary.*  ← ô tìm kiếm

articles:      { slug } unique partial · { publishState, publishedAt: -1 } · { categoryId }
inquiries:     { status, createdAt: -1 } · { propertyId } · { code } unique · { email }
users:         { email } unique partial · { 'refreshTokens.tokenHash' }
categories:    { slug } unique partial · { showOnHome, order }
media:         { key } unique · { ownerType, ownerId }
```

---

## 6. Middleware

Hiện tại chỉ có next-intl. Thiết kế mới, **thứ tự quan trọng**:

```
Request
  │
  ├─ 1. Security headers (mọi route)
  │     CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
  │
  ├─ 2. /admin/*  → Auth guard
  │     · Đọc cookie access token (httpOnly, secure, sameSite=lax)
  │     · Verify chữ ký bằng `jose` — KHÔNG chạm DB (ràng buộc Edge, mục 3.1)
  │     · Hỏng/hết hạn → redirect /admin/login?next=<path>
  │     · Kiểm tra role theo tiền tố đường dẫn
  │     · BỎ QUA /admin/login để không lặp vô hạn
  │
  ├─ 3. /api/*  → CORS + rate limit
  │     · Origin đối chiếu ALLOWED_ORIGINS (đã có isAllowedOrigin())
  │     · Rate limit theo IP cho endpoint public (form tư vấn)
  │
  └─ 4. Còn lại → next-intl (giữ nguyên hành vi hiện tại)
```

**Bẫy về matcher:** matcher hiện tại loại trừ `/admin`. Phải mở rộng để bắt `/admin`, đồng thời **vẫn** loại `/admin` khỏi xử lý i18n — admin chỉ tiếng Việt. Hai việc khác nhau, dễ làm hỏng lẫn nhau.

**Rate limit:** bộ nhớ trong lambda không chia sẻ giữa các instance nên đếm sẽ sai. Giai đoạn đầu chấp nhận (có còn hơn không), sau chuyển sang Upstash Redis. Ghi rõ đây là hạn chế đã biết, không phải bỏ sót.

---

## 7. Cấu trúc thư mục

Bám đúng bảng quyết định trong `CLAUDE.md`:

```
src/
├── lib/
│   ├── db/
│   │   ├── client.ts            # MongoClient cached (mục 3.2)
│   │   ├── collections.ts       # tên collection + kiểu, một chỗ duy nhất
│   │   └── repositories/
│   │       ├── base.ts          # helper soft-delete dùng chung
│   │       ├── property-repo.ts
│   │       ├── article-repo.ts
│   │       ├── inquiry-repo.ts
│   │       ├── category-repo.ts
│   │       ├── media-repo.ts
│   │       └── user-repo.ts
│   ├── validations/             # Zod — nguồn sự thật về hình dạng
│   │   ├── property.ts
│   │   ├── article.ts
│   │   ├── inquiry.ts
│   │   ├── category.ts
│   │   └── auth.ts
│   ├── auth/
│   │   ├── jwt.ts               # ký/verify bằng jose
│   │   ├── password.ts          # bcryptjs
│   │   └── session.ts           # đọc/ghi cookie
│   └── storage/
│       └── r2.ts                # S3 client + presigned URL
├── server/
│   ├── services/                # business logic, không biết HTTP
│   │   ├── property-service.ts
│   │   ├── article-service.ts
│   │   ├── inquiry-service.ts
│   │   └── auth-service.ts
│   └── actions/                 # Server Actions cho form admin
├── config/
│   ├── env.ts                   # ✅ xong
│   └── env.server.ts            # ✅ xong
└── middleware.ts                # viết lại theo mục 6
```

---

## 8. Kế hoạch triển khai — 5 giai đoạn

Mỗi giai đoạn **chạy được và tự kiểm chứng** trước khi sang giai đoạn sau. Không nối UI cho tới GĐ 5.

### GĐ 1 — Nền tảng (chưa có nghiệp vụ)
1. Cài `mongodb`, `zod` (đã có), `jose`, `bcryptjs`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
2. `lib/db/client.ts` — client cached
3. `lib/db/collections.ts` — khai tên + kiểu collection
4. Script `scripts/db-indexes.mjs` — tạo toàn bộ index ở mục 5, chạy lại được nhiều lần
5. `lib/db/repositories/base.ts` — helper soft delete

**Checkpoint:** script kết nối được Atlas, tạo đủ index, in ra danh sách để đối chiếu.

### GĐ 2 — Schema + repository (chưa có API)
1. Toàn bộ Zod schema trong `lib/validations/`
2. Repository từng collection, đủ CRUD + soft delete
3. `$jsonSchema` validator đẩy lên Mongo
4. Seed script chuyển dữ liệu mock hiện có sang DB — **đây là lúc mâu thuẫn 1.1 lộ ra hết**, phải gộp thủ công

**Checkpoint:** seed xong, đọc lại đúng số bản ghi; xoá mềm một bản, `find()` không thấy nhưng `findIncludingDeleted()` thấy.

### GĐ 3 — Auth
1. `lib/auth/*` — jwt (jose), password (bcryptjs), session cookie
2. `POST /api/auth/login`, `/logout`, `/refresh`
3. Viết lại `middleware.ts` theo mục 6
4. Trang `/admin/login`
5. Seed user admin đầu tiên

**Checkpoint:** vào `/admin` khi chưa đăng nhập → bị đá về login. Đăng nhập xong vào được. Access token hết hạn → refresh tự động. Đăng xuất → refresh token bị thu hồi trong DB.

### GĐ 4 — Service + API
1. `server/services/*`
2. Route handler cho public: danh sách BĐS (lọc/phân trang), chi tiết, danh sách bài viết, gửi form tư vấn
3. Server Actions cho admin: CRUD BĐS/bài viết/danh mục, đổi trạng thái yêu cầu tư vấn
4. R2: presigned upload URL + ghi bản ghi `media`

**Checkpoint:** gọi được toàn bộ endpoint bằng script, dữ liệu vào DB đúng. Upload ảnh lên R2 và lấy về được URL.

### GĐ 5 — Nối vào UI
1. Thay `lib/mock-data.ts` + `lib/db/listings.ts` + `admin/_data/mock.ts` bằng truy vấn thật
2. Nối form tư vấn (2 form) vào API
3. Nối form admin vào Server Actions
4. Xoá toàn bộ file mock

**Checkpoint:** `npm run build` xanh, mọi trang render bằng dữ liệu thật, không còn import nào tới file mock.

---

## 9. Rủi ro đã lường trước

| Rủi ro | Xử lý |
|---|---|
| Gộp hai bộ dữ liệu BĐS mất nội dung | Làm thủ công ở GĐ 2, đối chiếu từng bản trước khi xoá file mock |
| Atlas M0 giới hạn 500 kết nối | Client cached (3.2) + `maxPoolSize` thấp |
| Trang public thành dynamic, mất SSG | Public đọc qua `unstable_cache` + revalidate theo tag, không fetch thẳng mỗi request |
| Rate limit sai do lambda không chia sẻ bộ nhớ | Chấp nhận ở GĐ 3, chuyển Upstash khi có traffic thật |
| Đổi slug làm hỏng link đã index | Bảng `redirects`, giữ slug cũ → 301 |
| Trường dịch được rỗng ở locale nào đó | Hàm `pickLocale()` fallback theo thứ tự locale → `en` → locale bất kỳ có nội dung |

---

## 10. Việc KHÔNG nằm trong kế hoạch này

Ghi rõ để khỏi hiểu nhầm là bỏ sót:

- Thanh toán / đặt cọc trực tuyến
- Tài khoản cho khách hàng (lưu tin yêu thích, lịch sử xem) — hiện UI có nút trái tim nhưng chưa có tài khoản khách
- Gửi email/SMS thông báo khi có yêu cầu tư vấn mới
- Bản đồ tìm kiếm ở trang public (hiện chỉ admin có)
- Đa tiền tệ ngoài USD/VND
- Nhật ký thao tác đầy đủ (`activity-log.tsx` hiện là mock)

---

## 11. Cần anh trả lời trước khi tôi bắt đầu

1. **Mục 1.1** — Gộp về model `Property` (số liệu dạng number)? ✅ / ❌
2. **Mục 1.2** — Giá: (A) USD gốc + tự quy đổi VND, (B) nhập tay cả hai, hay (C) chỉ USD?
3. **Mục 1.3** — Đa ngôn ngữ: (A) đủ 4, (B) VI+EN, hay (C) chỉ giao diện?
4. **Mục 1.4** — Chốt danh sách nhóm BĐS cuối cùng?

Trả lời xong tôi bắt đầu từ GĐ 1.
