import { describe, expect, it } from 'vitest';

import { cn } from './utils';

describe('cn', () => {
  it('gộp class và bỏ giá trị falsy', () => {
    expect(cn('a', false, 'c')).toBe('a c');
  });

  it('tailwind-merge ghi đè class trùng', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });
});
