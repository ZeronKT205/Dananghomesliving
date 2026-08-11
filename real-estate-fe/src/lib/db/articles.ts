import 'server-only';

import type { Article } from '@/types';

/** Nội dung tin tức bất động sản cao cấp Đà Nẵng. */
const ARTICLES: readonly Article[] = [
  {
    slug: 'international-buyers-guide',
    category: 'Buying guide',
    readingTime: '8 min read',
    date: '10 Aug 2026',
    featured: true,
    title: 'What international buyers should understand before choosing a Da Nang residence',
    excerpt:
      'A practical overview of coastal locations, legal ownership considerations for foreigners, service charges and key questions before placing an offer.',
    image: '/images/journal/buying-guide.webp',
    imageAlt: 'Modern Da Nang apartment overlooking the sea',
    author: {
      name: 'Nguyen Minh Tu',
      role: 'Senior Real Estate Advisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Buying Guide', 'Foreign Ownership', 'Legal', 'Da Nang'],
    content: `
Da Nang continues to attract international buyers, investors, and expatriates seeking coastal luxury combined with strong economic growth. However, navigating Vietnam's real estate market requires clear insight into ownership structures, property types, and local regulations.

### 1. Legal Ownership Framework for Foreign Buyers

Foreign individuals holding a valid visa in Vietnam can purchase properties under specific legal conditions:
* **Pink Book (Ownership Certificate):** Grants ownership rights for up to 50 years (renewable) under the Foreign Ownership Quota (SPA - Sale & Purchase Agreement).
* **Quotas per Project:** Maximum 30% of total units in a condominium building or 250 landed houses in a ward can be owned by foreign nationals.
* **Long-term Lease Agreement (LTLA):** An alternative structure for developments where foreign ownership quotas have been reached.

### 2. High-Demand Prime Neighborhoods

* **My Khe Beach & An Thuong:** Ideal for high yield rental investments and lifestyle living. Excellent walkability to international cafes, restaurants, and white sand beaches.
* **Son Tra Peninsula:** Offers private hillside villas and quiet luxury residences surrounded by lush nature and panoramic ocean vistas.
* **Hai Chau (City Centre):** The financial and administrative heart of Da Nang, favored by professionals seeking urban convenience near the Han River.

### 3. Understanding Maintenance & Service Fees

When purchasing a premium residential unit, verify ongoing management costs:
1. **Sinking Fund (Bảo trì):** Standard 2% fee collected upon turnover for building maintenance.
2. **Monthly Management Fee:** Typically ranges between $0.80 to $1.80 / sqm, covering 24/7 security, pool maintenance, gym operations, and concierge services.

### Key Takeaway for Buyers

Always work with licensed, bilingual real estate consultancies who can verify developer credentials, review contract terms, and ensure seamless registration for your ownership certificate.
    `,
  },
  {
    slug: 'furnished-rental-details',
    category: 'Design',
    readingTime: '5 min read',
    date: '05 Aug 2026',
    featured: false,
    title: 'The details that make a furnished rental feel genuinely premium',
    excerpt:
      'From lighting and custom storage to acoustic comfort and natural ventilation, discover the subtle signals of real quality in coastal living.',
    image: '/images/journal/design-details.webp',
    imageAlt: 'Refined luxury bathroom interior with gold accents',
    author: {
      name: 'Elena Rostova',
      role: 'Interior Design Consultant',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Interior Design', 'Rentals', 'Luxury Living'],
    content: `
A high-end rental property is defined by more than just high price tags or brand-name appliances. True comfort comes down to meticulous layout decisions, climate resilience, and sensory details.

### Soundproofing & Acoustic Insulation
Coastal breeze is welcome, but traffic noise and hallway echo can undermine tranquility. Look out for double-glazed acoustic glass, solid core interior doors, and perimeter door seals.

### Natural Illumination & Ventilation
In Da Nang's tropical climate, orientation matters. North and North-East facing apartments stay naturally cooler during hot summer months while capturing gentle sea breezes.

### Custom Built-In Storage
Well-integrated wardrobes with soft-close hardware, hidden laundry nooks, and recessed bathroom cabinetry eliminate clutter and expand usable space effortlessly.
    `,
  },
  {
    slug: 'choosing-your-neighbourhood',
    category: 'Neighbourhoods',
    readingTime: '6 min read',
    date: '28 Jul 2026',
    featured: false,
    title: 'My Khe, An Thuong or Hai Chau: choosing the right base for your lifestyle',
    excerpt:
      'A concise comparison of three popular areas for coastal living, walkability, international dining, and long-term convenience.',
    image: '/images/journal/neighbourhoods.webp',
    imageAlt: 'Dark luxury bedroom with ocean view',
    author: {
      name: 'Nguyen Minh Tu',
      role: 'Senior Real Estate Advisor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Neighbourhoods', 'Lifestyle', 'Location Guide'],
    content: `
Selecting the right neighborhood in Da Nang depends heavily on your daily routine, work arrangements, and lifestyle preferences.

### My Khe Beach & An Thuong Quarter
Known as the expat heartland, An Thuong offers a vibrant beachside community where everything is reachable within a 5-minute stroll. Coffee shops, organic markets, and yoga studios line the leafy streets.

### Hai Chau District
If you prefer city energy, proximity to international schools, government centers, and high-end dining along the Han River promenade, Hai Chau offers full urban convenience.

### Ngu Hanh Son & Non Nuoc Resort Corridor
Home to ultra-luxury villas and golf course residences. Perfect for those seeking gated security, private beaches, and tranquil resort-style living away from city bustle.
    `,
  },
  {
    slug: 'da-nang-market-report-q3-2026',
    category: 'Market Report',
    readingTime: '7 min read',
    date: '20 Jul 2026',
    featured: true,
    title: 'Da Nang Real Estate Market Update: Q3 2026 Trends & Yield Analysis',
    excerpt:
      'Demand for luxury coastal apartments rises by 18% year-on-year driven by digital nomads, returning diaspora, and long-stay international executives.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Da Nang skyline and Han River bridge',
    author: {
      name: 'Tran Bao Lam',
      role: 'Head of Research & Analytics',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Market Report', 'Yields', 'Investment', '2026 Data'],
    content: `
The Da Nang property landscape in 2026 exhibits solid fundamentals supported by expanding air connectivity, infrastructure upgrades, and a steady influx of high-net-worth individuals.

### Key Performance Highlights:
* **Rental Yields:** Premium 2-bedroom coastal apartments maintain average gross yields between 5.8% and 6.5% annually.
* **Occupancy Rates:** High-end managed residences achieved an average 82% occupancy rate over the dry season.
* **Infrastructure Drivers:** The completion of coastal highway enhancements and new direct international flight routes have bolstered interest from East Asian and European investors.
    `,
  },
  {
    slug: 'sustainable-coastal-architecture',
    category: 'Architecture',
    readingTime: '4 min read',
    date: '12 Jul 2026',
    featured: false,
    title: 'Sustainable Coastal Architecture: Living in Harmony with Da Nang’s Sea Breeze',
    excerpt:
      'How modern developers are incorporating green facades, passive cooling, and saltwater-resistant materials for durable coastal luxury.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    imageAlt: 'Sustainable modern villa with green balcony',
    author: {
      name: 'Elena Rostova',
      role: 'Interior Design Consultant',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    },
    tags: ['Architecture', 'Sustainability', 'Green Living'],
    content: `
Building along the coast of Vietnam requires specialized materials and architectural techniques to withstand salt air, humidity, and typhoons.

### Passive Cooling Strategies
Deep balcony overhangs and exterior louvers reduce solar heat gain while preserving unobstructed views of the East Sea.

### Corrosion-Resistant Finishes
Anodized aluminum framing, marine-grade stainless steel hardware, and anti-efflorescence stone sealants ensure properties maintain their pristine facade for decades.
    `,
  },
];

export async function getArticles(): Promise<Article[]> {
  return [...ARTICLES];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = ARTICLES.find((item) => item.slug === slug);
  return article || null;
}
