import type { InquiryStatus } from '@/lib/db/collections';
import { listCategories } from '@/lib/db/repositories/catalog-repo';
import { listProperties } from '@/lib/db/repositories/property-repo';
import { getInquiries } from '@/server/services/inquiry-service';

import { InquiryList } from '../_components/inquiry-list';
import { PageHead, Panel, SearchInput, Tabs, Toolbar } from '../_components/ui';
import { toAdminInquiries } from '../_data/presenters';


export const dynamic = 'force-dynamic';

const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Chưa xử lý' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'done', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã huỷ' },
] as const;

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; page?: string }>;
}) {
  const { tab = 'all', q, page } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? tab : 'all';
  const status = current === 'all' ? undefined : (current as InquiryStatus);

  const [result, allProps, categories, counts] = await Promise.all([
    getInquiries({
      page: Number(page) || 1,
      limit: 50,
      status,
      q: q || undefined,
      sort: 'newest',
    }),
    listProperties({ page: 1, limit: 200, includeUnpublished: true, sort: 'newest' }),
    listCategories(),
    // Đếm cho từng tab. Chạy song song vì mỗi cái là một countDocuments riêng.
    Promise.all(
      TABS.map(async (t) => {
        const r = await getInquiries({
          page: 1,
          limit: 1,
          status: t.value === 'all' ? undefined : (t.value as InquiryStatus),
          sort: 'newest',
        });
        return [t.value, r.total] as const;
      }),
    ),
  ]);

  const countByTab = new Map(counts);
  const rows = await toAdminInquiries(result.items, allProps.items, categories);
  const overdue = rows.filter((r) => r.overdue).length;

  const tabsWithCount = TABS.map((item) => ({ ...item, count: countByTab.get(item.value) ?? 0 }));

  return (
    <>
      <PageHead
        title="Form tư vấn"
        desc="Yêu cầu khách gửi từ website. Bấm vào một dòng để xem chi tiết và đổi trạng thái."
      />

      <Panel noPad>
        <Tabs basePath="/admin/inquiries" current={current} items={tabsWithCount} />
      </Panel>

      <Toolbar>
        {/* Ô tìm kiếm nay gửi form thật lên server thay vì chỉ là ô trang trí. */}
        <form method="get" className="flex min-w-0 flex-1 items-center gap-2">
          <input type="hidden" name="tab" value={current} />
          <SearchInput
            name="q"
            defaultValue={q ?? ''}
            placeholder="Tìm theo tên, email, số điện thoại, mã yêu cầu…"
          />
        </form>
      </Toolbar>

      <p className="text-muted text-[12px]">
        <b className="text-navy">{result.total}</b> yêu cầu
        {overdue > 0 ? (
          <>
            {' · '}
            <b className="text-[#a33]">{overdue}</b> quá hạn 24 giờ
          </>
        ) : null}
      </p>

      <InquiryList inquiries={rows} />
    </>
  );
}
