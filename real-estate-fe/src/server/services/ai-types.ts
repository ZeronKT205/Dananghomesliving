import 'server-only';

/**
 * Hình dạng một lời gọi model, dùng chung cho mọi nhà cung cấp.
 *
 * Tách riêng khỏi `ai-client.ts` để `gemini-client.ts` và `anthropic-client.ts`
 * cùng dùng mà không import vòng vào lớp điều phối.
 */
export interface AiCall {
  system: string;
  user: string;
  /**
   * Schema mô tả kết quả, viết theo quy ước Gemini (`type` VIẾT HOA).
   *
   * Đây là NGUỒN SỰ THẬT DUY NHẤT; bản Anthropic tự chuyển sang JSON Schema
   * chuẩn khi gọi. Viết hai bản schema thì sớm muộn sửa một bên quên bên kia.
   */
  schema: unknown;
  /** Mô tả việc đang làm, ghép vào thông báo lỗi cho người dùng. */
  label: string;
  timeoutMs?: number;
  maxOutputTokens?: number;
  /**
   * Ngân sách token suy nghĩ — CHỈ Gemini dùng. Gemini 2.5+ bật thinking mặc
   * định và với đầu ra dài nó có thể nghĩ rất lâu (đã gặp timeout 150s vì việc
   * này). Bản Anthropic bỏ qua tham số này.
   */
  thinkingBudget?: number;
}
