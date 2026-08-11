import { ReactNode } from 'react';
import { Card, CardContent } from './ui/card';

export function PlaceholderPage({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="max-w-md w-full border-line/60 overflow-hidden">
        <div className="h-32 bg-navy/5 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C99224]/10 rounded-bl-full -mr-24 -mt-24"></div>
          <div className="relative z-10 text-navy/40 bg-white p-4 rounded-full shadow-sm">
            {icon}
          </div>
        </div>
        <CardContent className="p-8 text-center flex flex-col items-center">
          <h1 className="text-xl font-bold text-navy mb-2">{title}</h1>
          <p className="text-[14px] text-muted mb-8 leading-relaxed">
            {description}
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-50 text-navy border border-line px-4 py-2 rounded text-[12px] font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C99224] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C99224]"></span>
            </span>
            Đang Phát Triển
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
