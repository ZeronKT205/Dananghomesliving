import 'server-only';

import { ApiError } from '@/lib/api/http';

/**
 * Lớp gọi Gemini dùng chung cho dịch thuật và dựng bài.
 *
 * Gọi thẳng REST thay vì cài SDK: chỉ một endpoint, một hình dạng body — thêm
 * dependency cho ngần đó không đáng, và bớt một thứ phải nâng cấp về sau.
 */

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * `gemini-2.5-flash` là mặc định.
 *
 * KHÔNG dùng `flash-lite` dù nhanh gấp ba: đã đo thấy nó phớt lờ quy tắc tên
 * riêng — dịch "My Khe" thành 美溪 / 미케 dù prompt cấm rõ ràng — và trả 503
 * khi hệ thống đông.
 */
export const GEMINI_MODEL = process.env.TRANSLATION_MODEL ?? 'gemini-2.5-flash';

export function geminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new ApiError(
      'VALIDATION',
      'Chưa cấu hình GEMINI_API_KEY — thêm khoá vào .env.local rồi khởi động lại.',
    );
  }
  return key;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Thử lại cho lỗi TẠM THỜI (429 quá nhiều request, 503 quá tải) — đã gặp 503
 * thật khi đo. Lỗi 4xx khác trả về ngay, thử lại vô ích. Backoff tăng dần để
 * không dội thêm vào lúc dịch vụ đang quá tải.
 */
async function fetchWithRetry(url: string, init: RequestInit, attempts = 3): Promise<Response> {
  let last: Response | null = null;
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, init);
    if (res.ok || (res.status !== 429 && res.status !== 503)) return res;
    last = res;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 800 * 2 ** i));
  }
  return last!;
}

export interface GeminiCall {
  system: string;
  user: string;
  /** JSON Schema (kiểu OBJECT/STRING/ARRAY viết hoa theo quy ước Gemini). */
  schema: unknown;
  /** Mô tả việc đang làm, ghép vào thông báo lỗi cho người dùng. */
  label: string;
  timeoutMs?: number;
  maxOutputTokens?: number;
}

/**
 * Gọi Gemini với structured output và trả về object đã parse.
 * Ràng buộc schema để khỏi phải bóc JSON ra khỏi văn xuôi rồi cầu cho parse được.
 */
export async function callGemini<T>({
  system,
  user,
  schema,
  label,
  timeoutMs = 120_000,
  maxOutputTokens = 32_000,
}: GeminiCall): Promise<T> {
  const key = geminiApiKey();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetchWithRetry(`${ENDPOINT}/${GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          maxOutputTokens,
        },
      }),
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw new Error(`Quá thời gian chờ khi ${label}`);
    throw new Error(`Không gọi được API: ${(err as Error).message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    // Không đưa nguyên body ra người dùng — có thể chứa khoá hoặc chi tiết nội bộ.
    const hint =
      res.status === 429
        ? 'đã chạm giới hạn số lần gọi, thử lại sau ít phút'
        : res.status === 400 || res.status === 403
          ? 'khoá API không hợp lệ hoặc chưa bật quyền'
          : `mã lỗi ${res.status}`;
    console.error('[gemini] lỗi:', res.status, body.slice(0, 400));
    throw new Error(`${label} thất bại — ${hint}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
    promptFeedback?: { blockReason?: string };
  };

  if (json.promptFeedback?.blockReason) {
    throw new Error(`Nội dung bị bộ lọc chặn khi ${label}`);
  }

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const reason = json.candidates?.[0]?.finishReason;
    throw new Error(
      reason === 'MAX_TOKENS' ? `Nội dung quá dài để ${label} trong một lần` : `Không nhận được kết quả khi ${label}`,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Kết quả khi ${label} không đúng định dạng`);
  }
}
