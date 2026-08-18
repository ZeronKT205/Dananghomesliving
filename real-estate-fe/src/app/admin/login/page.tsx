import Image from 'next/image';
import Link from 'next/link';
import { BrandLogo } from '@/components/ui/brand-logo';
import { LoginForm } from './_components/login-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng nhập Cổng Quản trị | Da Nang Homes & Living',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-navy overflow-hidden">
      {/* Background Image with Dark Navy Glass Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1920&auto=format&fit=crop"
          alt="Luxury Residence Background"
          fill
          priority
          className="object-cover opacity-25 scale-105 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071D36]/95 via-[#071D36]/85 to-[#0b284c]/95" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="container-page relative z-10 py-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white shadow-2xl border border-gold/30 rounded-none overflow-hidden">
          
          {/* Left Panel: Luxury Brand Presentation (Hidden on mobile) */}
          <div className="lg:col-span-5 bg-navy p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-gold/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <BrandLogo light={true} />
              </Link>

              <div className="mt-12">
                <span className="text-gold text-[10px] font-bold tracking-[0.24em] uppercase block mb-2">
                  Portal Quản Trị Hệ Thống
                </span>
                <h1 className="font-display text-[28px] lg:text-[34px] font-normal leading-tight text-white">
                  Quản lý Bất động sản Cao cấp Đà Nẵng
                </h1>
                <p className="mt-4 text-[13.5px] leading-relaxed text-white/75 font-sans">
                  Hệ thống quản lý dữ liệu biệt thự, penthouse và căn hộ hạng sang chuẩn doanh nghiệp dành riêng cho đội ngũ chuyên viên cố vấn.
                </p>
              </div>
            </div>

            {/* Feature Bullet Highlights */}
            <div className="relative z-10 mt-10 pt-8 border-t border-white/10 space-y-3.5 text-[12.5px] text-white/80">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-gold/20 text-gold rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Quản lý BĐS cho Thuê &amp; Chào Bán tức thì</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-gold/20 text-gold rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Bảo mật dữ liệu tài khoản chuẩn mã hóa 256-bit</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 bg-gold/20 text-gold rounded-full flex items-center justify-center text-[10px] shrink-0">✓</span>
                <span>Báo cáo phân tích khách hàng &amp; tư vấn trực tuyến</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Sharp Form Card */}
          <div className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-center">
            <LoginForm next={next} />
          </div>

        </div>
      </div>
    </main>
  );
}
