'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { LOCALES } from '@/config/locales';
import {
  actionAddMediaByUrl,
  actionDeleteArticle,
  actionSaveArticle,
  actionTranslateArticle,
} from '@/server/actions/admin-actions';

import { Field, FormCard, LocaleTabs, SaveBar, Toggle, inputClass } from '../../../_components/form-kit';
import { ComposePanel } from './compose-panel';

export interface ArticleFormValue {
  id: string | null;
  slug: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  /** HTML từ trình soạn thảo, không còn là Markdown. */
  content: Record<string, string>;
  categoryId: string;
  coverId: string | null;
  coverUrl: string | null;
  /** Hashtag do AI sinh khi dựng bài. Không nhập tay. */
  tags: string[];
  isFeatured: boolean;
  publishState: 'draft' | 'published' | 'archived';
}

const LOCALE_LABEL: Record<string, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  zh: '中文',
  ko: '한국어',
};

export function ArticleForm({
  initial,
  categories,
  translationEnabled,
  authorName,
}: {
  initial: ArticleFormValue;
  categories: { id: string; name: string }[];
  /** Có GEMINI_API_KEY hay không — quyết định hiện nút dịch. */
  translationEnabled: boolean;
  /** Tên admin đang đăng nhập; hiển thị để biết bài sẽ đứng tên ai. */
  authorName: string;
}) {
  const router = useRouter();
  const [v, setV] = useState<ArticleFormValue>(initial);
  const [locale, setLocale] = useState('vi');
  const [saving, startSaving] = useTransition();
  const [translating, startTranslating] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [coverInput, setCoverInput] = useState('');

  const isNew = initial.id === null;

  function set<K extends keyof ArticleFormValue>(k: K, val: ArticleFormValue[K]) {
    setV((p) => ({ ...p, [k]: val }));
    setDirty(true);
    setMessage(null);
  }

  function setLoc(k: 'title' | 'excerpt' | 'content', text: string) {
    setV((p) => ({ ...p, [k]: { ...p[k], [locale]: text } }));
    setDirty(true);
    setMessage(null);
  }

  const filled = useMemo(
    () => Object.fromEntries(LOCALES.map((l) => [l, Boolean(v.title[l]?.trim())])),
    [v.title],
  );

  const missingLocales = LOCALES.filter((l) => !v.title[l]?.trim());

  async function setCover() {
    const url = coverInput.trim();
    if (!url) return;
    const res = await actionAddMediaByUrl(url, 'article');
    if (!res.ok || !res.id) {
      setError(res.ok ? 'Không thêm được ảnh' : res.message);
      return;
    }
    setV((p) => ({ ...p, coverId: res.id!, coverUrl: res.url ?? url }));
    setCoverInput('');
    setDirty(true);
    setError(null);
  }

  /** Dịch từ ngôn ngữ đang mở sang các ngôn ngữ còn lại. */
  function translate() {
    setError(null);
    setMessage(null);

    const title = v.title[locale] ?? '';
    const content = v.content[locale] ?? '';
    if (!title.trim() && !content.trim()) {
      setError('Viết xong bản gốc rồi mới dịch được.');
      return;
    }

    startTranslating(async () => {
      const res = await actionTranslateArticle(
        { title, excerpt: v.excerpt[locale] ?? '', content },
        locale,
      );

      if (!res.ok) {
        setError(res.message);
        return;
      }

      setV((p) => {
        const next = { ...p, title: { ...p.title }, excerpt: { ...p.excerpt }, content: { ...p.content } };
        for (const [l, t] of Object.entries(res.translations)) {
          next.title[l] = t.title;
          next.excerpt[l] = t.excerpt;
          next.content[l] = t.content;
        }
        return next;
      });
      setDirty(true);

      const done = Object.keys(res.translations).length;
      setMessage(
        res.failed.length
          ? `Đã dịch ${done} ngôn ngữ. Lỗi: ${res.failed.map((f) => LOCALE_LABEL[f.locale] ?? f.locale).join(', ')}`
          : `Đã dịch xong ${done} ngôn ngữ — kiểm tra lại trước khi lưu.`,
      );
    });
  }

  function save() {
    setError(null);
    setMessage(null);

    const clean = (o: Record<string, string>) =>
      Object.fromEntries(Object.entries(o).filter(([, val]) => val?.trim()));

    startSaving(async () => {
      const res = await actionSaveArticle(v.id, {
        ...(v.slug ? { slug: v.slug } : {}),
        title: clean(v.title),
        excerpt: clean(v.excerpt),
        content: clean(v.content),
        categoryId: v.categoryId,
        tags: v.tags,
        coverId: v.coverId,
        isFeatured: v.isFeatured,
        publishState: v.publishState,
      });

      if (!res.ok) {
        const first = res.fields ? Object.entries(res.fields)[0] : null;
        setError(first ? `${first[0]}: ${first[1][0]}` : res.message);
        return;
      }
      setDirty(false);
      setMessage(res.message ?? 'Đã lưu');
      if (isNew && res.id) router.replace(`/admin/news/${res.id}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!v.id) return;
    startSaving(async () => {
      const res = await actionDeleteArticle(v.id!);
      if (res.ok) router.push('/admin/news');
      else setError(res.message);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-navy text-[19px] leading-tight font-extrabold">
            {isNew ? 'Viết bài mới' : v.title.vi || v.title.en || 'Sửa bài viết'}
          </h1>
          <p className="text-muted mt-1 text-[12.5px]">
            Tác giả: <b className="text-navy">{authorName}</b>
            {!isNew ? <> · Đường dẫn: /tips/{v.slug}</> : null}
          </p>
        </div>
        {!isNew ? (
          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="h-9 rounded-md border border-[#e5b8b8] bg-white px-4 text-[12.5px] font-bold text-[#a33] transition-colors hover:bg-[#fdf4f4] disabled:opacity-60"
          >
            Xoá bài viết
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          <FormCard
            title="Nội dung bài viết"
            desc="Soạn ở đây hiện đúng như ngoài website. Bôi đen chữ hoặc bấm chuột phải để định dạng."
          >
            <div className="mb-4">
              <ComposePanel
                locale={locale}
                localeLabel={LOCALE_LABEL[locale] ?? locale}
                hasContent={Boolean((v.content[locale] ?? '').trim())}
                canTranslate={translationEnabled}
                onComposed={(r) => {
                  setV((p) => {
                    const next = {
                      ...p,
                      title: { ...p.title, [locale]: r.article.title },
                      excerpt: { ...p.excerpt, [locale]: r.article.excerpt },
                      content: { ...p.content, [locale]: r.article.content },
                      tags: r.article.tags,
                    };
                    // Đổ luôn các bản dịch nếu có, để bài lên web đủ 4 ngôn ngữ
                    // mà không phải bấm thêm nút nào.
                    for (const [l, t] of Object.entries(r.translations)) {
                      next.title[l] = t.title;
                      next.excerpt[l] = t.excerpt;
                      next.content[l] = t.content;
                    }
                    return next;
                  });
                  setDirty(true);

                  const langs = Object.keys(r.translations).length;
                  const failed = r.failedLocales
                    .map((f) => LOCALE_LABEL[f.locale] ?? f.locale)
                    .join(', ');
                  setMessage(
                    `Đã dựng bài ${r.stats.words} từ · ${r.stats.headings} mục · ${r.stats.callouts} hộp ghi nhớ` +
                      (langs ? ` · dịch xong ${langs} ngôn ngữ` : '') +
                      (failed ? ` · lỗi: ${failed}` : '') +
                      ' — đọc lại trước khi lưu.',
                  );
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <LocaleTabs locales={LOCALES} current={locale} onChange={setLocale} filled={filled} />

              {translationEnabled ? (
                <button
                  type="button"
                  onClick={translate}
                  disabled={translating}
                  title={`Dịch từ ${LOCALE_LABEL[locale]} sang các ngôn ngữ còn lại`}
                  className="border-gold text-[#8f6614] hover:bg-gold/10 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border px-3 text-[12px] font-bold transition-colors disabled:opacity-60"
                >
                  {translating ? 'Đang dịch…' : `✨ Dịch từ ${LOCALE_LABEL[locale]} sang 3 ngôn ngữ`}
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid gap-4">
              <Field label={`Tiêu đề (${LOCALE_LABEL[locale]})`}>
                <input
                  value={v.title[locale] ?? ''}
                  onChange={(e) => setLoc('title', e.target.value)}
                  className={inputClass}
                  placeholder="Tiêu đề bài viết"
                />
              </Field>

              <Field
                label={`Tóm tắt (${LOCALE_LABEL[locale]})`}
                hint="1–2 câu, hiện ở thẻ bài viết ngoài trang Tin tức."
              >
                <textarea
                  rows={2}
                  value={v.excerpt[locale] ?? ''}
                  onChange={(e) => setLoc('excerpt', e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div>
                <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
                  Nội dung ({LOCALE_LABEL[locale]})
                </label>
                <RichTextEditor
                  value={v.content[locale] ?? ''}
                  onChange={(html) => setLoc('content', html)}
                  contentKey={locale}
                  placeholder="Bắt đầu viết nội dung bài…"
                />
              </div>

              {v.tags.length > 0 ? (
                <div>
                  <label className="text-navy mb-1.5 block text-[11px] font-bold tracking-wider uppercase">
                    Hashtag <span className="text-muted font-medium normal-case">— AI đề xuất, bấm để bỏ</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {v.tags.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set('tags', v.tags.filter((x) => x !== t))}
                        title="Bấm để bỏ"
                        className="bg-navy/6 text-navy hover:bg-[#fdf4f4] hover:text-[#a33] rounded px-2 py-1 text-[11.5px] font-bold transition-colors"
                      >
                        #{t} ×
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </FormCard>
        </div>

        <div className="flex flex-col gap-4">
          <FormCard title="Xuất bản">
            <div className="grid gap-3">
              <Field label="Trạng thái">
                <select
                  value={v.publishState}
                  onChange={(e) => set('publishState', e.target.value as ArticleFormValue['publishState'])}
                  className={inputClass}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </Field>

              <Field label="Chuyên mục">
                <select value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputClass}>
                  {categories.length === 0 ? <option value="">— chưa có chuyên mục —</option> : null}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Link
                  href="/admin/news?tab=categories"
                  className="text-gold hover:text-navy mt-1 inline-block text-[11px] font-bold transition-colors"
                >
                  + Thêm chuyên mục mới
                </Link>
              </Field>

              <Toggle checked={v.isFeatured} onChange={(b) => set('isFeatured', b)} label="Bài nổi bật" />
            </div>

            {missingLocales.length > 0 ? (
              <p className="border-line-soft text-muted mt-3 border-t pt-3 text-[11.5px]">
                Chưa có nội dung:{' '}
                <b className="text-navy">{missingLocales.map((l) => LOCALE_LABEL[l]).join(', ')}</b>
                {translationEnabled ? ' — bấm nút dịch phía trên để điền tự động.' : ''}
              </p>
            ) : null}
          </FormCard>

          <FormCard title="Ảnh bìa">
            {v.coverUrl ? (
              <span className="bg-ivory border-line relative mb-3 block aspect-[16/10] overflow-hidden rounded-md border">
                <Image src={v.coverUrl} alt="" fill sizes="320px" className="object-cover" />
              </span>
            ) : (
              <p className="border-line text-muted mb-3 rounded-md border border-dashed px-3 py-6 text-center text-[12px]">
                Chưa có ảnh bìa
              </p>
            )}
            <div className="flex gap-2">
              <input
                value={coverInput}
                onChange={(e) => setCoverInput(e.target.value)}
                placeholder="Dán đường dẫn ảnh…"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => void setCover()}
                className="bg-navy hover:bg-gold h-[38px] shrink-0 rounded-md px-3.5 text-[12.5px] font-bold text-white transition-colors"
              >
                Đặt
              </button>
            </div>
          </FormCard>
        </div>
      </div>

      <SaveBar
        saving={saving}
        dirty={dirty}
        onSave={save}
        onCancel={() => router.push('/admin/news')}
        saveLabel={isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
        error={error}
        message={message}
      />
    </div>
  );
}
