import { setRequestLocale } from 'next-intl/server';

import { APP_NAME } from '@/config/constants';
import { Link } from '@/i18n/routing';
import { getAllListings } from '@/lib/db/listings';

import { PropertySearch } from '../../_components/property-search';
import { SiteFooter } from '../../_components/site-footer';
import { SiteHeader } from '../../_components/site-header';
import { PropertiesClientView } from './_components/properties-client-view';
import { VoucherCtaBanner } from './_components/voucher-cta-banner';

import type { Metadata } from 'next';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; area?: string; propertyType?: string }>;
}): Promise<Metadata> {
  const { type, propertyType } = await searchParams;
  const typeLabel = type === 'rent' ? 'cho Thuê' : type === 'sale' ? 'Bán' : 'Bất động sản';
  const subLabel = propertyType ? ` (${propertyType})` : '';

  return {
    title: `Danh sách Bất Động Sản ${typeLabel}${subLabel} | ${APP_NAME}`,
    description: `Khám phá bộ sưu tập bất động sản hạng sang ${typeLabel.toLowerCase()} tại Đà Nẵng. Biệt thự ven biển, penthouse và căn hộ cao cấp.`,
  };
}

export default async function PropertiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; area?: string; propertyType?: string; budget?: string }>;
}) {
  const { locale } = await params;
  const { type, area, propertyType } = await searchParams;

  setRequestLocale(locale);

  let listings = await getAllListings();

  if (type === 'rent' || type === 'sale') {
    listings = listings.filter((item) => item.listingType === type);
  }

  if (area && area !== 'All Da Nang') {
    const areaLower = area.toLowerCase();
    listings = listings.filter(
      (item) =>
        (item.areaName && item.areaName.toLowerCase().includes(areaLower)) ||
        item.location.toLowerCase().includes(areaLower),
    );
  }

  if (propertyType && propertyType !== 'Any property') {
    const pTypeLower = propertyType.toLowerCase();
    listings = listings.filter(
      (item) => item.propertyType && item.propertyType.toLowerCase() === pTypeLower,
    );
  }

  const pageTitle =
    type === 'rent'
      ? 'Bất động sản Cho Thuê'
      : type === 'sale'
        ? 'Bất động sản Bán'
        : 'Tất cả Bất động sản Cao cấp';

  const subtitle =
    type === 'rent'
      ? 'Khám phá bộ sưu tập căn hộ & biệt thự cho thuê dài hạn cao cấp tại Đà Nẵng.'
      : type === 'sale'
        ? 'Tuyển tập các biệt thự biển, penthouse và căn hộ hạng sang chào bán.'
        : 'Khám phá toàn bộ danh mục sản phẩm biệt thự, penthouse và căn hộ cao cấp tại Đà Nẵng.';

  return (
    <>
      <SiteHeader />

      <main className="bg-paper animate-fade-in min-h-[70vh] pb-16">
        {/* Banner Section */}
        <section className="bg-navy relative overflow-hidden py-12 text-white md:py-16">
          <div className="bg-gold/10 absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent opacity-60" />
          <div className="container-page relative z-10 text-left flex flex-col items-start">
            {/* Breadcrumbs */}
            <nav className="mb-3 flex items-center justify-start gap-2 text-[12px] text-white/60">
              <Link href="/" className="transition-colors hover:text-gold">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-gold font-semibold">Bất động sản</span>
              {type ? (
                <>
                  <span>/</span>
                  <span className="capitalize text-white/90">{type === 'sale' ? 'Bán' : 'Cho thuê'}</span>
                </>
              ) : null}
            </nav>

            <h1 className="font-display text-[30px] font-normal tracking-tight text-white sm:text-[40px] md:text-[48px]">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-white/80 sm:text-[15px]">
              {subtitle}
            </p>
          </div>
        </section>

        {/* Search Bar - Positioned neatly below title */}
        <div className="container-page relative z-20 -mt-6">
          <PropertySearch />
        </div>

        {/* Interactive Client View with Grid/List Toggle */}
        <PropertiesClientView
          listings={listings}
          type={type}
          area={area}
          propertyType={propertyType}
        />

        {/* Compact Luxury Voucher CTA Banner & Popup Modal */}
        <VoucherCtaBanner />
      </main>

      <SiteFooter />
    </>
  );
}
