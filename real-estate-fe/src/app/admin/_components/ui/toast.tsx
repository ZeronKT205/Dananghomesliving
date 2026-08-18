'use client';

import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'info' | 'warning';
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastProps>) => {
      const newToast = { ...event.detail, id: Date.now() };
      // Replace existing toast instead of stacking them
      setToasts([newToast]);

      // Remove after 3s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3000);
    };

    window.addEventListener('toast', handleToast as EventListener);
    return () => window.removeEventListener('toast', handleToast as EventListener);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="admin-toast-in bg-navy text-white px-5 py-3 rounded shadow-lg flex items-center gap-3 pointer-events-auto">
          {t.type === 'success' && (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          )}
          {t.type === 'info' && (
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {t.type === 'warning' && (
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          )}
          <span className="text-[13px] font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export const toast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
  }
};
