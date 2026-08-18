import { listArticles } from '@/lib/db/repositories/article-repo';
import { listCategories } from '@/lib/db/repositories/catalog-repo';
import { listInquiries } from '@/lib/db/repositories/inquiry-repo';
import { listProperties } from '@/lib/db/repositories/property-repo';
import { getInquiryDashboard } from '@/server/services/inquiry-service';
import { getDashboardStats } from '@/server/services/property-service';

import { BarChart, DonutChart } from './_components/charts';
import { IcBuilding, IcCheck, IcClock, IcInbox, IcNews, IcPhone } from './_components/icons';
import { Avatar, EmptyState, PageHead, Panel, PanelLink, Pill, StatCard } from './_components/ui';
import { toAdminInquiries, toAdminProperties } from './_data/presenters';

// Trang tổng quan luôn phải hiện số mới nhất — không cache.
export const dynamic = 'force-dynamic';

const WEEKDAY = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default async function AdminOverviewPage() {
  // Gom truy vấn vào MỘT Promise.all. Chạy tuần tự thì mỗi truy vấn cộng thêm
  // một vòng đi mạng tới Atlas và trang tổng quan ì hẳn.
  const [propertyStats, inquiryDash, pendingPage, topPage, categories, articlesPage, allProps] =
    await Promise.all([
      getDashboardStats(),
      getInquiryDashboard(),
      listInquiries({ page: 1, limit: 8, status: 'new', sort: 'oldest' }),
      listProperties({ page: 1, limit: 5, sort: 'popular', includeUnpublished: true }),
      listCategories(),
      listArticles({ page: 1, limit: 1, includeUnpublished: true, sort: 'newest' }),
      listProperties({ page: 1, limit: 100, includeUnpublished: true, sort: 'newest' }),
    ]);

  const [pending, top] = await Promise.all([
    toAdminInquiries(pendingPage.items, allProps.items, categories),
    toAdminProperties(topPage.items),
  ]);

  const overdue = pending.filter((item) => item.overdue);
  const weekTotal = inquiryDash.byDay.reduce((sum, day) => sum + day.count, 0);

  const barData = inquiryDash.byDay.map((d) => {
    const date = new Date(`${d.date}T00:00:00`);
    return {
      label: WEEKDAY[date.getDay()] ?? '',
      date: String(date.getDate()).padStart(2, '0'),
      count: d.count,
    };
  });

  const donutTop = top.slice(0, 4).map((item) => ({ name: item.title, value: item.views }));
  const restViews = Math.max(0, propertyStats.totalViews - donutTop.reduce((s, d) => s + d.value, 0));
  const donutData = restViews > 0 ? [...donutTop, { name: 'Các tin còn lại', value: restViews }] : donutTop;

  return (
    <>
      <PageHead title="Tổng quan" desc="Những con số cần nhìn hằng ngày và việc đang cần xử lý." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/admin/inquiries"
          icon={<IcInbox size={17} />}
          value={inquiryDash.stats.new}
          label="Yêu cầu chưa xử lý"
          sub={overdue.length > 0 ? `${overdue.length} yêu cầu đã quá 24 giờ` : 'Tất cả đều còn trong hạn'}
          tone={overdue.length > 0 ? 'warn' : 'neutral'}
        />
        <StatCard
          href="/admin/inquiries?tab=done"
          icon={<IcCheck size={17} />}
          value={inquiryDash.stats.done}
          label="Đã xử lý xong"
          sub="Khách đã được liên hệ"
          tone="ok"
        />
        <StatCard
          href="/admin/properties"
          icon={<IcBuilding size={17} />}
          value={propertyStats.total}
          label="Bất động sản"
          sub={`${propertyStats.published} đang hiển thị · ${propertyStats.draft} bản nháp`}
        />
        <StatCard
          href="/admin/news"
          icon={<IcNews size={17} />}
          value={articlesPage.total}
          label="Bài tin tức"
          sub={`${propertyStats.totalViews.toLocaleString('vi-VN')} lượt xem bất động sản`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Yêu cầu tư vấn 7 ngày gần nhất" desc={`Tổng ${weekTotal} yêu cầu trong tuần`}>
          <BarChart data={barData} />
        </Panel>

        <Panel
          title="Bất động sản được xem nhiều nhất"
          desc="Tỉ lệ lượt bấm xem chi tiết"
          extra={<PanelLink href="/admin/properties">Xem tất cả</PanelLink>}
        >
          {donutData.length > 0 ? (
            <DonutChart data={donutData} totalLabel="Tỉ lệ lượt xem chi tiết theo bất động sản" />
          ) : (
            <EmptyState
              icon={<IcBuilding size={22} />}
              title="Chưa có lượt xem"
              message="Số liệu xuất hiện khi có khách xem tin."
            />
          )}
        </Panel>
      </div>

      {/* Bản đồ đã BỎ khỏi trang này — nó trùng với tab "Bản đồ" trong trang
          Bất động sản, và tải một chunk nặng ở ngay trang đầu tiên vào CMS. */}
      <div className="grid items-start gap-4 xl:grid-cols-[1.6fr_1fr] mb-4">
        <Panel
          title="Cần gọi lại"
          desc="Khách chưa được liên hệ, cũ xếp trước"
          extra={<PanelLink href="/admin/inquiries">Xem tất cả</PanelLink>}
          noPad
        >
          {pending.length === 0 ? (
            <EmptyState
              icon={<IcCheck size={22} />}
              title="Không còn yêu cầu tồn đọng"
              message="Toàn bộ khách hàng đã được liên hệ."
            />
          ) : (
            <ul className="divide-line-soft divide-y">
              {pending.map((item) => (
                <li
                  key={item.id}
                  className="hover:bg-ivory/60 flex items-center gap-3 px-4 py-3 transition-colors"
                >
                  <Avatar name={item.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-navy flex items-center gap-2 text-[13px] font-bold">
                      <span className="truncate">{item.name}</span>
                      {item.overdue ? <Pill tone="danger">Quá hạn</Pill> : null}
                    </p>
                    <p className="text-muted truncate text-[11.5px]">
                      {item.phone || item.email} · {item.service}
                    </p>
                  </div>
                  <span className="text-muted hidden items-center gap-1 text-[11.5px] whitespace-nowrap sm:flex">
                    <IcClock size={11} />
                    {item.receivedLabel}
                  </span>
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone.replace(/\s/g, '')}`}
                      aria-label={`Gọi ${item.name}`}
                      className="border-line text-navy hover:border-gold hover:text-gold focus-visible:outline-gold grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-colors focus-visible:outline-2"
                    >
                      <IcPhone size={14} />
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Nhóm bất động sản"
          desc="Phân loại đang dùng ngoài website"
          extra={<PanelLink href="/admin/properties?tab=groups">Quản lý</PanelLink>}
          className="h-full"
        >
          <ul className="grid gap-2.5">
            {categories.map((c) => (
              <li
                key={c._id.toHexString()}
                className="border-line-soft flex items-center gap-2.5 border-b pb-2.5 last:border-b-0 last:pb-0"
              >
                <span className="text-navy flex-1 text-[12.5px] font-bold">
                  {c.name.vi ?? c.name.en ?? c.slug}
                </span>
                {c.showOnHome ? <Pill tone="ok">Trang chủ</Pill> : null}
                <span className="text-muted w-6 text-right text-[12px] tabular-nums">
                  {c.propertyCount}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
