import 'server-only';

import { ApiError } from '@/lib/api/http';

import type { AiCall } from './ai-types';

/**
 * Lớp gọi Claude (Anthropic Messages API).
 *
 * Gọi thẳng REST như phía Gemini, không cài SDK: một endpoint, một hình dạng
 * body, không đáng thêm phụ thuộc.
 *
 * Khác biệt quan trọng so với Gemini: Anthropic KHÔNG có `responseSchema`. Cách
 * lấy dữ liệu có cấu trúc là khai một "công cụ" rồi ép model gọi đúng công cụ
 * đó — tham số model truyền vào chính là kết quả, đã là object thật.
 *
 * Cách này chắc hơn hẳn đường của Gemini: không phải parse chuỗi JSON, nên
 * không dính lỗi JSON đứt giữa chừng hay lẫn với phần tóm tắt suy nghĩ.
 */

const ENDPOINT = 'https://api.anthropic.com/v1/messages';

/** Bắt buộc theo tài liệu Anthropic; không có header này thì API từ chối. */
const API_VERSION = '2023-06-01';

/**
 * Haiku 4.5 là mặc định.
 *
 * Đủ sức cho việc ở đây (viết lại ghi chú thành bài, dịch giữ nguyên cấu trúc)
 * mà rẻ và nhanh hơn nhiều so với Sonnet/Opus. Đổi bằng `ANTHROPIC_MODEL`
 * trong `.env.local` nếu cần bài sâu hơn.
 */
export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';

/** Tên công cụ bắt model gọi. Chỉ là nhãn nội bộ, không lộ ra người dùng. */
const TOOL_NAME = 'tra_ve_ket_qua';

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function apiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new ApiError(
      'VALIDATION',
      'Chưa cấu hình ANTHROPIC_API_KEY — thêm khoá vào .env.local rồi khởi động lại.',
    );
  }
  return key;
}

/* ── Chuyển schema ─────────────────────────────────────── */

type JsonSchema = Record<string, unknown>;

/**
 * Schema kiểu Gemini → JSON Schema chuẩn.
 *
 * Schema trong dự án viết theo quy ước Gemini: `type` VIẾT HOA (`'OBJECT'`) và
 * có `propertyOrdering`. Anthropic đòi JSON Schema thật: `type` viết thường và
 * không biết `propertyOrdering` là gì.
 *
 * Chuyển ở đây thay vì viết hai bản schema: một nguồn sự thật duy nhất thì
 * không có chuyện sửa một bên quên bên kia.
 */
export function toJsonSchema(input: unknown): JsonSchema {
  if (!input || typeof input !== 'object') return {};
  const src = input as Record<string, unknown>;
  const out: JsonSchema = {};

  for (const [k, v] of Object.entries(src)) {
    // Gemini dùng để cố định thứ tự trường khi sinh; JSON Schema không có.
    if (k === 'propertyOrdering') continue;

    if (k === 'type' && typeof v === 'string') {
      out.type = v.toLowerCase();
      continue;
    }

    if (k === 'properties' && v && typeof v === 'object') {
      out.properties = Object.fromEntries(
        Object.entries(v as Record<string, unknown>).map(([name, sub]) => [name, toJsonSchema(sub)]),
      );
      continue;
    }

    if (k === 'items') {
      out.items = toJsonSchema(v);
      continue;
    }

    // `enum`, `required`, `minItems`, `maxItems`, `description`… giữ nguyên.
    out[k] = v;
  }

  return out;
}

/* ── Gọi API ───────────────────────────────────────────── */

/**
 * Thử lại cho lỗi TẠM THỜI. 429 là chạm giới hạn tần suất, 529 là Anthropic
 * quá tải, 5xx là sự cố phía họ — cả ba đều đáng thử lại. Lỗi 4xx khác (khoá
 * sai, body sai) thì thử lại vô ích.
 */
async function fetchWithRetry(init: RequestInit, attempts = 3): Promise<Response> {
  let last: Response | null = null;

  for (let i = 0; i < attempts; i++) {
    const res = await fetch(ENDPOINT, init);
    if (res.ok || (res.status !== 429 && res.status !== 529 && res.status < 500)) return res;
    last = res;
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 800 * 2 ** i));
  }

  return last!;
}

interface AnthropicResponse {
  content?: Array<{ type: string; name?: string; input?: unknown; text?: string }>;
  stop_reason?: string;
  error?: { message?: string };
}

export async function callAnthropic<T>({
  system,
  user,
  schema,
  label,
  timeoutMs = 120_000,
  maxOutputTokens = 16_000,
}: AiCall): Promise<T> {
  const key = apiKey();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetchWithRetry({
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-api-key': key,
        'anthropic-version': API_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: maxOutputTokens,
        system,
        messages: [{ role: 'user', content: user }],
        tools: [
          {
            name: TOOL_NAME,
            description: 'Trả kết quả đúng theo cấu trúc đã khai.',
            input_schema: toJsonSchema(schema),
          },
        ],
        // Ép gọi đúng công cụ này: model không được trả lời bằng văn xuôi.
        tool_choice: { type: 'tool', name: TOOL_NAME },
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
    // Không đưa nguyên body ra người dùng — có thể chứa chi tiết nội bộ.
    const hint =
      res.status === 429
        ? 'đã chạm giới hạn số lần gọi, thử lại sau ít phút'
        : res.status === 401 || res.status === 403
          ? 'khoá API không hợp lệ hoặc chưa bật quyền'
          : res.status === 400
            ? 'yêu cầu bị từ chối'
            : res.status === 529
              ? 'hệ thống đang quá tải, thử lại sau ít phút'
              : `mã lỗi ${res.status}`;
    console.error('[anthropic] lỗi:', res.status, body.slice(0, 400));
    throw new Error(`${label} thất bại — ${hint}`);
  }

  const json = (await res.json()) as AnthropicResponse;

  const toolUse = json.content?.find((c) => c.type === 'tool_use' && c.name === TOOL_NAME);
  if (!toolUse?.input) {
    // `max_tokens` là lý do hay gặp nhất: model đang điền tham số thì bị cắt.
    throw new Error(
      json.stop_reason === 'max_tokens'
        ? `Nội dung quá dài để ${label} trong một lần`
        : `Không nhận được kết quả khi ${label}`,
    );
  }

  // `input` đã là object do API dựng theo schema — không phải parse chuỗi.
  return toolUse.input as T;
}
