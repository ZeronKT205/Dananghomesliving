import 'server-only';

import { revalidatePath } from 'next/cache';

/**
 * Làm mới các trang PUBLIC sau khi sửa dữ liệu trong CMS.
 *
 * Cần thiết vì trang chủ, danh sách bất động sản và danh sách tin tức đều được
 * dựng sẵn lúc build (`●` trong bảng route của Next). Không gọi hàm này thì
 * đăng tin xong ngoài web vẫn là dữ liệu của lần build gần nhất — bug kiểu
 * "tôi đăng rồi mà không thấy đâu", và không có thông báo lỗi nào để lần ra.
 *
 * Dùng dạng route pattern `/[locale]/...` chứ không phải `/vi/...`: một lời gọi
 * phủ cả bốn ngôn ngữ, liệt kê tay thì thêm ngôn ngữ mới là quên ngay.
 *
 * `revalidate = 60` trên từng trang là lớp thứ hai — phòng khi có đường sửa dữ
 * liệu nào không đi qua đây (script, sửa tay trong Atlas).
 */

export function revalidatePublicProperties(): void {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/properties', 'page');
  revalidatePath('/[locale]/properties/[id]', 'page');
}

export function revalidatePublicArticles(): void {
  revalidatePath('/[locale]', 'page');
  revalidatePath('/[locale]/news', 'page');
  revalidatePath('/[locale]/tips', 'page');
  revalidatePath('/[locale]/news/[slug]', 'page');
  revalidatePath('/[locale]/tips/[slug]', 'page');
}
