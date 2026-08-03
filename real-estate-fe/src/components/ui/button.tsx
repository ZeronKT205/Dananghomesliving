import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

// Primitive "dumb": chỉ nhận props, không fetch data, không chứa business logic.
export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-gray-900 text-white hover:bg-gray-700',
        variant === 'secondary' && 'border border-gray-300 text-gray-900 hover:bg-gray-100',
        className,
      )}
      {...props}
    />
  );
}
