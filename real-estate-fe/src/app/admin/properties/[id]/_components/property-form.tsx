'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';

import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { DraftRestoreBar } from '@/components/ui/draft-restore-bar';
import { ImageDropZone } from '@/components/ui/image-drop-zone';
import { MapPicker } from '@/components/ui/map-picker';
import { LOCALES } from '@/config/locales';
import { useDraftBackup } from '@/hooks/use-draft-backup';
import { actionDeleteProperty, actionSaveProperty } from '@/server/actions/admin-actions';

import { Field, FormCard, LocaleTabs, SaveBar, Toggle, inputClass } from '../../../_components/form-kit';
import { IcTrash } from '../../../_components/icons';

import { PropertyAiPanel } from './property-ai-panel';

/** Nhãn ngôn ngữ hiện trên tiêu đề các khối — khớp với trang soạn tin tức. */
const LOCALE_LABEL: Record<string, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ko: '한국어',
};

export interface PropertyFormValue {
  id: string | null;
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>;
  deal: 'sale' | 'rent';
  categoryId: string;
  status: 'available' | 'pending' | 'sold' | 'rented';
  priceUsd: number;
  pricePeriod: 'total' | 'month';
  negotiable: boolean;
  specs: {
    bedrooms: number;
    bathrooms: number;
    internalArea: number;
    landArea: number | null;
    floors: number | null;
    yearBuilt: number | null;
    parking: number | null;
    furnishing: 'full' | 'basic' | 'none';
    ownership: 'freehold' | 'leasehold';
  };
  address: Record<string, string>;
  ward: string;
  district: string;
  lat: number | null;
  lng: number | null;
  amenityIds: string[];
  images: { id: string; url: string }[];
  coverId: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
  publishState: 'draft' | 'published' | 'archived';
  isPublic: boolean;
}

export interface FormOptions {
  categories: { id: string; name: string }[];
  amenities: { id: string; name: string; group: string }[];
  /** Có khoá AI hay không — quyết định hiện panel trợ lý. */
  aiEnabled: boolean;
  modelName: string;
}

const GROUP_LABEL: Record<string, string> = {
  indoor: 'Trong nhà',
  outdoor: 'Ngoài trời',
  security: 'An ninh',
  service: 'Dịch vụ',
};

