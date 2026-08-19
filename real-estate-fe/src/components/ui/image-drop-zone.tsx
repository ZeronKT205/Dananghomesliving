'use client';

import { useCallback, useId, useRef, useState } from 'react';

import { uploadImage, type UploadedImage } from '@/lib/upload-image';

/**
 * Vùng chọn ảnh: bấm để mở hộp thoại, kéo thả tệp vào, hoặc dán ảnh từ bộ nhớ
 * tạm (Ctrl+V) — ảnh chụp màn hình thường chỉ nằm ở bộ nhớ tạm chứ không có tệp.
 *
 * Chỉ lo phần chọn và tải lên; hiển thị ảnh đã có là việc của nơi gọi, vì ảnh
 * bìa và ảnh trong bài trình bày khác hẳn nhau.
 */
export function ImageDropZone({
  onUploaded,
  ownerType = 'article',
  label = 'Kéo ảnh vào đây, hoặc bấm để chọn tệp',
  hint = 'JPG, PNG, WebP hoặc GIF. Ảnh lớn được tự thu nhỏ trước khi tải lên.',
  compact = false,
  multiple = false,
}: {
  onUploaded: (image: UploadedImage) => void;
  ownerType?: string;
  label?: string;
  hint?: string;
  compact?: boolean;
  /** Cho chọn nhiều tệp một lần. Ảnh bìa bài viết thì không, album BĐS thì có. */
  multiple?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Tải LẦN LƯỢT từng tệp, không song song.
   *
   * Chọn 20 ảnh rồi bắn 20 request cùng lúc thì mạng nghẽn, thanh tiến trình
   * nhảy loạn và R2 dễ trả 429. Tuần tự thì chậm hơn chút nhưng biết đang ở
   * tệp thứ mấy, và một tệp hỏng không kéo đổ cả mẻ.
   */
  const send = useCallback(
    async (files: FileList | File[] | null | undefined) => {
      const list = [...(files ?? [])].filter((f) => f.type.startsWith('image/'));
      if (list.length === 0 || busy) return;

      setError(null);
      setBusy(true);
      setTotal(list.length);

      const failures: string[] = [];

      for (let i = 0; i < list.length; i++) {
        setIndex(i + 1);
        setProgress(0);
        try {
          onUploaded(await uploadImage(list[i]!, { ownerType, onProgress: setProgress }));
        } catch (err) {
          failures.push(list[i]!.name);
          // Ghi lại rồi đi tiếp: dừng hẳn ở tệp thứ 3 của 20 là mất công người
          // dùng chọn lại từ đầu.
          console.error('[upload] hỏng', list[i]!.name, err);
        }
      }

      if (failures.length > 0) {
        setError(
          failures.length === list.length
            ? 'Tải ảnh lên thất bại. Thử lại sau ít phút.'
            : `Đã tải ${list.length - failures.length}/${list.length} ảnh. Hỏng: ${failures.join(', ')}`,
        );
      }

      setBusy(false);
      setProgress(0);
      setTotal(0);
      setIndex(0);
      // Cho phép chọn LẠI đúng tệp vừa rồi: input file không phát `change`
      // khi giá trị không đổi.
      if (inputRef.current) inputRef.current.value = '';
    },
    [busy, onUploaded, ownerType],
  );

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void send(e.dataTransfer.files);
        }}
        onPaste={(e) => {
          const files = [...e.clipboardData.items]
            .filter((i) => i.type.startsWith('image/'))
            .map((i) => i.getAsFile())
            .filter((f): f is File => f !== null);
          if (files.length) void send(files);
        }}
        tabIndex={0}
        className={[
          'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-center transition-colors',
          compact ? 'px-3 py-4' : 'px-6 py-8',
          dragging ? 'border-gold bg-gold/15' : 'border-gold/50 bg-gold/5 hover:bg-gold/10',
          busy ? 'pointer-events-none opacity-70' : '',
        ].join(' ')}
      >
        {busy ? (
          <>
            <p className="text-navy text-[13px] font-bold">
              {total > 1 ? `Đang tải ảnh ${index}/${total}… ` : 'Đang tải ảnh lên… '}
              {Math.round(progress * 100)}%
            </p>
            <div className="bg-navy/10 mt-1 h-1.5 w-40 overflow-hidden rounded-full">
              <div
                className="bg-gold h-full transition-[width] duration-200"
                style={{ width: `${Math.max(4, progress * 100)}%` }}
              />
            </div>
          </>
        ) : (
          <>
            {!compact ? <div className="text-[26px] leading-none">📷</div> : null}
            <p className="text-navy text-[13px] font-bold">{label}</p>
            <p className="text-muted max-w-md text-[11.5px]">{hint}</p>
          </>
        )}
      </label>

      <input
        id={inputId}
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => void send(e.target.files)}
      />

      {error ? (
        <p role="alert" className="mt-2 rounded border border-[#e5b8b8] bg-[#fdf4f4] px-3 py-2 text-[12px] text-[#a33]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
