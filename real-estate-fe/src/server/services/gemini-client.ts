import 'server-only';

import { ApiError } from '@/lib/api/http';

import type { AiCall } from './ai-types';

/**
 * Lớp gọi Gemini dùng chung cho dịch thuật và dựng bài.
 *
 * Gọi thẳng REST thay vì cài SDK: chỉ một endpoint, một hình dạng body — thêm
 * dependency cho ngần đó không đáng, và bớt một thứ phải nâng cấp về sau.
 */

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * `gemini-3.5-flash` là mặc định.
 *
 * KHÔNG quay lại `gemini-2.5-flash`: hạn mức miễn phí của nó chỉ 20 lượt/ngày
 * (đã đo bằng chính khoá của dự án), mà mỗi bài tốn 1–2 lượt dựng + 3 lượt
 * dịch — tức chưa tới 4 bài là hết ngày.
 *
 * KHÔNG dùng bản `flash-lite` dù nhanh hơn: đã đo thấy nó phớt lờ quy tắc tên
 * riêng — dịch "My Khe" thành 美溪 / 미케 dù prompt cấm rõ ràng.
 *
 * Tránh các id kết thúc bằng `-latest`: Google tự đổi model bên dưới, chất
 * lượng đầu ra thay đổi mà không ai hay. Đặt `TRANSLATION_MODEL` trong
 * `.env.local` để đổi có chủ đích.
 */
export const GEMINI_MODEL = process.env.TRANSLATION_MODEL ?? 'gemini-3.5-flash';

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
  thinkingBudget,
}: AiCall): Promise<T> {
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
          ...(thinkingBudget === undefined ? {} : { thinkingConfig: { thinkingBudget } }),
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
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string; thought?: boolean }> };
      finishReason?: string;
    }>;
    promptFeedback?: { blockReason?: string };
  };

  if (json.promptFeedback?.blockReason) {
    throw new Error(`Nội dung bị bộ lọc chặn khi ${label}`);
  }

  const candidate = json.candidates?.[0];

  /*
   * Ghép MỌI phần text, bỏ phần `thought`.
   *
   * Không đọc `parts[0].text` như trước: từ Gemini 3 model trả kèm tóm tắt quá
   * trình suy nghĩ thành một part riêng có `thought: true`, và nó đứng TRƯỚC
   * phần JSON. Lấy part đầu là lấy trúng đoạn suy nghĩ, parse hỏng, người dùng
   * chỉ thấy "kết quả không đúng định dạng". Đầu ra dài cũng có thể bị cắt làm
   * nhiều part.
   */
  const text = (candidate?.content?.parts ?? [])
    .filter((part) => part.thought !== true && typeof part.text === 'string')
    .map((part) => part.text)
    .join('')
    .trim();

  if (!text) {
    throw new Error(
      candidate?.finishReason === 'MAX_TOKENS'
        ? `Nội dung quá dài để ${label} trong một lần`
        : `Không nhận được kết quả khi ${label}`,
    );
  }

  // Dù đã yêu cầu responseMimeType JSON, thỉnh thoảng vẫn có rào ```json.
  const body = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  try {
    return JSON.parse(body) as T;
  } catch {
    console.error('[gemini] khong parse duoc, do dai', body.length, '- doan cuoi:', body.slice(-300));
    throw new Error(
      candidate?.finishReason === 'MAX_TOKENS'
        ? `Nội dung quá dài để ${label} trong một lần`
        : `Kết quả khi ${label} không đúng định dạng`,
    );
  }
}
