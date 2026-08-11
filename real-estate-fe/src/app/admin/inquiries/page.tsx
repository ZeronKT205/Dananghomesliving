import { InquiryList } from '../_components/inquiry-list';
import { PageHead, Panel, SearchInput, SelectInput, Tabs, Toolbar } from '../_components/ui';
import { INQUIRIES } from '../_data/mock';

import type { InquiryStatus } from '../_data/mock';

const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Chưa xử lý' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'done', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Đã huỷ' },
] as const;

const SERVICE_OPTIONS = [
  'Mọi nhu cầu',
  'Mua bất động sản',
  'Thuê dài hạn',
  'Tư vấn đầu tư',
  'Định giá',
] as const;

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = 'all' } = await searchParams;
  const current = TABS.some((item) => item.value === tab) ? tab : 'all';

  const rows = current === 'all' ? INQUIRIES : INQUIRIES.filter((item) => item.status === current);
  const overdue = INQUIRIES.filter((item) => item.overdue).length;

  const tabsWithCount = TABS.map((item) => ({
    ...item,
    count:
      item.value === 'all'
        ? INQUIRIES.length
        : INQUIRIES.filter((i) => i.status === (item.value as InquiryStatus)).length,
  }));

  return (
    <>
      <PageHead
        title="Form tư vấn"
        desc="Yêu cầu khách gửi từ website. Bấm vào một dòng để xem chi tiết."
      />

      <Panel noPad>
        <Tabs basePath="/admin/inquiries" current={current} items={tabsWithCount} />
      </Panel>

      <Toolbar>
        <SearchInput placeholder="Tìm theo tên, số điện thoại, mã yêu cầu…" />
        <SelectInput label="Lọc theo nhu cầu" options={SERVICE_OPTIONS} />
      </Toolbar>

      <p className="text-muted text-[12px]">
        <b className="text-navy">{rows.length}</b> yêu cầu
        {overdue > 0 ? (
          <>
            {' · '}
            <b className="text-[#8a4038]">{overdue}</b> đã chờ quá 24 giờ
          </>
        ) : null}
      </p>

      <Panel noPad>
        <InquiryList inquiries={rows} />
      </Panel>
    </>
  );
}