export function PropertyForm({
  initial,
  options,
}: {
  initial: PropertyFormValue;
  options: FormOptions;
}) {
  const router = useRouter();
  const [v, setV] = useState<PropertyFormValue>(initial);
  const [locale, setLocale] = useState<string>('vi');
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Thẻ đặc điểm & tiện ích nổi bật (giống screenshot của user)
  const [highlights, setHighlights] = useState<string[]>(() => {
    const existing = (v.summary['vi'] ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
    if (existing.length > 0) return existing;
    return [
      'Trực diện Biển Mỹ Khê',
      'Đầy đủ nội thất cao cấp',
      'Dịch vụ housekeeping',
    ];
  });
  const [newHighlight, setNewHighlight] = useState('');

  const isNew = initial.id === null;

  /*
   * Giữ hộ bản nháp và cảnh báo khi rời trang lúc chưa lưu.
   *
   * Form này còn dài hơn trang soạn tin tức — mô tả bốn thứ tiếng, thông số,
   * tiện ích, ảnh, toạ độ bản đồ. Mất giữa chừng là mất hàng chục phút nhập
   * liệu.
   */
  const draft = useDraftBackup<PropertyFormValue>({
    key: initial.id ?? 'new',
    value: v,
    enabled: dirty,
  });

  function set<K extends keyof PropertyFormValue>(key: K, value: PropertyFormValue[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setMessage(null);
  }

  function setLocalized(
    key: 'title' | 'summary' | 'description' | 'address' | 'seoTitle' | 'seoDescription',
    text: string,
  ) {
    setV((prev) => ({ ...prev, [key]: { ...prev[key], [locale]: text } }));
    setDirty(true);
    setMessage(null);
  }

  function setSpec<K extends keyof PropertyFormValue['specs']>(key: K, value: PropertyFormValue['specs'][K]) {
    setV((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
    setDirty(true);
  }

  // Tự động nhảy vị trí bản đồ khi gõ địa chỉ
  useEffect(() => {
    const addr = v.address[locale]?.trim();
    if (!addr || addr.length < 5) return;

    const timer = setTimeout(async () => {
      try {
        const query = encodeURIComponent(`${addr}, Đà Nẵng, Việt Nam`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            if (!isNaN(lat) && !isNaN(lng)) {
              setV((prev) => ({ ...prev, lat, lng }));
            }
          }
        }
      } catch {
        // Bỏ qua lỗi mạng geocoding
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [v.address, locale]);

  const filled = useMemo(
    () => Object.fromEntries(LOCALES.map((l) => [l, Boolean(v.title[l]?.trim())])),
    [v.title],
  );

  const amenitiesByGroup = useMemo(() => {
    const m = new Map<string, FormOptions['amenities']>();
    for (const a of options.amenities) {
      if (!m.has(a.group)) m.set(a.group, []);
      m.get(a.group)!.push(a);
    }
    return [...m.entries()];
  }, [options.amenities]);

  function removeImage(id: string) {
    setV((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.id !== id),
      coverId: prev.coverId === id ? (prev.images.find((i) => i.id !== id)?.id ?? null) : prev.coverId,
    }));
    setDirty(true);
  }

  function moveImage(id: string, dir: -1 | 1) {
    setV((prev) => {
      const idx = prev.images.findIndex((i) => i.id === id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.images.length) return prev;
      const images = [...prev.images];
      [images[idx], images[next]] = [images[next]!, images[idx]!];
      return { ...prev, images };
    });
    setDirty(true);
  }

  function addHighlight() {
    const t = newHighlight.trim();
    if (!t) return;
    const next = [...highlights, t];
    setHighlights(next);
    setLocalized('summary', next.join('\n'));
    setNewHighlight('');
    setDirty(true);
  }

  function removeHighlight(index: number) {
    const next = highlights.filter((_, i) => i !== index);
    setHighlights(next);
    setLocalized('summary', next.join('\n'));
    setDirty(true);
  }

  function buildPayload() {
    const description: Record<string, string[]> = {};
    for (const [l, text] of Object.entries(v.description)) {
      const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      if (paras.length) description[l] = paras;
    }

    const clean = (o: Record<string, string>) =>
      Object.fromEntries(Object.entries(o).filter(([, val]) => val?.trim()));

    // Đồng bộ highlights vào summary nếu cần
    const summaryData = { ...v.summary };
    if (highlights.length > 0 && !summaryData[locale]) {
      summaryData[locale] = highlights.join('\n');
    }

    return {
      ...(v.slug ? { slug: v.slug } : {}),
      title: clean(v.title),
      summary: clean(summaryData),
      description,
      deal: v.deal,
      categoryId: v.categoryId,
      status: v.status,
      price: {
        usd: Number(v.priceUsd) || 0,
        vnd: null,
        period: v.pricePeriod,
        negotiable: v.negotiable,
      },
      specs: {
        ...v.specs,
        buildingArea: null,
      },
      location: {
        address: clean(v.address),
        ward: v.ward,
        district: v.district,
        city: 'Đà Nẵng',
        geo:
          v.lat !== null && v.lng !== null
            ? { type: 'Point' as const, coordinates: [v.lng, v.lat] as [number, number] }
            : null,
      },
      amenityIds: v.amenityIds,
      keyInfo: [],
      nearby: [],
      coverId: v.coverId,
      mediaIds: v.images.map((i) => i.id),
      isFeatured: v.isFeatured,
      isVerified: v.isVerified,
      badges: [],
      seo: {
        title: clean(v.seoTitle),
        description: clean(v.seoDescription),
        focusKeyword: {},
        ogImageId: v.coverId,
      },
      publishState: v.publishState,
      isPublic: v.isPublic,
    };
  }

  function save() {
    setError(null);
    setMessage(null);
    startSaving(async () => {
      const res = await actionSaveProperty(v.id, buildPayload());
      if (!res.ok) {
        const first = res.fields ? Object.entries(res.fields)[0] : null;
        setError(first ? `${first[0]}: ${first[1][0]}` : res.message);
        return;
      }
      setDirty(false);
      draft.clear();
      setMessage(res.message ?? 'Đã lưu');
      router.push('/admin/properties');
    });
  }

  function remove() {
    if (!v.id) return;
    startSaving(async () => {
      const res = await actionDeleteProperty(v.id!);
      if (res.ok) {
        draft.clear();
        router.push('/admin/properties');
      } else setError(res.message);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {draft.found ? (
        <DraftRestoreBar
          savedAt={draft.found.savedAt}
          label="Tìm thấy bất động sản nhập dở chưa lưu"
          onRestore={() => {
            setV(draft.found!.value);
            setDirty(true);
            draft.discard();
            setMessage('Đã khôi phục bản nháp — kiểm tra rồi bấm Lưu.');
          }}
          onDiscard={draft.discard}
        />
      ) : null}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-line shadow-xs rounded-xl">
        <div>
          <Link
            href="/admin/properties"
            className="text-muted hover:text-navy text-[12px] font-bold inline-flex items-center gap-1 transition-colors mb-1"
          >
            ← Quay lại danh sách bất động sản
          </Link>
          <h1 className="text-navy text-[19px] leading-tight font-extrabold">
            {isNew ? 'Thêm bất động sản mới' : v.title.vi || v.title.en || 'Sửa bất động sản'}
          </h1>
          <p className="text-muted mt-0.5 text-[12px]">
            {isNew
              ? 'Điền thông tin trực quan theo từng khối rồi lưu để bài xuất hiện ngoài website.'
              : `Đường dẫn: /properties/${v.slug}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && v.slug ? (
            <Link
              href={`/properties/${v.slug}`}
              target="_blank"
              className="border border-line text-navy hover:border-gold hover:text-gold px-3.5 py-1.5 text-[12px] font-bold transition-colors inline-flex items-center gap-1.5 bg-paper rounded-md"
            >
              👁 Xem bài trên Web ↗
            </Link>
          ) : null}
          {!isNew ? (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="h-8 rounded-md border border-red-200 bg-white px-3.5 text-[12px] font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 cursor-pointer"
            >
              Xoá bất động sản
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Grid: Left Standalone Modular Cards — Right Control Sidebar */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── LEFT COLUMN: Standalone Block Cards (Google Forms UX) ──────────────── */}
        <div className="flex flex-col gap-5 animate-fade-in min-w-0">
          {/* Language & Deal Header Card */}
          <div className="bg-white border border-line p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-3">
              <span className="text-muted font-medium">Hình thức giao dịch:</span>
              <select
                value={v.deal}
                onChange={(e) => set('deal', e.target.value as 'sale' | 'rent')}
                className="border-gold/50 bg-gold/10 text-[#8f6614] font-bold text-[12px] rounded px-2.5 py-1 cursor-pointer focus:outline-none"
              >
                <option value="sale">Bán bất động sản</option>
                <option value="rent">Cho thuê bất động sản</option>
              </select>

              <select
                value={v.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
                className="border-line bg-ivory text-navy font-bold text-[12px] rounded px-2.5 py-1 cursor-pointer focus:outline-none"
              >
                {options.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted text-[11px] font-bold uppercase">Ngôn ngữ soạn:</span>
              <LocaleTabs locales={LOCALES} current={locale} onChange={setLocale} filled={filled} />
            </div>
          </div>

          <PropertyAiPanel
            locale={locale}
            localeLabel={LOCALE_LABEL[locale] ?? locale}
            enabled={options.aiEnabled}
            modelName={options.modelName}
            current={{
              title: v.title[locale] ?? '',
              summary: v.summary[locale] ?? '',
              // Ô mô tả là một textarea; đoạn ngăn nhau bằng dòng trống, đúng
              // quy ước mà `buildPayload` dùng khi lưu.
              description: (v.description[locale] ?? '')
                .split(/\n\s*\n/)
                .map((t) => t.trim())
                .filter(Boolean),
            }}
            onComposed={(text) => {
              setV((p) => ({
                ...p,
                title: { ...p.title, [locale]: text.title },
                summary: { ...p.summary, [locale]: text.summary },
                description: { ...p.description, [locale]: text.description.join('\n\n') },
              }));
              setDirty(true);
            }}
            onTranslated={(translations) => {
              setV((p) => {
                const next = {
                  ...p,
                  title: { ...p.title },
                  summary: { ...p.summary },
                  description: { ...p.description },
                };
                for (const [l, t] of Object.entries(translations)) {
                  next.title[l] = t.title;
                  next.summary[l] = t.summary;
                  next.description[l] = t.description.join('\n\n');
                }
                return next;
              });
              setDirty(true);
            }}
          />

          {/* 1. HERO PHOTO GALLERY ALBUM CARD */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                🖼 Album ảnh bất động sản (Ảnh đầu tiên là ảnh bìa hero):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">
                Khối 1 • Photo Gallery
              </span>
            </div>

            <ImageDropZone
              ownerType="property"
              label="Kéo thả ảnh vào đây để tải lên album (hoặc bấm chọn tệp / dán Ctrl+V)"
              hint="Hỗ trợ nhiều tệp JPG, PNG, WebP. Tự động tối ưu trên Cloudflare R2."
              onUploaded={(img) => {
                setV((prev) => ({
                  ...prev,
                  images: [...prev.images, { id: img.id, url: img.url }],
                  coverId: prev.coverId ?? img.id,
                }));
                setDirty(true);
                setError(null);
              }}
            />

            {v.images.length > 0 && (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {v.images.map((img, i) => (
                  <li
                    key={img.id}
                    className="border-line relative overflow-hidden rounded-lg border bg-paper group/img shadow-xs"
                  >
                    <span className="bg-ivory relative block aspect-[4/3]">
                      <Image src={img.url} alt="" fill sizes="200px" className="object-cover" />
                    </span>
                    {v.coverId === img.id ? (
                      <span className="bg-gold text-navy absolute top-1.5 left-1.5 rounded px-2 py-0.5 text-[9.5px] font-extrabold uppercase shadow-sm">
                        ⭐ Ảnh bìa
                      </span>
                    ) : null}
                    <div className="flex items-center justify-between gap-1 px-2 py-1.5 bg-white border-t border-line">
                      <span className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(img.id, -1)}
                          disabled={i === 0}
                          className="text-muted hover:text-navy px-1 text-[13px] disabled:opacity-30"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(img.id, 1)}
                          disabled={i === v.images.length - 1}
                          className="text-muted hover:text-navy px-1 text-[13px] disabled:opacity-30"
                        >
                          →
                        </button>
                      </span>
                      <span className="flex items-center gap-1.5">
                        {v.coverId !== img.id ? (
                          <button
                            type="button"
                            onClick={() => set('coverId', img.id)}
                            className="text-gold hover:underline px-1 text-[10px] font-bold uppercase"
                          >
                            Đặt làm bìa
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          aria-label="Xoá ảnh"
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <IcTrash size={13} />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 2. REAL PUBLIC HEADER CARD: Title, Price, Deal Type, Key Specs (Phòng ngủ, Phòng tắm, Diện tích) */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                🏡 Thông tin tiêu đề & Thông số cốt lõi (Hiển thị đầu trang public):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">
                Khối 2 • Header Specs
              </span>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <label className="text-[11px] font-bold text-navy block mb-1">
                Tên / Tiêu đề bất động sản ({locale.toUpperCase()}):
              </label>
              <input
                value={v.title[locale] ?? ''}
                onChange={(e) => setLocalized('title', e.target.value)}
                className="font-display text-navy text-[24px] sm:text-[30px] font-normal leading-[1.2] w-full bg-paper/50 border border-dashed border-line group-hover:border-gold p-3 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all rounded-lg placeholder:text-navy/30"
                placeholder="VD: Căn hộ cao cấp Mỹ Khê Beachfront 2PN"
              />
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-ivory/40 rounded-lg border border-line mb-4">
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">Giá bán / thuê (USD):</label>
                <input
                  type="number"
                  min={0}
                  value={v.priceUsd}
                  onChange={(e) => set('priceUsd', Number(e.target.value))}
                  className={inputClass}
                  placeholder="1200"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">Đơn vị tính giá:</label>
                <select
                  value={v.pricePeriod}
                  onChange={(e) => set('pricePeriod', e.target.value as 'total' | 'month')}
                  className={inputClass}
                >
                  <option value="total">Tổng giá bán</option>
                  <option value="month">Mỗi tháng (Cho thuê)</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="text-navy flex cursor-pointer items-center gap-2 text-[13px] font-bold">
                  <input
                    type="checkbox"
                    checked={v.negotiable}
                    onChange={(e) => set('negotiable', e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  Giá thương lượng
                </label>
              </div>
            </div>

            {/* Key Specs Bar (Phòng ngủ, Phòng tắm, Diện tích m²) đặt NGAY DƯỚI ĐẦU TRANG */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-lg border border-line">
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">🛏 Số phòng ngủ:</label>
                <input
                  type="number"
                  min={0}
                  value={v.specs.bedrooms}
                  onChange={(e) => setSpec('bedrooms', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">🚿 Số phòng tắm:</label>
                <input
                  type="number"
                  min={0}
                  value={v.specs.bathrooms}
                  onChange={(e) => setSpec('bathrooms', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">📐 DT sử dụng (m²):</label>
                <input
                  type="number"
                  min={0}
                  value={v.specs.internalArea}
                  onChange={(e) => setSpec('internalArea', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-navy block mb-1">🌿 DT đất (m²):</label>
                <input
                  type="number"
                  min={0}
                  value={v.specs.landArea ?? ''}
                  onChange={(e) => setSpec('landArea', e.target.value === '' ? null : Number(e.target.value))}
                  className={inputClass}
                  placeholder="Không bắt buộc"
                />
              </div>
            </div>
          </div>

          {/* 3. PROPERTY OVERVIEW CARD (TỔNG QUAN) */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                📝 Tổng quan bất động sản ({LOCALE_LABEL[locale]}):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">
                Khối 3 • Overview
              </span>
            </div>

            <Field
              label={`Mô tả ngắn (${locale.toUpperCase()})`}
              hint="Một vài câu ngắn dùng hiển thị thẻ tin ngoài danh sách"
            >
              <textarea
                rows={2}
                value={v.summary[locale] ?? ''}
                onChange={(e) => setLocalized('summary', e.target.value)}
                className={inputClass}
                placeholder="Mô tả tóm tắt..."
              />
            </Field>

            <div className="mt-4">
              <label className="text-[12px] font-bold text-navy block mb-2">
                Nội dung bài viết tổng quan chi tiết:
              </label>
              <RichTextEditor
                value={v.description[locale] ?? ''}
                onChange={(html) => setLocalized('description', html)}
                contentKey={locale}
                placeholder="Viết nội dung giới thiệu tổng quan bất động sản..."
              />
            </div>
          </div>

          {/* 4. HIGHLIGHTS & AMENITIES CARD (ĐẶC ĐIỂM & TIỆN ÍCH NỔI BẬT - MATCHING SCREENSHOT) */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <div>
                <h2 className="font-display text-navy text-[22px] font-normal leading-tight">
                  Đặc điểm &amp; Tiện ích nổi bật
                </h2>
                <p className="text-muted text-[11.5px] mt-0.5">
                  Hiển thị dạng thẻ vuông ngoài website. Bấm nút bên dưới để thêm các đặc điểm nổi bật.
                </p>
              </div>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">
                Khối 4 • Highlight Cards
              </span>
            </div>

            {/* CUSTOM HIGHLIGHT CARDS - EXACT MATCH TO USER'S SCREENSHOT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] border border-line p-3.5 flex items-center gap-3 rounded-none shadow-xs group/card relative hover:border-gold transition-all"
                >
                  <div className="w-9 h-9 bg-[#F5ECDF] border border-[#E8D9C0] flex items-center justify-center shrink-0 text-[15px]">
                    {idx === 0 ? '☁️' : idx === 1 ? '🛋' : '🛡'}
                  </div>
                  <span className="font-bold text-navy text-[13px] leading-tight flex-1">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer shadow-xs"
                    title="Xoá thẻ này"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Highlight Card Input */}
            <div className="flex gap-2 mb-6">
              <input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="Nhập tên đặc điểm / tiện ích mới (VD: Trực diện Biển Mỹ Khê)..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={addHighlight}
                className="bg-navy hover:bg-gold text-white font-bold text-[12px] px-4 py-2 rounded-md shrink-0 transition-colors cursor-pointer"
              >
                ＋ Thêm thẻ đặc điểm
              </button>
            </div>

            {/* Standard Amenities Toggle Grid */}
            <div className="border-t border-line pt-4">
              <p className="text-navy text-[12px] font-bold mb-3">Tích chọn các tiện ích có sẵn trong danh mục:</p>
              {amenitiesByGroup.map(([group, items]) => (
                <div key={group} className="mb-3 last:mb-0">
                  <p className="text-muted mb-1.5 text-[10.5px] font-bold tracking-wider uppercase">
                    {GROUP_LABEL[group] ?? group}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((a) => {
                      const on = v.amenityIds.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() =>
                            set('amenityIds', on ? v.amenityIds.filter((x) => x !== a.id) : [...v.amenityIds, a.id])
                          }
                          className={
                            on
                              ? 'border-gold bg-gold/12 text-[#8f6614] rounded-full border px-3 py-1 text-[11.5px] font-bold cursor-pointer'
                              : 'border-line text-muted hover:border-gold rounded-full border px-3 py-1 text-[11.5px] transition-colors cursor-pointer'
                          }
                        >
                          {a.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. LOCATION & INTERACTIVE MAP CARD (VỊ TRÍ & BẢN ĐỒ) */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-4 border-b border-line pb-3">
              <div>
                <h2 className="font-display text-navy text-[22px] font-normal leading-tight">
                  Vị trí &amp; Bản đồ tương tác
                </h2>
                <p className="text-muted text-[11.5px] mt-0.5">
                  Nhập địa chỉ ở ô bên dưới -&gt; Bản đồ tự nhảy vị trí. Người dùng có thể kéo thả ghim trên bản đồ để
                  định vị lại chính xác mà ô địa chỉ KHÔNG bị thay đổi.
                </p>
              </div>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">
                Khối 5 • Map Location
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <Field
                label={`Địa chỉ hiển thị (${locale.toUpperCase()})`}
                full
                hint="Nhập địa chỉ bất động sản (VD: 120 Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn)"
              >
                <input
                  value={v.address[locale] ?? ''}
                  onChange={(e) => setLocalized('address', e.target.value)}
                  className={inputClass}
                  placeholder="VD: 120 Võ Nguyên Giáp, Ngũ Hành Sơn, Đà Nẵng"
                />
              </Field>
              <Field label="Phường / Xã">
                <input
                  value={v.ward}
                  onChange={(e) => set('ward', e.target.value)}
                  className={inputClass}
                  placeholder="VD: Mỹ An"
                />
              </Field>
              <Field label="Quận / Huyện">
                <input
                  value={v.district}
                  onChange={(e) => set('district', e.target.value)}
                  className={inputClass}
                  placeholder="VD: Ngũ Hành Sơn"
                />
              </Field>
            </div>

            {/* Interactive Map Picker */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-bold text-navy flex items-center gap-1.5">
                  🗺 Bản đồ định vị Leaflet (Kéo thả ghim để tinh chỉnh toạ độ):
                </label>
                <span className="text-[11px] text-muted font-mono">
                  Toạ độ:{' '}
                  <strong className="text-navy">
                    {v.lat?.toFixed(5) ?? 'Chưa chọn'}, {v.lng?.toFixed(5) ?? 'Chưa chọn'}
                  </strong>
                </span>
              </div>

              <MapPicker
                latitude={v.lat}
                longitude={v.lng}
                onChangeLocation={(lat, lng) => {
                  setV((prev) => ({ ...prev, lat, lng }));
                  setDirty(true);
                }}
                className="h-[340px] w-full rounded-lg border border-line shadow-xs overflow-hidden"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Control Sidebar ───────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <FormCard title="Xuất bản">
            <div className="grid gap-3">
              <Field label="Trạng thái">
                <select
                  value={v.publishState}
                  onChange={(e) => {
                    const s = e.target.value as PropertyFormValue['publishState'];
                    setV((prev) => ({ ...prev, publishState: s, isPublic: s === 'published' }));
                    setDirty(true);
                  }}
                  className={inputClass}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </Field>

              <Toggle
                checked={v.isPublic}
                onChange={(b) => set('isPublic', b)}
                label="Công khai trên website"
                desc="Tắt để ẩn bất động sản khỏi trang tìm kiếm"
              />
              <Toggle checked={v.isFeatured} onChange={(b) => set('isFeatured', b)} label="BĐS nổi bật" />
              <Toggle checked={v.isVerified} onChange={(b) => set('isVerified', b)} label="Đã xác thực" />
            </div>
          </FormCard>

          <FormCard title="SEO & Đường dẫn">
            <div className="grid gap-4">
              <Field
                label="Đường dẫn (slug)"
                hint={isNew ? 'Bỏ trống để tự sinh từ tên.' : 'Đổi slug sẽ làm hỏng link cũ đã chia sẻ.'}
              >
                <input
                  value={v.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  className={inputClass}
                  placeholder="tu-sinh-tu-ten"
                />
              </Field>
              <Field
                label={`Tiêu đề SEO (${locale.toUpperCase()})`}
                hint={`${(v.seoTitle[locale] ?? '').length} / 60 ký tự`}
              >
                <input
                  value={v.seoTitle[locale] ?? ''}
                  onChange={(e) => setLocalized('seoTitle', e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field
                label={`Mô tả meta (${locale.toUpperCase()})`}
                hint={`${(v.seoDescription[locale] ?? '').length} / 160 ký tự`}
              >
                <textarea
                  rows={3}
                  value={v.seoDescription[locale] ?? ''}
                  onChange={(e) => setLocalized('seoDescription', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormCard>
        </div>
      </div>

      <SaveBar
        saving={saving}
        dirty={dirty}
        onSave={save}
        onCancel={() => router.push('/admin/properties')}
        saveLabel={isNew ? 'Tạo bất động sản' : 'Lưu thay đổi'}
        error={error}
        message={message}
      />
    </div>
  );
}
