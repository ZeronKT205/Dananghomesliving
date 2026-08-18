/**
 * Thu nhỏ ảnh ngay trên trình duyệt rồi gửi lên `/api/admin/media`.
 *
 * Thu nhỏ TRƯỚC khi gửi chứ không xử lý ở server, vì ba lý do:
 *  1. Ảnh điện thoại 4000px nặng 6–8MB, vượt trần 4,5MB của Vercel cho một
 *     request. Thu về 2000px thì còn vài trăm KB.
 *  2. Không phải cài thư viện xử lý ảnh (sharp) — thứ hay vỡ khi deploy.
 *  3. Biên tập viên thấy ảnh lên nhanh hơn hẳn, nhất là mạng ở Việt Nam upload
 *     thường chậm hơn download nhiều lần.
 *
 * Ảnh GIF được giữ nguyên: vẽ lại qua canvas sẽ mất hoạt ảnh, chỉ còn khung đầu.
 */

/** Cạnh dài nhất sau khi thu nhỏ. Đủ nét cho ảnh bìa tràn ngang trên màn 2x. */
const MAX_EDGE = 2000;
const QUALITY = 0.85;

export interface UploadedImage {
  id: string;
  url: string;
  key: string;
  width: number | null;
  height: number | null;
}

interface ApiShape {
  ok: boolean;
  data?: UploadedImage;
  error?: { message?: string };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được tệp ảnh này.'));
    };
    img.src = url;
  });
}

interface Prepared {
  blob: Blob;
  name: string;
  width: number;
  height: number;
}

async function prepare(file: File): Promise<Prepared> {
  if (file.type === 'image/gif') {
    const img = await loadImage(file).catch(() => null);
    return { blob: file, name: file.name, width: img?.naturalWidth ?? 0, height: img?.naturalHeight ?? 0 };
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));

  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return { blob: file, name: file.name, width: img.naturalWidth, height: img.naturalHeight };

  ctx.drawImage(img, 0, 0, width, height);

  // WebP nhẹ hơn JPEG cùng chất lượng khoảng 25–30%, và mọi trình duyệt còn
  // được hỗ trợ hiện nay đều đọc được.
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', QUALITY));
  if (!blob) return { blob: file, name: file.name, width: img.naturalWidth, height: img.naturalHeight };

  // Ảnh đã tối ưu sẵn (ví dụ WebP nhỏ tải từ nơi khác) thì bản vẽ lại có thể
  // còn nặng hơn — lúc đó giữ tệp gốc.
  if (blob.size >= file.size && scale === 1) {
    return { blob: file, name: file.name, width: img.naturalWidth, height: img.naturalHeight };
  }

  return { blob, name: file.name.replace(/\.[^.]+$/, '') + '.webp', width, height };
}

/**
 * Tải một ảnh lên R2 và trả về bản ghi media.
 *
 * `onProgress` nhận số 0–1. Dùng XMLHttpRequest thay vì fetch chỉ vì fetch
 * không báo tiến độ upload — ảnh mấy trăm KB trên mạng chậm mà thanh chờ đứng
 * im thì người dùng tưởng treo.
 */
export function uploadImage(
  file: File,
  opts: { ownerType?: string; alt?: string; onProgress?: (ratio: number) => void } = {},
): Promise<UploadedImage> {
  return prepare(file).then(
    (p) =>
      new Promise<UploadedImage>((resolve, reject) => {
        const form = new FormData();
        form.append('file', new File([p.blob], p.name, { type: p.blob.type }));
        form.append('ownerType', opts.ownerType ?? 'article');
        if (p.width) form.append('width', String(p.width));
        if (p.height) form.append('height', String(p.height));
        if (opts.alt) form.append('alt', opts.alt);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/admin/media');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) opts.onProgress?.(e.loaded / e.total);
        };

        xhr.onload = () => {
          let body: ApiShape | null = null;
          try {
            body = JSON.parse(xhr.responseText) as ApiShape;
          } catch {
            /* phản hồi không phải JSON — rơi xuống thông báo chung bên dưới */
          }

          if (xhr.status >= 200 && xhr.status < 300 && body?.ok && body.data) {
            opts.onProgress?.(1);
            resolve(body.data);
            return;
          }

          reject(
            new Error(
              body?.error?.message ??
                (xhr.status === 401 || xhr.status === 403
                  ? 'Phiên đăng nhập đã hết hạn — tải lại trang rồi thử lại.'
                  : 'Tải ảnh lên thất bại. Thử lại sau ít phút.'),
            ),
          );
        };

        xhr.onerror = () => reject(new Error('Mất kết nối khi đang tải ảnh.'));
        xhr.send(form);
      }),
  );
}
