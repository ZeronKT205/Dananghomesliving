'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Floating Toast Portal Container */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-6 right-6 z-9999 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-toast-in flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-[13px] font-medium shadow-lift border backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-navy text-white border-gold/40 shadow-gold/10'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-amber-50 border-amber-500/40'
                : 'bg-navy text-white border-white/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' ? (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-navy text-[11px] font-bold">
                  ✓
                </span>
              ) : (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold/20 text-gold text-[11px] font-bold">
                  ℹ
                </span>
              )}
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white text-base leading-none p-1"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: (msg: string) => console.log('Toast:', msg) };
  }
  return context;
}
