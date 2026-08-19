import { notFound } from 'next/navigation';

import { listAmenities, listCategories } from '@/lib/db/repositories/catalog-repo';
import { getMediaByIds } from '@/lib/db/repositories/media-repo';
import { getPropertyById } from '@/lib/db/repositories/property-repo';
import { aiModelName } from '@/server/services/ai-client';
import { isTranslationConfigured } from '@/server/services/translation-service';

import { PropertyForm, type PropertyFormValue } from './_components/property-form';

export const dynamic = 'force-dynamic';

/** Localized<string> ở DB → Record<string,string> cho form. */
function loc(field: Record<string, string | undefined> | undefined): Record<string, string> {
  return Object.fromEntries(Object.entries(field ?? {}).filter(([, v]) => typeof v === 'string')) as Record<
    string,
    string
  >;
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === 'new';

  const [categories, amenities] = await Promise.all([listCategories(), listAmenities()]);

  // Có khoá AI hay không quyết định hiện panel trợ lý.
  const aiEnabled = isTranslationConfigured();
  const modelName = aiModelName();

  const options = {
    aiEnabled,
    modelName,
    categories: categories.map((c) => ({ id: c._id.toHexString(), name: c.name.vi ?? c.name.en ?? c.slug })),
    amenities: amenities.map((a) => ({
      id: a._id.toHexString(),
      name: a.name.vi ?? a.name.en ?? a.slug,
      group: a.group,
    })),
  };

  if (isNew) {
    const empty: PropertyFormValue = {
      id: null,
      slug: '',
      title: {},
      summary: {},
      description: {},
      deal: 'sale',
      categoryId: options.categories[0]?.id ?? '',
      status: 'available',
      priceUsd: 0,
      pricePeriod: 'total',
      negotiable: false,
      specs: {
        bedrooms: 0,
        bathrooms: 0,
        internalArea: 0,
        landArea: null,
        floors: null,
        yearBuilt: null,
        parking: null,
        furnishing: 'none',
        ownership: 'freehold',
      },
      address: {},
      ward: '',
      district: '',
      lat: null,
      lng: null,
      amenityIds: [],
      images: [],
      coverId: null,
      isFeatured: false,
      isVerified: false,
      seoTitle: {},
      seoDescription: {},
      publishState: 'draft',
      isPublic: false,
    };
    return <PropertyForm initial={empty} options={options} />;
  }

  const doc = await getPropertyById(id);
  if (!doc) notFound();

  const media = await getMediaByIds(doc.mediaIds);

  // Mô tả lưu dạng mảng đoạn; form soạn bằng textarea nên nối lại bằng dòng trống.
  const description: Record<string, string> = {};
  for (const [l, paras] of Object.entries(doc.description ?? {})) {
    if (Array.isArray(paras)) description[l] = paras.join('\n\n');
  }

  const initial: PropertyFormValue = {
    id: doc._id.toHexString(),
    slug: doc.slug,
    title: loc(doc.title),
    summary: loc(doc.summary),
    description,
    deal: doc.deal,
    categoryId: doc.categoryId.toHexString(),
    status: doc.status,
    priceUsd: doc.price.usd,
    pricePeriod: doc.price.period,
    negotiable: doc.price.negotiable,
    specs: {
      bedrooms: doc.specs.bedrooms,
      bathrooms: doc.specs.bathrooms,
      internalArea: doc.specs.internalArea,
      landArea: doc.specs.landArea,
      floors: doc.specs.floors,
      yearBuilt: doc.specs.yearBuilt,
      parking: doc.specs.parking,
      furnishing: doc.specs.furnishing,
      ownership: doc.specs.ownership,
    },
    address: loc(doc.location.address),
    ward: doc.location.ward,
    district: doc.location.district,
    // GeoJSON lưu [lng, lat] — đảo lại cho form vì người nhập quen "lat, lng".
    lat: doc.location.geo ? doc.location.geo.coordinates[1] : null,
    lng: doc.location.geo ? doc.location.geo.coordinates[0] : null,
    amenityIds: doc.amenityIds.map((a) => a.toHexString()),
    images: media.map((m) => ({ id: m._id.toHexString(), url: m.url })),
    coverId: doc.coverId?.toHexString() ?? null,
    isFeatured: doc.isFeatured,
    isVerified: doc.isVerified,
    seoTitle: loc(doc.seo.title),
    seoDescription: loc(doc.seo.description),
    publishState: doc.publishState,
    isPublic: doc.isPublic,
  };

  return <PropertyForm initial={initial} options={options} />;
}
