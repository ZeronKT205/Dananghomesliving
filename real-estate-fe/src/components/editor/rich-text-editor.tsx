'use client';

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef, useState } from 'react';

import { uploadImage } from '@/lib/upload-image';
import { cn } from '@/lib/utils';

import { Callout, type CalloutVariant } from './callout-extension';

import type { Editor } from '@tiptap/react';

/**
 * Trình soạn thảo nội dung bài viết.
 *
 * Thay cho ô textarea Markdown: biên tập viên non-tech không cần biết `##` hay
 * `**`. Vùng soạn dùng CHUNG class `.article-body` với trang public, nên cái
 * nhìn thấy lúc soạn đúng là cái hiện ngoài web — WYSIWYG có được nhờ dùng
 * chung stylesheet, không phải nhờ ước lượng.
 *
 * Lưu ra HTML. TipTap chỉ sinh được các node/mark khai trong schema dưới đây,
 * nên đầu ra bị giới hạn sẵn; server vẫn sanitize lại lần nữa trước khi lưu.
 */

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Đổi khi chuyển tab ngôn ngữ — buộc nạp lại nội dung của locale mới. */
  contentKey?: string;
}

export function RichTextEditor({ value, onChange, placeholder, contentKey }: RichTextEditorProps) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /*
   * `editorProps` được chốt lúc dựng editor, nên các handler bên trong nó giữ
   * mãi closure của lần render ĐẦU. Vì vậy editor phải lấy qua ref (lần đầu nó
   * còn là null) và cờ bận cũng phải là ref — đọc state `uploading` ở đó sẽ
   * vĩnh viễn thấy `false`.
   */
  const editorRef = useRef<Editor | null>(null);
  const busyRef = useRef(false);

  async function insertImageFile(file: File) {
    const ed = editorRef.current;
    if (!ed || busyRef.current) return;

    busyRef.current = true;
    setUploadError(null);
    setUploading(true);
    try {
      const img = await uploadImage(file, { ownerType: 'article' });
      ed.chain().focus().setImage({ src: img.url, alt: '' }).run();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Tải ảnh lên thất bại.');
    } finally {
      busyRef.current = false;
      setUploading(false);
    }
  }

  const editor = useEditor({
    // Next.js SSR: tắt render phía server để không lệch DOM khi hydrate.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, // H1 là tiêu đề bài, không cho dùng trong thân
        link: false, // dùng bản cấu hình riêng bên dưới
      }),
      Underline,
      Callout,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noreferrer noopener' } }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder ?? 'Bắt đầu viết nội dung bài…' }),
    ],
    content: value || '',
    editorProps: {
      attributes: { class: 'article-body ProseMirror' },

      /*
       * Dán ảnh (Ctrl+V) và kéo tệp thẳng vào bài.
       *
       * Không có hai đường này thì TipTap nhét ảnh vào dưới dạng `data:` base64
       * — bài phình lên vài MB, nằm luôn trong DB, và trang public tải ì ạch.
       * Chặn hành vi mặc định rồi tự tải lên R2, chèn lại bằng URL.
       */
      handlePaste: (_view, event) => {
        const file = [...(event.clipboardData?.items ?? [])]
          .find((i) => i.type.startsWith('image/'))
          ?.getAsFile();
        if (!file) return false;
        event.preventDefault();
        void insertImageFile(file);
        return true;
      },

      handleDrop: (_view, event) => {
        const file = (event as DragEvent).dataTransfer?.files?.[0];
        if (!file?.type.startsWith('image/')) return false;
        event.preventDefault();
        void insertImageFile(file);
        return true;
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // Nạp lại nội dung khi `value` đổi TỪ BÊN NGOÀI — đổi tab ngôn ngữ, hoặc AI
  // vừa dựng xong bài.
  //
  // `value` PHẢI nằm trong deps. Trước đây deps chỉ có [contentKey, editor],
  // nên khi AI sinh nội dung (locale không đổi) effect không chạy và editor
  // vẫn trống — nhìn như AI không trả về gì.
  //
  // So sánh với getHTML() để không nạp đè lên chính cái người dùng vừa gõ:
  // mỗi lần gõ, onUpdate đẩy HTML lên cha rồi quay lại đây qua `value`.
  useEffect(() => {
    if (!editor) return;
    const next = value || '';
    if (next === editor.getHTML()) return;
    // `emitUpdate: false` để không gọi onChange ngược lại và ghi đè state cha.
    editor.commands.setContent(next, { emitUpdate: false });
  }, [value, contentKey, editor]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('click', close);
    document.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('scroll', close, true);
    };
  }, [menu]);

  const openContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = wrapRef.current?.getBoundingClientRect();
    setMenu({ x: e.clientX - (rect?.left ?? 0), y: e.clientY - (rect?.top ?? 0) });
  }, []);

  if (!editor) {
    return <div className="border-line text-muted rounded-md border px-4 py-8 text-center text-[13px]">Đang tải trình soạn thảo…</div>;
  }

  return (
    <div ref={wrapRef} className="border-line relative rounded-md border bg-white">
      <Toolbar editor={editor} uploading={uploading} onPickImage={() => fileRef.current?.click()} />

      {/* Bôi đen chữ → thanh định dạng nổi ngay tại chỗ */}
      <BubbleMenu
        editor={editor}
        className="border-line flex items-center gap-0.5 rounded-md border bg-white p-1 shadow-[0_4px_16px_rgb(7_29_54/0.14)]"
      >
        <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Đậm">
          <b>B</b>
        </Btn>
        <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Nghiêng">
          <i>I</i>
        </Btn>
        <Btn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Gạch chân">
          <u>U</u>
        </Btn>
        <Sep />
        <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Tiêu đề lớn">
          H2
        </Btn>
        <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Tiêu đề nhỏ">
          H3
        </Btn>
        <Sep />
        <Btn active={editor.isActive('link')} onClick={() => promptLink(editor)} label="Chèn liên kết">
          🔗
        </Btn>
      </BubbleMenu>

      <div onContextMenu={openContextMenu} className="px-5 py-4">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          // Xoá giá trị để chọn LẠI đúng tệp vừa rồi vẫn phát `change`.
          e.target.value = '';
          if (file) void insertImageFile(file);
        }}
      />

      {uploading ? (
        <div className="border-line text-muted border-t px-5 py-2 text-[12px]">Đang tải ảnh lên Cloudflare R2…</div>
      ) : null}

      {uploadError ? (
        <p role="alert" className="border-t border-[#e5b8b8] bg-[#fdf4f4] px-5 py-2 text-[12px] text-[#a33]">
          {uploadError}
        </p>
      ) : null}

      {/* Chuột phải → các thao tác thiết kế nhanh */}
      {menu ? (
        <div
          role="menu"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
          className="border-line absolute z-50 w-[228px] rounded-md border bg-white py-1.5 shadow-[0_6px_22px_rgb(7_29_54/0.16)]"
        >
          <MenuHead>Chèn hộp</MenuHead>
          {(['note', 'tip', 'warning'] as CalloutVariant[]).map((v) => (
            <MenuItem
              key={v}
              onClick={() => {
                editor.chain().focus().setCallout(v).run();
                setMenu(null);
              }}
            >
              {v === 'note' ? '📌 Hộp ghi nhớ' : v === 'tip' ? '💡 Hộp mẹo' : '⚠️ Hộp lưu ý'}
            </MenuItem>
          ))}
          <MenuItem
            onClick={() => {
              editor.chain().focus().unsetCallout().run();
              setMenu(null);
            }}
          >
            Gỡ hộp
          </MenuItem>

          <MenuHead>Thiết kế</MenuHead>
          <MenuItem
            onClick={() => {
              editor.chain().focus().toggleBlockquote().run();
              setMenu(null);
            }}
          >
            ❝ Trích dẫn nổi bật
          </MenuItem>
          <MenuItem
            onClick={() => {
              editor.chain().focus().setHorizontalRule().run();
              setMenu(null);
            }}
          >
            ─ Đường phân cách
          </MenuItem>
          <MenuItem
            onClick={() => {
              fileRef.current?.click();
              setMenu(null);
            }}
          >
            🖼 Chèn ảnh
          </MenuItem>

          <MenuHead>Căn lề</MenuHead>
          <div className="flex gap-1 px-3 pt-0.5 pb-1">
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  editor.chain().focus().setTextAlign(a).run();
                  setMenu(null);
                }}
                className={cn(
                  'border-line flex-1 rounded border py-1 text-[11px] font-bold transition-colors',
                  editor.isActive({ textAlign: a }) ? 'border-gold bg-gold/12 text-[#8f6614]' : 'text-muted hover:border-gold',
                )}
              >
                {a === 'left' ? 'Trái' : a === 'center' ? 'Giữa' : 'Phải'}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Thanh công cụ cố định & Thao tác chèn Block ─────────────────────────────── */

