import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutVariant = 'note' | 'tip' | 'warning';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (variant: CalloutVariant) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

/**
 * Hộp ghi nhớ — khối nội dung nổi bật giữa bài, kiểu các trang tin thường dùng.
 *
 * Render ra `<div class="callout" data-variant="...">`. Nhãn ("Ghi nhớ", "Mẹo",
 * "Lưu ý") do CSS sinh từ `data-variant` và ĐỔI THEO NGÔN NGỮ TRANG — không
 * ghi vào HTML, vì nhãn ghi lúc soạn sẽ theo bản dịch sang mọi ngôn ngữ và bản
 * tiếng Hàn lại hiện chữ Việt. Nhãn cũng không phải node con: biên tập viên
 * không xoá nhầm được tiêu đề hộp.
 *
 * `content: 'block+'` cho phép nhiều đoạn, danh sách… bên trong hộp.
 */
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      variant: {
        default: 'note' as CalloutVariant,
        parseHTML: (el) => el.getAttribute('data-variant') ?? 'note',
        renderHTML: (attrs) => ({ 'data-variant': (attrs.variant as CalloutVariant) ?? 'note' }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-variant]', getAttrs: (el) => (el as HTMLElement).classList.contains('callout') && null }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'callout' }), 0];
  },

  addCommands() {
    return {
      setCallout:
        (variant) =>
        ({ commands }) =>
          commands.wrapIn(this.name, { variant }),
      unsetCallout:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});
