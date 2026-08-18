'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import { LOCALES } from '@/config/locales';
import { actionAddMediaByUrl, actionDeleteProperty, actionSaveProperty } from '@/server/actions/admin-actions';

import { Field, FormCard, LocaleTabs, SaveBar, Toggle, inputClass } from '../../../_components/form-kit';
import { IcPlus, IcTrash } from '../../../_components/icons';

export interface PropertyFormValue {
  id: string | null;
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>; // nhiều đoạn, ngăn bằng dòng trống
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
  const [imageUrl, setImageUrl] = useState('');

  const isNew = initial.id === null;

  function set<K extends keyof PropertyFormValue>(key: K, value: PropertyFormValue[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setMessage(null);
  }

  function setLocalized(key: 'title' | 'summary' | 'description' | 'address' | 'seoTitle' | 'seoDescription', text: string) {
    setV((prev) => ({ ...prev, [key]: { ...prev[key], [locale]: text } }));
    setDirty(true);
    setMessage(null);
  }

  function setSpec<K extends keyof PropertyFormValue['specs']>(key: K, value: PropertyFormValue['specs'][K]) {
    setV((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
    setDirty(true);
  }

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

  async function addImage() {
    const url = imageUrl.trim();
    if (!url) return;
    const res = await actionAddMediaByUrl(url, 'property');
    if (!res.ok || !res.id) {
      setError(res.ok ? 'Không thêm được ảnh' : res.message);
      return;
    }
    setV((prev) => ({
      ...prev,
      images: [...prev.images, { id: res.id!, url: res.url ?? url }],
      // Ảnh đầu tiên tự thành ảnh bìa — bỏ trống ảnh bìa là trang public không
      // có gì để hiện trong thẻ danh sách.
      coverId: prev.coverId ?? res.id!,
    }));
    setImageUrl('');
    setDirty(true);
    setError(null);
  }

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

  function buildPayload() {
    // Mô tả: mỗi đoạn cách nhau một dòng trống → mảng string, khớp schema.
    const description: Record<string, string[]> = {};
    for (const [l, text] of Object.entries(v.description)) {
      const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
      if (paras.length) description[l] = paras;
    }

    const clean = (o: Record<string, string>) =>
      Object.fromEntries(Object.entries(o).filter(([, val]) => val?.trim()));

    return {
      ...(v.slug ? { slug: v.slug } : {}),
      title: clean(v.title),
      summary: clean(v.summary),
      description,
      deal: v.deal,
      categoryId: v.categoryId,
      status: v.status,
      price: {
        usd: Number(v.priceUsd) || 0,
        // VND để null → service tự quy đổi theo tỷ giá cấu hình.
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
      setMessage(res.message ?? 'Đã lưu');
      router.push('/admin/properties');
    });
  }

  function remove() {
    if (!v.id) return;
    startSaving(async () => {
      const res = await actionDeleteProperty(v.id!);
      if (res.ok) router.push('/admin/properties');
      else setError(res.message);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/properties"
            className="text-muted hover:text-navy mb-1.5 inline-flex items-center gap-1 text-[12px] font-bold transition-colors"
          >
            ← Quay lại danh sách bất động sản
          </Link>
          <h1 className="text-navy text-[19px] leading-tight font-extrabold">
            {isNew ? 'Thêm bất động sản' : v.title.vi || v.title.en || 'Sửa bất động sản'}
          </h1>
          <p className="text-muted mt-1 text-[12.5px]">
            {isNew ? 'Điền thông tin rồi lưu để tin xuất hiện ngoài website.' : `Đường dẫn: /properties/${v.slug}`}
          </p>
        </div>
        {!isNew ? (
          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="h-9 rounded-md border border-[#e5b8b8] bg-white px-4 text-[12.5px] font-bold text-[#a33] transition-colors hover:bg-[#fdf4f4] disabled:opacity-60"
          >
            Xoá bất động sản
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-4">
          <FormCard title="Nội dung" desc="Chuyển tab ngôn ngữ để nhập từng thứ tiếng. Chấm vàng = đã có nội dung.">
            <LocaleTabs locales={LOCALES} current={locale} onChange={setLocale} filled={filled} />

            <div className="mt-4 grid gap-4">
              <Field label={`Tên bất động sản (${locale.toUpperCase()})`}>
                <input
                  value={v.title[locale] ?? ''}
                  onChange={(e) => setLocalized('title', e.target.value)}
                  className={inputClass}
                  placeholder="VD: Biệt thự Ocean Estate"
                />
              </Field>

              <Field label={`Mô tả ngắn (${locale.toUpperCase()})`} hint="Một câu, dùng cho thẻ danh sách và thẻ meta.">
                <textarea
                  rows={2}
                  value={v.summary[locale] ?? ''}
                  onChange={(e) => setLocalized('summary', e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label={`Mô tả chi tiết (${locale.toUpperCase()})`}
                hint="Cách nhau MỘT DÒNG TRỐNG để tách đoạn."
              >
                <textarea
                  rows={8}
                  value={v.description[locale] ?? ''}
                  onChange={(e) => setLocalized('description', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormCard>

          <FormCard title="Phân loại & giá">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hình thức">
                <select value={v.deal} onChange={(e) => set('deal', e.target.value as 'sale' | 'rent')} className={inputClass}>
                  <option value="sale">Bán</option>
                  <option value="rent">Cho thuê</option>
                </select>
              </Field>

              <Field label="Nhóm bất động sản">
                <select value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputClass}>
                  {options.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Giá (USD)" hint="Chỉ nhập USD — giá VND tự quy đổi theo tỷ giá cấu hình.">
                <input
                  type="number"
                  min={0}
                  value={v.priceUsd}
                  onChange={(e) => set('priceUsd', Number(e.target.value))}
                  className={inputClass}
                />
              </Field>

              <Field label="Đơn vị giá">
                <select
                  value={v.pricePeriod}
                  onChange={(e) => set('pricePeriod', e.target.value as 'total' | 'month')}
                  className={inputClass}
                >
                  <option value="total">Tổng giá</option>
                  <option value="month">Mỗi tháng</option>
                </select>
              </Field>

              <Field label="Tình trạng">
                <select value={v.status} onChange={(e) => set('status', e.target.value as PropertyFormValue['status'])} className={inputClass}>
                  <option value="available">Đang trống</option>
                  <option value="pending">Sắp trống</option>
                  <option value="sold">Đã bán</option>
                  <option value="rented">Đã cho thuê</option>
                </select>
              </Field>

              <div className="flex items-end">
                <label className="text-navy flex cursor-pointer items-center gap-2.5 text-[13px]">
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
          </FormCard>

          <FormCard title="Thông số kỹ thuật">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Field label="Phòng ngủ">
                <input type="number" min={0} value={v.specs.bedrooms} onChange={(e) => setSpec('bedrooms', Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Phòng tắm">
                <input type="number" min={0} value={v.specs.bathrooms} onChange={(e) => setSpec('bathrooms', Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="DT trong nhà (m²)">
                <input type="number" min={0} value={v.specs.internalArea} onChange={(e) => setSpec('internalArea', Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="DT đất (m²)">
                <input type="number" min={0} value={v.specs.landArea ?? ''} onChange={(e) => setSpec('landArea', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Số tầng">
                <input type="number" min={0} value={v.specs.floors ?? ''} onChange={(e) => setSpec('floors', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Năm xây dựng">
                <input type="number" min={1900} value={v.specs.yearBuilt ?? ''} onChange={(e) => setSpec('yearBuilt', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Chỗ đỗ xe">
                <input type="number" min={0} value={v.specs.parking ?? ''} onChange={(e) => setSpec('parking', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Nội thất">
                <select value={v.specs.furnishing} onChange={(e) => setSpec('furnishing', e.target.value as 'full' | 'basic' | 'none')} className={inputClass}>
                  <option value="full">Đầy đủ</option>
                  <option value="basic">Cơ bản</option>
                  <option value="none">Nhà trống</option>
                </select>
              </Field>
              <Field label="Sở hữu">
                <select value={v.specs.ownership} onChange={(e) => setSpec('ownership', e.target.value as 'freehold' | 'leasehold')} className={inputClass}>
                  <option value="freehold">Lâu dài</option>
                  <option value="leasehold">Có thời hạn</option>
                </select>
              </Field>
            </div>
          </FormCard>

          <FormCard title="Hình ảnh" desc="Ảnh đầu tiên là ảnh bìa. Kéo thứ tự bằng nút mũi tên.">
            <div className="flex gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void addImage();
                  }
                }}
                placeholder="Dán đường dẫn ảnh (https://…)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => void addImage()}
                className="bg-navy hover:bg-gold inline-flex h-[38px] shrink-0 items-center gap-1.5 rounded-md px-3.5 text-[12.5px] font-bold text-white transition-colors"
              >
                <IcPlus size={13} />
                Thêm
              </button>
            </div>

            {v.images.length === 0 ? (
              <p className="border-line text-muted mt-3 rounded-md border border-dashed px-3 py-6 text-center text-[12px]">
                Chưa có ảnh nào. Tin không ảnh sẽ hiện ảnh mặc định ngoài website.
              </p>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {v.images.map((img, i) => (
                  <li key={img.id} className="border-line relative overflow-hidden rounded-md border">
                    <span className="bg-ivory relative block aspect-[4/3]">
                      <Image src={img.url} alt="" fill sizes="200px" className="object-cover" />
                    </span>
                    {v.coverId === img.id ? (
                      <span className="bg-gold text-navy absolute top-1.5 left-1.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase">
                        Ảnh bìa
                      </span>
                    ) : null}
                    <div className="flex items-center justify-between gap-1 px-1.5 py-1.5">
                      <span className="flex gap-1">
                        <button type="button" onClick={() => moveImage(img.id, -1)} disabled={i === 0} className="text-muted hover:text-navy px-1 text-[13px] disabled:opacity-30">←</button>
                        <button type="button" onClick={() => moveImage(img.id, 1)} disabled={i === v.images.length - 1} className="text-muted hover:text-navy px-1 text-[13px] disabled:opacity-30">→</button>
                      </span>
                      <span className="flex gap-1">
                        {v.coverId !== img.id ? (
                          <button type="button" onClick={() => set('coverId', img.id)} className="text-gold px-1 text-[10px] font-bold uppercase">
                            Bìa
                          </button>
                        ) : null}
                        <button type="button" onClick={() => removeImage(img.id)} aria-label="Xoá ảnh" className="px-1 text-[#a33]">
                          <IcTrash size={12} />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </FormCard>

          <FormCard title="Tiện ích">
            {amenitiesByGroup.map(([group, items]) => (
              <div key={group} className="mb-4 last:mb-0">
                <p className="text-muted mb-2 text-[11px] font-bold tracking-wider uppercase">
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
                            ? 'border-gold bg-gold/12 text-[#8f6614] rounded-full border px-3 py-1.5 text-[12px] font-bold'
                            : 'border-line text-muted hover:border-gold rounded-full border px-3 py-1.5 text-[12px] transition-colors'
                        }
                      >
                        {a.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </FormCard>

          <FormCard title="Vị trí">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Địa chỉ (${locale.toUpperCase()})`} full>
                <input value={v.address[locale] ?? ''} onChange={(e) => setLocalized('address', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Phường / Xã">
                <input value={v.ward} onChange={(e) => set('ward', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Quận / Huyện">
                <input value={v.district} onChange={(e) => set('district', e.target.value)} className={inputClass} />
              </Field>
              <Field label="Vĩ độ (lat)" hint="Để trống nếu chưa có toạ độ.">
                <input type="number" step="any" value={v.lat ?? ''} onChange={(e) => set('lat', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
              <Field label="Kinh độ (lng)">
                <input type="number" step="any" value={v.lng ?? ''} onChange={(e) => set('lng', e.target.value === '' ? null : Number(e.target.value))} className={inputClass} />
              </Field>
            </div>
          </FormCard>
        </div>

        <div className="flex flex-col gap-4">
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
                desc="Tắt để duyệt xong nhưng chưa cho khách xem"
              />
              <Toggle checked={v.isFeatured} onChange={(b) => set('isFeatured', b)} label="BĐS nổi bật" />
              <Toggle checked={v.isVerified} onChange={(b) => set('isVerified', b)} label="Đã xác thực" />
            </div>
          </FormCard>

          <FormCard title="SEO">
            <div className="grid gap-4">
              <Field label="Đường dẫn (slug)" hint={isNew ? 'Bỏ trống để tự sinh từ tên.' : 'Đổi slug sẽ làm hỏng link cũ đã chia sẻ.'}>
                <input value={v.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} placeholder="tu-sinh-tu-ten" />
              </Field>
              <Field label={`Tiêu đề SEO (${locale.toUpperCase()})`} hint={`${(v.seoTitle[locale] ?? '').length} / 60 ký tự`}>
                <input value={v.seoTitle[locale] ?? ''} onChange={(e) => setLocalized('seoTitle', e.target.value)} className={inputClass} />
              </Field>
              <Field label={`Mô tả meta (${locale.toUpperCase()})`} hint={`${(v.seoDescription[locale] ?? '').length} / 160 ký tự`}>
                <textarea rows={3} value={v.seoDescription[locale] ?? ''} onChange={(e) => setLocalized('seoDescription', e.target.value)} className={inputClass} />
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
