import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("bg-white border border-line rounded-lg shadow-sm overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("px-6 py-5 border-b border-line flex items-center justify-between", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <h2 className={cn("text-[15px] font-bold text-navy uppercase tracking-wider", className)}>
      {children}
    </h2>
  );
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}
