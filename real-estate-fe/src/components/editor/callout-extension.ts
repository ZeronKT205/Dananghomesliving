import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutVariant = 'note' | 'tip' | 'warning';

export const CALLOUT_LABEL: Record<CalloutVariant, string> = {
  note: 'Ghi nhớ',
  tip: 'Mẹo',
  warning: 'Lưu ý',
};

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
 * Render ra `<div class="callout" data-variant="..." data-label="...">`, và
 * `data-label` được CSS đọc qua `content: attr(data-label)`. Nhãn nằm ở
 * thuộc tính chứ không phải một node con: biên tập viên không xoá nhầm được
 * tiêu đề hộp, và đổi nhãn sau này không phải migrate nội dung đã lưu.
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
        renderHTML: (attrs) => {
          const variant = (attrs.variant as CalloutVariant) ?? 'note';
          return {
            'data-variant': variant,
            'data-label': CALLOUT_LABEL[variant] ?? CALLOUT_LABEL.note,
          };
        },
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
