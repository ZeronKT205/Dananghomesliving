import 'server-only';

import { ApiError } from '@/lib/api/http';

import { ANTHROPIC_MODEL, callAnthropic, isAnthropicConfigured } from './anthropic-client';
import { GEMINI_MODEL, callGemini, isGeminiConfigured } from './gemini-client';

import type { AiCall } from './ai-types';

/**
 * Điều phối lời gọi model tới nhà cung cấp đang bật.
 *
 * Có hai đường vì mỗi bên mạnh một kiểu:
 *  - Anthropic (Claude Haiku): trả dữ liệu có cấu trúc qua cơ chế gọi công cụ
 *    nên kết quả đã là object, không phải parse chuỗi JSON. Là mặc định khi có
 *    khoá.
 *  - Gemini: gói miễn phí chỉ 20 lượt/ngày mỗi model (đã đo bằng khoá của dự
 *    án), đủ để thử chứ không đủ để dùng thật. Giữ lại làm đường dự phòng.
 *
 * Nơi gọi (`article-ai-service`, `translation-service`) không biết và không cần
 * biết đang chạy nhà nào.
 */

export type AiProvider = 'anthropic' | 'gemini';

/**
 * Nhà cung cấp đang dùng.
 *
 * `AI_PROVIDER` trong `.env.local` ép chọn một bên; không đặt thì ưu tiên
 * Anthropic nếu có khoá, còn lại rơi về Gemini.
 */
export function aiProvider(): AiProvider {
  const forced = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (forced === 'anthropic' || forced === 'gemini') return forced;
  return isAnthropicConfigured() ? 'anthropic' : 'gemini';
}

/** Có khoá để chạy tính năng AI hay không — quyết định hiện nút Dịch/Dựng bài. */
export function isAiConfigured(): boolean {
  return isAnthropicConfigured() || isGeminiConfigured();
}

/** Tên model đang chạy, để hiện cho biên tập biết bài do model nào viết. */
export function aiModelName(): string {
  return aiProvider() === 'anthropic' ? ANTHROPIC_MODEL : GEMINI_MODEL;
}

export async function callAi<T>(call: AiCall): Promise<T> {
  const provider = aiProvider();

  if (provider === 'anthropic') {
    if (!isAnthropicConfigured()) {
      throw new ApiError(
        'VALIDATION',
        'AI_PROVIDER đang đặt là anthropic nhưng thiếu ANTHROPIC_API_KEY trong .env.local.',
      );
    }
    return callAnthropic<T>(call);
  }

  if (!isGeminiConfigured()) {
    throw new ApiError(
      'VALIDATION',
      'Chưa cấu hình khoá AI — thêm ANTHROPIC_API_KEY (hoặc GEMINI_API_KEY) vào .env.local rồi khởi động lại.',
    );
  }
  return callGemini<T>(call);
}