function Toolbar({
  editor,
  uploading,
  onPickImage,
}: {
  editor: Editor;
  uploading: boolean;
  onPickImage: () => void;
}) {
  return (
    <div className="border-line bg-ivory/40 sticky top-14 z-10 flex flex-wrap items-center gap-1 rounded-t-md border-b px-2.5 py-2">
      <select
        value={editor.isActive('heading', { level: 2 }) ? 'h2' : editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'}
        onChange={(e) => {
          const v = e.target.value;
          if (v === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().toggleHeading({ level: v === 'h2' ? 2 : 3 }).run();
        }}
        className="border-line text-navy mr-1 h-7.5 rounded border bg-white px-2 text-[12px] font-semibold cursor-pointer"
      >
        <option value="p">Nội dung (Paragraph)</option>
        <option value="h2">Tiêu đề lớn (Heading 2)</option>
        <option value="h3">Tiêu đề nhỏ (Heading 3)</option>
      </select>

      <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} label="Đậm (Ctrl+B)">
        <b>B</b>
      </Btn>
      <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} label="Nghiêng (Ctrl+I)">
        <i>I</i>
      </Btn>
      <Btn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Gạch chân (Ctrl+U)">
        <u>U</u>
      </Btn>
      <Sep />
      <Btn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Danh sách chấm">
        •
      </Btn>
      <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Danh sách số">
        1.
      </Btn>
      <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Trích dẫn">
        ❝
      </Btn>
      <Sep />
      {/* Quick Insert Components */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setCallout('note').run()}
        className="bg-gold/10 hover:bg-gold/20 text-[#8f6614] border border-gold/30 rounded px-2 py-1 text-[11.5px] font-bold flex items-center gap-1 transition-colors"
        title="Chèn hộp ghi nhớ"
      >
        📌 Ghi nhớ
      </button>

      <button
        type="button"
        onClick={onPickImage}
        disabled={uploading}
        className="bg-navy/5 hover:bg-navy/10 text-navy border border-line rounded px-2 py-1 text-[11.5px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
        title="Tải ảnh từ máy lên (cũng có thể dán hoặc kéo thả ảnh vào bài)"
      >
        {uploading ? '⏳ Đang tải ảnh…' : '🖼 Chèn ảnh'}
      </button>

      <Sep />
      <Btn active={editor.isActive('link')} onClick={() => promptLink(editor)} label="Liên kết">
        🔗
      </Btn>
      <Sep />
      <Btn active={false} onClick={() => editor.chain().focus().undo().run()} label="Hoàn tác">
        ↶
      </Btn>
      <Btn active={false} onClick={() => editor.chain().focus().redo().run()} label="Làm lại">
        ↷
      </Btn>
    </div>
  );
}


function Btn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'grid h-7 min-w-7 place-items-center rounded px-1.5 text-[13px] transition-colors',
        active ? 'bg-gold/15 text-[#8f6614]' : 'text-navy hover:bg-navy/6',
      )}
    >
      {children}
    </button>
  );
}

const Sep = () => <span className="bg-line mx-1 h-4 w-px" />;

const MenuHead = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted px-3 pt-1.5 pb-1 text-[10px] font-bold tracking-wider uppercase">{children}</p>
);

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="text-navy hover:bg-ivory block w-full px-3 py-1.5 text-left text-[12.5px] transition-colors"
    >
      {children}
    </button>
  );
}

/* ── Hộp thoại nhập ────────────────────────────────────── */

function promptLink(editor: Editor) {
  const previous = editor.getAttributes('link').href as string | undefined;
  const url = window.prompt('Địa chỉ liên kết:', previous ?? 'https://');
  if (url === null) return;
  if (url.trim() === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  // Chỉ nhận http(s). `javascript:` trong href là lỗ XSS kinh điển.
  if (!/^https?:\/\//i.test(url.trim())) {
    window.alert('Chỉ chấp nhận đường dẫn bắt đầu bằng http:// hoặc https://');
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
}

