'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';

import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(
  () => import('@/components/editor/rich-text-editor').then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border-line text-muted rounded-md border px-4 py-8 text-center text-[13px]">
        Đang tải trình soạn thảo…
      </div>
    ),
  },
);
import { DraftRestoreBar } from '@/components/ui/draft-restore-bar';
import { ImageDropZone } from '@/components/ui/image-drop-zone';
import { LOCALES } from '@/config/locales';
import { useDraftBackup } from '@/hooks/use-draft-backup';
import { useLeaveGuard } from '@/hooks/use-leave-guard';
import {
  actionAddMediaByUrl,
  actionDeleteArticle,
  actionSaveArticle,
  actionTranslateArticle,
} from '@/server/actions/admin-actions';

import { FormCard, LocaleTabs, SaveBar, Toggle, inputClass } from '../../../_components/form-kit';

import { CategoryQuickAdd } from './category-quick-add';
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
  modelName,
  authorName,
}: {
  initial: ArticleFormValue;
  categories: { id: string; name: string }[];
  /** Có khoá AI hay không — quyết định hiện nút dựng bài và dịch. */
  translationEnabled: boolean;
  /** Model đang chạy, hiện cho biên tập biết bài do đâu ra. */
  modelName: string;
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
  // Danh sách chuyên mục là state chứ không dùng thẳng prop: tạo chuyên mục mới
  // ngay tại chỗ phải hiện ra ô chọn liền, không đợi tải lại trang.
  const [cats, setCats] = useState(categories);

  /*
   * Giữ hộ bản nháp và cảnh báo khi rời trang lúc chưa lưu.
   *
   * Khoá gắn với id bài; bài chưa tạo dùng 'new'. Chỉ bật khi `dirty` để mở bài
   * cũ ra xem rồi thoát không tạo ra nháp thừa.
   */
  const draft = useDraftBackup<ArticleFormValue>({
    key: initial.id ?? 'new',
    value: v,
    enabled: dirty,
  });

  // Chặn cả điều hướng nội bộ, không chỉ đóng tab — bấm nhầm một liên kết
  // trong CMS là mất sạch form mà không có cảnh báo nào.
  useLeaveGuard({ when: dirty, message: 'Bài viết này còn thay đổi chưa lưu. Bản nháp đã được giữ lại, nhưng bạn có chắc muốn rời trang?' });

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

  const currentCategoryName = useMemo(() => {
    const found = cats.find((c) => c.id === v.categoryId);
    return found ? found.name : 'Chưa chọn chuyên mục';
  }, [cats, v.categoryId]);

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
      // Đã lên server rồi thì nháp không còn việc gì; để lại sẽ hỏi khôi phục
      // một bản cũ hơn chính bài vừa lưu.
      draft.clear();
      setMessage(res.message ?? 'Đã lưu');
      router.push('/admin/news');
    });
  }

  function remove() {
    if (!v.id) return;
    startSaving(async () => {
      const res = await actionDeleteArticle(v.id!);
      if (res.ok) {
        draft.clear();
        router.push('/admin/news');
      }
      else setError(res.message);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {draft.found ? (
        <DraftRestoreBar
          savedAt={draft.found.savedAt}
          label={'Tìm thấy bản nháp bài viết chưa lưu'}
          onRestore={() => {
            setV(draft.found!.value);
            setDirty(true);
            draft.discard();
            setMessage('Đã khôi phục bản nháp — kiểm tra rồi bấm Lưu.');
          }}
          onDiscard={draft.discard}
        />
      ) : null}

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 border border-line shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/news"
              className="text-muted hover:text-navy text-[12px] font-bold inline-flex items-center gap-1 transition-colors"
            >
              ← Quay lại danh sách tin tức
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-navy text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
              WYSIWYG CANVAS
            </span>
            <h1 className="text-navy text-[18px] font-extrabold leading-tight">
              {isNew ? 'Soạn thảo bài viết mới' : v.title.vi || v.title.en || 'Chỉnh sửa bài viết'}
            </h1>
          </div>
          <p className="text-muted mt-1 text-[12px]">
            Giao diện mô phỏng 100% trang đọc tin thực tế. Bấm trực tiếp vào vị trí cần sửa để cập nhật.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={v.slug ? `/news/${v.slug}` : '/news'}
            target="_blank"
            className="border border-line text-navy hover:border-gold hover:text-gold px-3.5 py-1.5 text-[12px] font-bold transition-colors inline-flex items-center gap-1.5 bg-paper"
          >
            👁 Xem bài trên Web ↗
          </Link>

          {!isNew && (
            <button
              type="button"
              onClick={remove}
              disabled={saving}
              className="h-8 rounded-none border border-red-200 bg-white px-3.5 text-[12px] font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60 cursor-pointer"
            >
              Xoá bài viết
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Visual Article Canvas — Right Control Panel */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        
        {/* ── LEFT COLUMN: Google Forms Style Standalone Block Cards ─────────────────────────── */}
        <div className="flex flex-col gap-5 animate-fade-in min-w-0">

          {/* AI Quick Generator Card */}
          <div className="bg-white border border-line p-4 rounded-xl shadow-xs">
            <ComposePanel
              locale={locale}
              localeLabel={LOCALE_LABEL[locale] ?? locale}
              hasContent={Boolean((v.content[locale] ?? '').trim())}
              canTranslate={translationEnabled}
              modelName={modelName}
              onComposed={(r) => {
                setV((p) => {
                  const next = {
                    ...p,
                    title: { ...p.title, [locale]: r.article.title },
                    excerpt: { ...p.excerpt, [locale]: r.article.excerpt },
                    content: { ...p.content, [locale]: r.article.content },
                    tags: r.article.tags,
                  };
                  for (const [l, t] of Object.entries(r.translations)) {
                    next.title[l] = t.title;
                    next.excerpt[l] = t.excerpt;
                    next.content[l] = t.content;
                  }
                  return next;
                });
                setDirty(true);

                const langs = Object.keys(r.translations).length;
                const built = `Đã dựng bài ${r.stats.words} từ, ${r.stats.headings} mục, ${r.stats.callouts} hộp ghi nhớ`;
                const failed = r.failedLocales.length
                  ? ` Chưa dịch được: ${r.failedLocales
                      .map((f) => LOCALE_LABEL[f.locale] ?? f.locale)
                      .join(', ')} — bấm "Dịch" để thử lại.`
                  : '';
                setMessage(
                  langs > 0
                    ? `${built}, kèm ${langs} bản dịch.${failed}`
                    : `${built}.${failed}`,
                );
              }}
            />
          </div>

          {/* Category & Language Header Card */}
          <div className="bg-white border border-line p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="text-muted">Trang chủ</span>
              <span className="text-muted">/</span>
              <span className="text-muted">Tin tức</span>
              <span className="text-muted">/</span>
              <span className="text-gold font-bold uppercase tracking-wider">{currentCategoryName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted text-[11px] font-bold uppercase">Ngôn ngữ soạn:</span>
              <LocaleTabs locales={LOCALES} current={locale} onChange={setLocale} filled={filled} />
            </div>
          </div>

          {/* 1. TITLE BLOCK CARD */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                ✏️ Tiêu đề bài viết ({LOCALE_LABEL[locale]}):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">Khối 1 • Title Block</span>
            </div>
            <textarea
              rows={2}
              value={v.title[locale] ?? ''}
              onChange={(e) => setLoc('title', e.target.value)}
              placeholder="Nhập tiêu đề bài viết tại đây..."
              className="font-display text-navy text-[26px] sm:text-[34px] lg:text-[40px] font-normal leading-[1.2] w-full bg-paper/50 border border-dashed border-line group-hover:border-gold p-3.5 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all resize-none rounded-lg placeholder:text-navy/30"
            />
          </div>

          {/* 2. AUTHOR & SLUG INFO CARD */}
          <div className="bg-white border border-line p-4 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-navy text-gold border border-gold/40 grid place-items-center font-bold text-[13px] rounded-lg">
                {authorName ? authorName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <p className="text-navy text-[13px] font-bold">{authorName || 'Quản trị viên'}</p>
                <p className="text-muted text-[11px]">Chuyên viên biên tập Da Nang Homes &amp; Living</p>
              </div>
            </div>

            <div className="text-[11px] text-muted font-mono bg-ivory/60 border border-line px-3 py-1.5 rounded-lg">
              Slug: <span className="text-navy font-bold">{v.slug || 'chua-tao-slug'}</span>
            </div>
          </div>

          {/* 3. COVER IMAGE HERO BLOCK CARD */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                🖼 Ảnh bìa chính của bài viết:
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">Khối 2 • Cover Image</span>
            </div>

            {v.coverUrl ? (
              <div className="border-line relative h-[280px] sm:h-[360px] overflow-hidden border rounded-lg bg-navy/5 shadow-xs">
                <Image
                  src={v.coverUrl}
                  alt="Cover preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setV((p) => ({ ...p, coverId: null, coverUrl: null }))}
                    className="bg-red-600 text-white px-4 py-2 text-[12px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md rounded-md cursor-pointer"
                  >
                    🗑 Xoá ảnh bìa
                  </button>
                </div>
              </div>
            ) : (
              <ImageDropZone
                ownerType="article"
                label="Kéo ảnh bìa vào đây, bấm để chọn tệp, hoặc dán ảnh (Ctrl+V)"
                hint="Ảnh được thu nhỏ rồi tải lên Cloudflare R2. JPG, PNG, WebP hoặc GIF."
                onUploaded={(img) => {
                  setV((p) => ({ ...p, coverId: img.id, coverUrl: img.url }));
                  setDirty(true);
                  setError(null);
                }}
              />
            )}
          </div>

          {/* 4. EXCERPT / SUMMARY BLOCK CARD */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                💬 Tóm tắt bài viết (Quote Excerpt - {LOCALE_LABEL[locale]}):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">Khối 3 • Excerpt</span>
            </div>
            <div className="border-gold border-l-4 bg-ivory/30 p-3.5 rounded-r-lg shadow-xs">
              <textarea
                rows={2}
                value={v.excerpt[locale] ?? ''}
                onChange={(e) => setLoc('excerpt', e.target.value)}
                placeholder="Nhập tóm tắt ngắn bài viết (1-2 câu cô đọng hiển thị nổi bật ở đầu bài và trang danh sách tin tức)..."
                className="font-display text-navy text-[17px] sm:text-[19px] font-normal italic leading-relaxed w-full bg-transparent border-none focus:outline-none placeholder:text-muted/40 resize-none"
              />
            </div>
          </div>

          {/* 5. MAIN CONTENT EDITOR BLOCK CARD */}
          <div className="bg-white border border-line p-5 sm:p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow relative group">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                ✍️ Nội dung bài viết chi tiết ({LOCALE_LABEL[locale]}):
              </label>
              <span className="text-[10px] text-muted font-mono bg-ivory px-2 py-0.5 rounded border border-line">Khối 4 • Content Body</span>
            </div>

            <RichTextEditor
              value={v.content[locale] ?? ''}
              onChange={(html) => setLoc('content', html)}
              contentKey={locale}
              placeholder="Bắt đầu gõ nội dung chi tiết bài viết tại đây. Sử dụng công cụ chèn ảnh, ghi nhớ, tiêu đề để định dạng..."
            />

            {/* HASHTAGS DISPLAY */}
            {v.tags.length > 0 && (
              <div className="border-line border-t mt-6 pt-4">
                <span className="text-muted block mb-2 text-[11px] font-bold tracking-wider uppercase">
                  Hashtag bài viết (Bấm để xoá)
                </span>
                <div className="flex flex-wrap gap-2">
                  {v.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('tags', v.tags.filter((x) => x !== t))}
                      className="bg-paper border-line text-navy hover:border-red-400 hover:text-red-600 border px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer rounded-md"
                    >
                      #{t} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Sidebar Controls & Tools ─────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Quick AI Translate Bar */}
          {translationEnabled && (
            <div className="bg-gold/10 border border-gold/40 p-4 rounded-none shadow-xs">
              <h4 className="text-navy text-[13px] font-extrabold flex items-center gap-1.5 mb-1">
                <span>✨ Dịch tự động AI</span>
              </h4>
              <p className="text-muted text-[11.5px] mb-3">
                Dịch nhanh toàn bộ bài viết từ <strong className="text-navy">{LOCALE_LABEL[locale]}</strong> sang 3 ngôn ngữ còn lại.
              </p>
              <button
                type="button"
                onClick={translate}
                disabled={translating}
                className="w-full bg-gold hover:bg-navy text-navy hover:text-white py-2.5 px-3 text-[11.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer border border-gold disabled:opacity-60"
              >
                {translating ? 'Đang dịch 3 ngôn ngữ...' : `🌐 Dịch từ ${LOCALE_LABEL[locale]} sang 3 ngôn ngữ`}
              </button>
            </div>
          )}

          {/* Publish Settings */}
          <FormCard title="Cấu hình xuất bản">
            <div className="grid gap-4">
              <div>
                <label className="text-navy mb-1 block text-[11px] font-bold tracking-wider uppercase">
                  Trạng thái bài
                </label>
                <select
                  value={v.publishState}
                  onChange={(e) => set('publishState', e.target.value as ArticleFormValue['publishState'])}
                  className={inputClass}
                >
                  <option value="draft">Bản nháp (Draft)</option>
                  <option value="published">Đã xuất bản (Public)</option>
                  <option value="archived">Lưu trữ (Archived)</option>
                </select>
              </div>

              <div>
                <label className="text-navy mb-1 block text-[11px] font-bold tracking-wider uppercase">
                  Chuyên mục
                </label>
                <select value={v.categoryId} onChange={(e) => set('categoryId', e.target.value)} className={inputClass}>
                  {cats.length === 0 ? <option value="">— chưa có chuyên mục —</option> : null}
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <CategoryQuickAdd
                  onCreated={(c) => {
                    setCats((p) => [...p, c]);
                    set('categoryId', c.id);
                  }}
                />
              </div>

              <Toggle checked={v.isFeatured} onChange={(b) => set('isFeatured', b)} label="Bài nổi bật (Featured)" />
            </div>

            {missingLocales.length > 0 && (
              <p className="border-line-soft text-muted mt-3 border-t pt-3 text-[11.5px]">
                Chưa có nội dung: <b className="text-navy">{missingLocales.map((l) => LOCALE_LABEL[l]).join(', ')}</b>
              </p>
            )}
          </FormCard>

          {/* Cover Image Setting Input */}
          <FormCard title="Ảnh bìa bài viết">
            {v.coverUrl ? (
              <div className="bg-ivory border-line relative mb-3 block aspect-[16/10] overflow-hidden border">
                <Image src={v.coverUrl} alt="" fill sizes="320px" className="object-cover" />
              </div>
            ) : null}

            <ImageDropZone
              compact
              ownerType="article"
              label={v.coverUrl ? 'Đổi ảnh bìa khác' : 'Kéo ảnh vào đây hoặc bấm để chọn'}
              hint="Ảnh sẽ được tải lên Cloudflare R2."
              onUploaded={(img) => {
                setV((p) => ({ ...p, coverId: img.id, coverUrl: img.url }));
                setDirty(true);
                setError(null);
              }}
            />

            {/* Dán URL vẫn giữ lại: nhiều bài lấy ảnh từ nguồn ngoài, và đây là
                đường thoát khi R2 lỗi. Xếp xuống dưới vì tải tệp mới là việc
                thường làm. */}
            <details className="mt-2.5">
              <summary className="text-muted hover:text-navy cursor-pointer text-[11.5px]">
                Hoặc dán đường dẫn ảnh có sẵn
              </summary>
              <div className="mt-2 flex gap-2">
                <input
                  value={coverInput}
                  onChange={(e) => setCoverInput(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => void setCover()}
                  className="bg-navy hover:bg-gold h-[38px] shrink-0 px-3.5 text-[12px] font-bold text-white transition-colors cursor-pointer"
                >
                  Đặt
                </button>
              </div>
            </details>
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

