import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ListingCard } from '@/components/features/listing/listing-card';
import { APP_NAME } from '@/config/constants';
import { getAllListings, getListingBySlug } from '@/lib/db/listings';

import { SiteFooter } from '../../_components/site-footer';
import { SiteHeader } from '../../_components/site-header';

import { PropertyCtaSidebar } from './_components/property-cta-sidebar';
import { PropertyGallery } from './_components/property-gallery';

import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    return {
      title: `Property Not Found | ${APP_NAME}`,
    };
  }

  return {
    title: `${listing.title} | ${APP_NAME}`,
    description: listing.description || `${listing.title} located in ${listing.location}.`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const allListings = await getAllListings();
  const relatedProperties = allListings.filter((item) => item.slug !== slug).slice(0, 3);

  const isVilla = listing.propertyType === 'Villa';
  const isRent = listing.listingType === 'rent';

  // Subtle, refined specs list using sans-serif font
  const specsList = [
    { label: 'Bedrooms', value: `${listing.beds} Beds` },
    { label: 'Bathrooms', value: `${listing.baths} Baths` },
    { label: 'Surface Area', value: listing.area },
    { label: 'Type', value: listing.propertyType || 'Residence' },
    { label: 'Furnishing', value: 'Turn-key Fully Furnished' },
    { label: 'View', value: isVilla ? 'Ocean Front & Gardens' : 'Sea View & Skyline' },
    { label: 'Ownership', value: isRent ? 'Long Lease' : 'Pink Book Certificate' },
  ];

  const amenityCategories = [
    {
      title: 'In-Home Comfort & Kitchen',
      items: [
        'Central Dual Climate Control',
        'Bosch Integrated Kitchen Suite',
        'Private Sun Terrace & Balcony',
        'Floor-to-Ceiling Acoustic Glass',
        'Smart Keyless Entry Lock',
        'High-Speed Fiber Optic Wi-Fi',
      ],
    },
    {
      title: 'Building & Resort Facilities',
      items: [
        'Resort Infinity Swimming Pool',
        '24/7 Monitored Gated Security',
        'Fully Equipped Fitness Gym',
        'Underground Resident Parking',
        'Bilingual Concierge & Reception',
        'Backup Power Generator System',
      ],
    },
  ];

  const nearbyLandmarks = [
    { name: 'My Khe Coastal Beach', distance: '2 minutes walk' },
    { name: 'Da Nang International Airport', distance: '12 minutes drive' },
    { name: 'Dragon Bridge & Han River Promenade', distance: '5 minutes drive' },
    { name: 'BRG & Montgomerie Championship Golf Courses', distance: '10 minutes drive' },
    { name: 'Vincom Plaza & Lotte Mart Shopping', distance: '6 minutes drive' },
  ];

  return (
    <>
      <SiteHeader />

      <main className="bg-paper min-h-screen pt-4 pb-6 lg:pt-6 lg:pb-8 animate-fade-in-up">
        <div className="container-page">
          {/* Breadcrumbs & Navigation Bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[12px] border-b border-line/60 pb-3">
            <div className="flex items-center gap-2 font-sans">
              <Link href="/" className="text-muted hover:text-navy transition-colors font-medium">
                Home
              </Link>
              <span className="text-muted">/</span>
              <Link href="/properties" className="text-muted hover:text-navy transition-colors font-medium">
                Properties
              </Link>
              <span className="text-muted">/</span>
              <span className="text-gold font-bold truncate max-w-[200px] sm:max-w-xs">{listing.title}</span>
            </div>

            <Link
              href="/properties"
              className="text-navy hover:text-gold font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center gap-1 font-sans"
            >
              ← Back to Listings
            </Link>
          </div>

          {/* ── TOP HEADER: TITLE & BADGES (PRICE REMOVED FROM TOP AS REQUESTED) ── */}
          <div className="mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-gold text-navy text-[9px] font-bold tracking-[0.16em] uppercase px-3 py-1 font-sans">
                {listing.badge}
              </span>
              <span className="bg-navy text-white text-[9px] font-bold tracking-[0.16em] uppercase px-3 py-1 font-sans">
                {listing.listingType === 'sale' ? 'For Sale' : 'Long-Term Rent'}
              </span>
              {listing.areaName && (
                <span className="border border-line text-muted text-[9px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 font-sans">
                  {listing.areaName}
                </span>
              )}
            </div>

            <h1 className="font-display text-navy text-[32px] sm:text-[42px] lg:text-[48px] leading-[1.08] font-normal">
              {listing.title}
            </h1>

            <p className="text-muted mt-1.5 text-[14px] font-medium font-sans flex items-center gap-1.5">
              <span>📍</span>
              {listing.location}
            </p>
          </div>

          {/* ── PHOTO GALLERY: MAIN VIEWPORT WITH LEFT/RIGHT ARROWS + 1-ROW THUMBNAILS ── */}
          <div className="mb-8">
            <PropertyGallery
              mainImage={listing.image}
              imageAlt={listing.imageAlt}
              gallery={listing.gallery}
              title={listing.title}
            />
          </div>

          {/* ── PRICE & REFINED SPECS BAR (PLACED BELOW GALLERY) ── */}
          <div className="bg-white border border-line p-5 md:p-6 mb-8 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Price Display */}
            <div>
              <span className="text-gold text-[10px] font-bold tracking-[0.18em] uppercase block mb-1 font-sans">
                {listing.listingType === 'sale' ? 'Guide Purchase Price' : 'Monthly Rental Rate'}
              </span>
              <div className="font-display text-navy text-[34px] sm:text-[40px] font-normal leading-none">
                {listing.price}
                {listing.priceNote && (
                  <span className="text-muted text-[13px] font-sans ml-1.5 font-normal">{listing.priceNote}</span>
                )}
              </div>
            </div>

            {/* Subtle Refined Specs Bar (Clean Sans-Serif Typography) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-sans text-navy border-t lg:border-t-0 border-line/60 pt-3 lg:pt-0">
              {specsList.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-muted text-[11px] uppercase tracking-wider font-semibold">
                    {spec.label}:
                  </span>
                  <strong className="font-semibold text-navy">{spec.value}</strong>
                  {idx < specsList.length - 1 && (
                    <span className="text-muted/40 ml-2 hidden sm:inline">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── SEAMLESS INTEGRATED CONTENT & STICKY CTA SIDEBAR ── */}
          <div className="grid gap-8 lg:grid-cols-12 mb-16">
            {/* Left Content Area: One Fluid, Continuous Container */}
            <div className="lg:col-span-8 bg-white border border-line p-6 sm:p-9 shadow-xs space-y-8">
              {/* Property Overview Narrative */}
              <div>
                <h2 className="text-navy text-[20px] sm:text-[22px] font-bold font-sans border-b border-line/60 pb-3 mb-4 tracking-tight">
                  Residence Overview &amp; Architectural Profile
                </h2>
                <p className="text-navy/85 text-[15px] leading-relaxed font-sans mb-4 font-normal">
                  {listing.description}
                </p>
                <p className="text-navy/75 text-[14px] leading-relaxed font-sans">
                  Designed for modern living and long-term capital appreciation, this residence features open layout planning, abundant natural ventilation from ocean breezes, and high-spec architectural finishes curated specifically for international tastes.
                </p>
              </div>

              {/* Highlight Features */}
              {listing.features && listing.features.length > 0 && (
                <div className="border-t border-line/60 pt-7">
                  <h2 className="text-navy text-[20px] sm:text-[22px] font-bold font-sans pb-3 mb-4 tracking-tight">
                    Highlight Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                    {listing.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[13.5px] text-navy font-medium">
                        <span className="text-gold font-bold text-[14px]">▪</span>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorized Amenities */}
              <div className="border-t border-line/60 pt-7">
                <h2 className="text-navy text-[20px] sm:text-[22px] font-bold font-sans pb-3 mb-5 tracking-tight">
                  Amenities &amp; Building Facilities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {amenityCategories.map((cat, idx) => (
                    <div key={idx} className="bg-paper p-4.5 border border-line/70">
                      <h3 className="text-gold text-[11px] font-bold tracking-[0.16em] uppercase mb-3 border-b border-gold/30 pb-1.5">
                        {cat.title}
                      </h3>
                      <ul className="space-y-2 text-[13px] text-navy font-medium">
                        {cat.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-2">
                            <span className="text-muted text-[10px]">▪</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location & Neighborhood Highlights */}
              <div className="border-t border-line/60 pt-7">
                <h2 className="text-navy text-[20px] sm:text-[22px] font-bold font-sans pb-3 mb-4 tracking-tight">
                  Location &amp; Neighborhood Connectivity
                </h2>

                <p className="text-muted text-[13.5px] font-sans mb-4">
                  Situated in <strong>{listing.location}</strong>, combining tranquility with immediate access to international dining, schools, and beaches.
                </p>

                <div className="space-y-2 font-sans">
                  {nearbyLandmarks.map((landmark, idx) => (
                    <div key={idx} className="bg-paper border border-line/60 px-4 py-2.5 flex items-center justify-between text-[13px]">
                      <span className="text-navy font-semibold">{landmark.name}</span>
                      <span className="text-gold font-bold text-[11px] uppercase tracking-wider">{landmark.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Agent Consultation Sidebar with Interactive Popup Form */}
            <div className="lg:col-span-4">
              <PropertyCtaSidebar
                propertyTitle={listing.title}
                propertyPrice={listing.price}
                priceNote={listing.priceNote}
                propertyLocation={listing.location}
              />
            </div>
          </div>

          {/* Curated Similar Properties */}
          <section className="border-t border-line pt-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-gold text-[10px] font-bold tracking-[0.18em] uppercase block font-sans">
                  Curated Portfolio
                </span>
                <h3 className="font-display text-navy text-[26px] sm:text-[32px] font-normal">
                  Similar Residences in Da Nang
                </h3>
              </div>

              <Link href="/properties" className="text-gold hover:underline text-[12px] font-bold uppercase tracking-wider font-sans">
                View all properties →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map((rel, idx) => (
                <ListingCard
                  key={rel.slug}
                  listing={rel}
                  sizes="33vw"
                  priority={idx === 0}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
