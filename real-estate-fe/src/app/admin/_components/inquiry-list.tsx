'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { InquiryStatus } from '@/lib/db/collections';

import { formatUsd, INQUIRY_STATUS, LOCALE_LABEL } from '../_data/view-models';

import { IcAlert, IcClock, IcClose, IcGlobe, IcInbox, IcPhone, IcTag } from './icons';
import { InquiryActions } from './inquiry-actions';
import { Avatar, EmptyState, Pill } from './ui';

import type { AdminInquiry } from '../_data/view-models';

/** Danh sách yêu cầu tư vấn — bấm vào một dòng mở ngăn chi tiết bên phải.
 *  Chỉ phần này cần client vì phải giữ dòng đang mở. */
export function InquiryList({ inquiries }: { inquiries: AdminInquiry[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  /*
   * Trạng thái vừa đổi, ghi đè lên dữ liệu từ server.
   *
   * `router.refresh()` mất vài trăm ms mới trả dữ liệu mới về; trong khoảng đó
   * người dùng vẫn thấy nhãn cũ và tưởng bấm hụt. Map này giữ giá trị mới cho
   * tới khi server trả về đúng nó.
   */
  const [overrides, setOverrides] = useState<Record<string, InquiryStatus>>({});

  useEffect(() => setMounted(true), []);

  const withOverride = (item: AdminInquiry): AdminInquiry =>
    overrides[item.id] ? { ...item, status: overrides[item.id]! } : item;

  const selected = (() => {
    const found = inquiries.find((item) => item.id === openId);
    return found ? withOverride(found) : null;
  })();

  // BĐS đã được join sẵn ở tầng server (presenters.ts) — client không truy DB
  // được, và tra cứu trong mảng như bản mock thì không còn mảng nào để tra.
  const property = selected?.property;

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={<IcInbox size={22} />}
        title="Chưa có yêu cầu nào ở mục này"
        message="Khi khách gửi form trên website, yêu cầu sẽ hiện tại đây."
      />
    );
  }

  return (
    <>
      {/* Container Thẻ Bảng màu Trắng giúp nổi bật trên nền Ivory */}
      <div className="bg-white border border-line rounded-xl shadow-xs overflow-hidden">
        {/* Table Header Row */}
        <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_2fr_1.2fr_1fr_60px] items-center gap-3 bg-navy/5 border-b border-line px-5 py-3 text-[11px] font-extrabold uppercase tracking-wider text-navy">
          <span>Khách hàng &amp; SĐT</span>
          <span>Dịch vụ quan tâm</span>
          <span>Lời nhắn từ khách</span>
          <span className="text-right">Thời gian gửi</span>
          <span className="text-center">Trạng thái</span>
          <span className="text-right">Thao tác</span>
        </div>

        <ul className="divide-y divide-line">
          {inquiries.map((item) => {
            const status = INQUIRY_STATUS[withOverride(item).status];
            return (
              <li key={item.id} className="hover:bg-gold/5 transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenId(item.id)}
                  className="group flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-gold"
                >
                  {/* Khách hàng */}
                  <div className="flex items-center gap-3 min-w-0 flex-[1.5]">
                    <Avatar name={item.name} />
                    <div className="min-w-0">
                      <div className="text-navy text-[13.5px] font-bold flex items-center gap-1.5 truncate">
                        <span className="truncate">{item.name}</span>
                        {item.overdue ? (
                          <span className="bg-red-100 text-red-700 px-1.5 py-0.2 rounded text-[10px] font-bold border border-red-200">
                            Quá hạn
                          </span>
                        ) : null}
                      </div>
                      <div className="text-muted text-[11.5px] flex items-center gap-1 mt-0.5">
                        <IcPhone size={11} className="text-gold shrink-0" />
                        <span>{item.phone}</span>
                      </div>
                      <div className="text-muted/60 text-[10.5px] font-mono mt-0.5">{item.code}</div>
                    </div>
                  </div>

                  {/* Dịch vụ */}
                  <div className="hidden md:block flex-[1.2] min-w-0">
                    <span className="bg-navy/8 text-navy font-bold px-2.5 py-1 rounded text-[11px] border border-navy/10 inline-block truncate max-w-full">
                      {item.service}
                    </span>
                  </div>

                  {/* Lời nhắn */}
                  <div className="hidden md:block flex-[2] min-w-0">
                    <p className="text-navy/80 text-[12.5px] leading-snug line-clamp-2">
                      {item.message || '—'}
                    </p>
                  </div>

                  {/* Thời gian */}
                  <div className="hidden md:block flex-[1.2] text-right shrink-0">
                    <div className="text-navy text-[12px] font-bold">{item.receivedLabel}</div>
                    <div className="text-muted text-[10.5px] font-mono">{item.receivedAt}</div>
                  </div>

                  {/* Trạng thái */}
                  <div className="shrink-0 text-center">
                    <Pill tone={status.tone}>{status.label}</Pill>
                  </div>

                  {/* Nút Xem */}
                  <div className="shrink-0 text-right">
                    <span className="bg-paper border border-line text-navy group-hover:border-gold group-hover:text-gold px-2.5 py-1 rounded text-[11px] font-bold transition-colors">
                      Xem →
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {selected && mounted
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Chi tiết yêu cầu ${selected.code}`}
              className="font-admin fixed inset-0 z-[120]"
            >
              <div
                onClick={() => setOpenId(null)}
                className="admin-fade-backdrop absolute inset-0 bg-[rgb(4_14_27/0.55)]"
              />

              <aside className="admin-slide-in-right absolute inset-y-0 right-0 flex w-[min(380px,100%)] flex-col bg-white shadow-[0_0_60px_rgb(7_29_54/0.25)]">
                <header className="border-line flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
                  <div className="min-w-0">
                    <h2 className="text-navy text-[13.5px] font-extrabold">Chi tiết yêu cầu</h2>
                    <p className="text-muted mt-0.5 truncate text-[11px]">
                      {selected.code} · gửi {selected.receivedLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenId(null)}
                    aria-label="Đóng"
                    className="border-line text-muted hover:border-gold hover:text-gold focus-visible:outline-gold grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-md border transition-colors focus-visible:outline-2"
                  >
                    <IcClose size={14} />
                  </button>
                </header>

                <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  {/* Khách hàng — chỉ tên và số điện thoại, đúng thứ sale cần để gọi. */}
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-navy truncate text-[13.5px] font-extrabold">
                        {selected.name}
                      </p>
                      <a
                        href={`tel:${selected.phone.replace(/\s/g, '')}`}
                        className="text-muted hover:text-gold flex items-center gap-1.5 text-[12px] transition-colors"
                      >
                        <IcPhone size={11} />
                        {selected.phone}
                      </a>
                    </div>
                    <Pill tone={INQUIRY_STATUS[selected.status].tone}>
                      {INQUIRY_STATUS[selected.status].label}
                    </Pill>
                  </div>

                  {/* Ba thông tin ngắn gộp vào một dải. Mỗi mục đã có icon riêng nên
                      tự hiểu — gắn nhãn cho từng cái chỉ tốn gấp đôi chiều cao. */}
                  <div className="border-line bg-ivory/40 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border px-3 py-2 text-[11.5px]">
                    <span className="text-navy flex items-center gap-1.5 font-bold">
                      <IcTag size={11} className="text-muted" />
                      {selected.service}
                    </span>
                    <span className="text-muted flex items-center gap-1.5">
                      <IcGlobe size={11} />
                      {LOCALE_LABEL[selected.locale] ?? selected.locale}
                    </span>
                    <span className="text-muted flex items-center gap-1.5">
                      <IcClock size={11} />
                      {selected.receivedAt}
                    </span>
                  </div>

                  {/* BĐS khách quan tâm — kèm ảnh để sale nhận ra ngay là căn nào. */}
                  <div>
                    <p className="text-muted mb-1.5 text-[11px]">Quan tâm đến</p>
                    {property ? (
                      <div className="border-line hover:border-gold flex gap-2.5 rounded-md border p-2 transition-colors">
                        <span className="bg-ivory relative h-12 w-16 shrink-0 overflow-hidden rounded">
                          <Image
                            src={property.cover}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </span>
                        <span className="flex min-w-0 flex-col justify-center gap-0.5">
                          <span className="text-navy line-clamp-1 text-[12.5px] font-bold">
                            {property.title}
                          </span>
                          <span className="text-muted truncate text-[11px]">
                            {property.district} · {property.groupName}
                          </span>
                          <span className="text-[11.5px] font-extrabold text-[#8f6614]">
                            {formatUsd(property.priceUsd)}
                            {property.perMonth ? (
                              <span className="text-muted ml-0.5 font-normal">/th</span>
                            ) : null}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <p className="border-line text-muted/70 rounded-md border border-dashed px-3 py-2.5 text-[11.5px]">
                        Không kèm bất động sản — khách gửi từ trang chung
                      </p>
                    )}
                  </div>

                  {/* Nội dung là đoạn văn nên vẫn giữ nhãn, khác với mấy mục ngắn ở trên. */}
                  <div>
                    <p className="text-muted mb-1.5 text-[11px]">Nội dung khách gửi</p>
                    {/* `whitespace-pre-line`: khách hay xuống dòng, và form voucher
                        cũng ghép nhiều dòng vào đây. Không giữ xuống dòng thì mọi
                        thứ dồn thành một khối chữ khó đọc. */}
                    <p className="border-line bg-ivory/40 text-navy rounded-md border p-3 text-[12px] leading-relaxed whitespace-pre-line">
                      {selected.message}
                    </p>
                  </div>

                  {selected.overdue ? (
                    <p className="flex items-start gap-2 rounded-md border border-[#eed6d3] bg-[#f9efee] px-3 py-2.5 text-[11.5px] text-[#8a4038]">
                      <IcAlert size={12} className="mt-0.5 shrink-0" />
                      Đã chờ quá 24 giờ mà chưa được liên hệ.
                    </p>
                  ) : null}
                </div>

                <InquiryActions
                  id={selected.id}
                  status={selected.status}
                  phone={selected.phone}
                  onChanged={(next) => setOverrides((p) => ({ ...p, [selected.id]: next }))}
                />
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
