import { NextResponse } from 'next/server';

import { composeAndTranslate } from '@/server/services/article-ai-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** ROUTE TẠM — kiểm chứng dựng bài + dịch, xoá ngay sau khi chạy. */

const RAW = `đi xem villa Hòa Hải chiều nay. dự án Ocean Estate, bàn giao 2022.
đất 450m2, xây 2 tầng, sàn 917m2. 3pn 3wc + phòng giúp việc riêng.
giá bán 3.596.000 usd, chủ nói thương lượng được tầm 3-5%.
hồ bơi riêng 16m tràn bờ, hướng đông. sân vườn có cây lâu năm sẵn.
bếp Poliform nhập Ý, tủ âm tường full. điều hòa multi Daikin.
cách biển Non Nước 200m đi bộ, có lối riêng ra bãi.
an ninh 2 lớp cổng, bảo vệ 24/7 đi tuần.
garage ngầm 2 xe. có sạc điện.
điểm cần lưu ý: mùa mưa tháng 10-12 khu này gió biển mạnh, cửa kính phải loại chịu lực, chủ đã lắp Schuco rồi nhưng nhà nào chưa lắp thì tốn thêm.
phí quản lý khu 1.2 usd/m2/tháng, gồm bảo trì hồ bơi + cảnh quan.
sổ hồng lâu dài, người nước ngoài mua được vì dự án còn quota.
so với biệt thự Sơn Trà cùng tầm giá thì đây được cái gần biển hơn nhưng xa trung tâm hơn 15 phút.
khách Hàn với Nhật hay hỏi căn này.`;

const ALLOWED = new Set(['h2','h3','p','ul','ol','li','strong','em','u','blockquote','a','hr','div','br']);

function analyse(html: string) {
  const used = [...new Set([...html.matchAll(/<([a-z0-9]+)[\s>]/gi)].map((m) => m[1]!.toLowerCase()))].sort();
  return {
    theNgoaiSchema: used.filter((t) => !ALLOWED.has(t)),
    soTu: html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
    soH2: (html.match(/<h2/gi) ?? []).length,
    soInDam: (html.match(/<strong>/gi) ?? []).length,
    soDanhSach: (html.match(/<(ul|ol)>/gi) ?? []).length,
    soHopGhiNho: (html.match(/class="callout"/gi) ?? []).length,
    labelDung: /data-label="(Ghi nhớ|Mẹo|Lưu ý)"/.test(html),
    coScript: /<script/i.test(html),
    coH1: /<h1/i.test(html),
  };
}

export async function GET() {
  const t0 = Date.now();
  const b = await composeAndTranslate(RAW, 'vi', true);
  const ms = Date.now() - t0;

  const src = b.primary.content;
  return NextResponse.json({
    ms,
    stats: b.stats,
    title: b.primary.title,
    excerptLen: b.primary.excerpt.length,
    tags: b.primary.tags,
    vi: analyse(src),
    giuSoLieu: {
      '450m2': /450/.test(src), '917m2': /917/.test(src),
      '3596000': /3[.,]?596[.,]?000/.test(src), '200m': /200\s*m/i.test(src),
      '16m': /16\s*m/i.test(src), '1.2usd': /1[.,]2/.test(src),
    },
    banDich: Object.fromEntries(
      Object.entries(b.translations).map(([l, t]) => [
        l, { title: t.title.slice(0, 46), ...analyse(t.content) },
      ]),
    ),
    loiDich: b.failedLocales,
    preview: src.slice(0, 420),
  });
}
