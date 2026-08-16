import { BarChart, DonutChart } from './_components/charts';
import { IcBuilding, IcCheck, IcClock, IcInbox, IcNews, IcPhone } from './_components/icons';
import { Avatar, EmptyState, PageHead, Panel, PanelLink, Pill, StatCard } from './_components/ui';
import { GROUPS, INQUIRIES, INQUIRIES_BY_DAY, NEWS, PROPERTIES } from './_data/mock';
import { AdminMapWrapper } from './properties/_components/admin-map-wrapper';

export default function AdminOverviewPage() {
  const pending = INQUIRIES.filter((item) => item.status === 'new');
  const overdue = pending.filter((item) => item.overdue);
  const done = INQUIRIES.filter((item) => item.status === 'done');
  const published = PROPERTIES.filter((item) => item.state === 'published');
  const drafts = PROPERTIES.filter((item) => item.state === 'draft');
  const weekTotal = INQUIRIES_BY_DAY.reduce((sum, day) => sum + day.count, 0);

  // Top 5 BĐS được bấm xem chi tiết nhiều nhất, phần còn lại gộp thành một lát.
  const ranked = [...PROPERTIES].sort((a, b) => b.views - a.views);
  const top = ranked.slice(0, 4).map((item) => ({ name: item.title, value: item.views }));
  const restViews = ranked.slice(4).reduce((sum, item) => sum + item.views, 0);
  const donutData = restViews > 0 ? [...top, { name: 'Các tin còn lại', value: restViews }] : top;

  return (
    <>
      <PageHead title="Tổng quan" desc="Những con số cần nhìn hằng ngày và việc đang cần xử lý." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          href="/admin/inquiries"
          icon={<IcInbox size={17} />}
          value={pending.length}
          label="Yêu cầu chưa xử lý"
          sub={
            overdue.length > 0
              ? `${overdue.length} yêu cầu đã quá 24 giờ`
              : 'Tất cả đều còn trong hạn'
          }
          tone={overdue.length > 0 ? 'warn' : 'neutral'}
        />
        <StatCard
          href="/admin/inquiries?tab=done"
          icon={<IcCheck size={17} />}
          value={done.length}
          label="Đã xử lý xong"
          sub="Khách đã được liên hệ"
          tone="ok"
        />
        <StatCard
          href="/admin/properties"
          icon={<IcBuilding size={17} />}
          value={PROPERTIES.length}
          label="Bất động sản"
          sub={`${published.length} đang hiển thị · ${drafts.length} bản nháp`}
        />
        <StatCard
          href="/admin/news"
          icon={<IcNews size={17} />}
          value={NEWS.length}
          label="Bài tin tức"
          sub={`${NEWS.filter((item) => item.state === 'published').length} đang hiển thị`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Yêu cầu tư vấn 7 ngày gần nhất" desc={`Tổng ${weekTotal} yêu cầu trong tuần`}>
          <BarChart data={INQUIRIES_BY_DAY} />
        </Panel>

        <Panel
          title="Bất động sản được xem nhiều nhất"
          desc="Tỉ lệ lượt bấm xem chi tiết"
          extra={<PanelLink href="/admin/properties">Xem tất cả</PanelLink>}
        >
          <DonutChart data={donutData} totalLabel="Tỉ lệ lượt xem chi tiết theo bất động sản" />
        </Panel>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.6fr_1fr] mb-4">
        <AdminMapWrapper properties={PROPERTIES} />

        <Panel
          title="Nhóm bất động sản"
          desc="Phân loại đang dùng ngoài website"
          extra={<PanelLink href="/admin/properties?tab=groups">Quản lý</PanelLink>}
          className="h-full"
        >
          <ul className="grid gap-2.5">
            {GROUPS.map((group) => {
              const count = PROPERTIES.filter((item) => item.groupId === group.id).length;
              return (
                <li
                  key={group.id}
                  className="border-line-soft flex items-center gap-2.5 border-b pb-2.5 last:border-b-0 last:pb-0"
                >
                  <span className="text-navy flex-1 text-[12.5px] font-bold">{group.name}</span>
                  {group.onHome ? <Pill tone="ok">Trang chủ</Pill> : null}
                  <span className="text-muted w-6 text-right text-[12px] tabular-nums">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <div className="grid items-start gap-4">
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
                      {item.phone} · {item.service}
                    </p>
                  </div>
                  <span className="text-muted hidden items-center gap-1 text-[11.5px] whitespace-nowrap sm:flex">
                    <IcClock size={11} />
                    {item.receivedLabel}
                  </span>
                  <a
                    href={`tel:${item.phone.replace(/\s/g, '')}`}
                    aria-label={`Gọi ${item.name}`}
                    className="border-line text-navy hover:border-gold hover:text-gold focus-visible:outline-gold grid h-8 w-8 shrink-0 place-items-center rounded-md border transition-colors focus-visible:outline-2"
                  >
                    <IcPhone size={14} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
