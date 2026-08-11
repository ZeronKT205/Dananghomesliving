export interface Property {
  id: string;
  title: string;
  location: {
    address: string;
    shortAddress: string;
  };
  price: {
    usd: string;
    vnd: string;
  };
  stats: {
    bedrooms: number;
    bathrooms: number;
    internalArea: number;
    landArea: number;
  };
  badges: string[];
  images: string[];
  description: string[];
  features: { icon: string; label: string }[];
  keyInfo: { label: string; value: string }[];
  nearby: { time: string; place: string }[];
  listedDate: string;
  updatedDate: string;
}

export const MOCK_PROPERTIES: Record<string, Property> = {
  'ocean-estate-villa': {
    id: 'ocean-estate-villa',
    title: 'Biệt thự Ocean Estate',
    location: {
      address: 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      shortAddress: 'Hòa Hải, Ngũ Hành Sơn',
    },
    price: { usd: '3,596,000', vnd: '90.000.000.000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 917, landArea: 450 },
    badges: ['Nổi bật', 'Đã xác thực'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Ocean Estate Villa là một căn biệt thự 3 phòng ngủ tuyệt đẹp tọa lạc tại khu vực cao cấp Hòa Hải, Quận Ngũ Hành Sơn. Được thiết kế cho lối sống hiện đại, biệt thự cung cấp không gian nội thất rộng rãi, các trang thiết bị cao cấp cùng sự kết nối liền mạch với không gian ngoài trời, bể bơi riêng tư và khu vườn xanh mát.',
      'Tận hưởng không gian sống yên bình bên bờ biển với những tiện ích đẳng cấp quốc tế ngay trong khuôn viên khu nghỉ dưỡng. Căn biệt thự này là lựa chọn hoàn hảo cho những ai tìm kiếm sự riêng tư, sang trọng và không gian sống đỉnh cao tại Đà Nẵng.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Hướng Biển' },
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Hồ Bơi Riêng' },
      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', label: 'Sân Vườn' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Đầy Đủ Nội Thất' },
    ],
    keyInfo: [
      { label: 'Loại hình', value: 'Biệt thự' },
      { label: 'Sở hữu', value: 'Lâu dài' },
      { label: 'Nội thất', value: 'Đầy đủ nội thất' },
      { label: 'Năm xây dựng', value: '2022' },
      { label: 'Số tầng', value: '2' },
      { label: 'Tình trạng', value: 'Sắp trống' },
    ],
    nearby: [
      { time: '5 phút', place: 'Bãi biển Mỹ Khê' },
      { time: '10 phút', place: 'Sân bay Quốc tế Đà Nẵng' },
      { time: '15 phút', place: 'Sông Hàn' },
    ],
    listedDate: '20/05/2024',
    updatedDate: '2 ngày trước'
  },
  'riverfront-penthouse': {
    id: 'riverfront-penthouse',
    title: 'Biệt thự Trên không Sơn Trà',
    location: {
      address: 'Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà',
    },
    price: { usd: '4,200,000', vnd: '105.000.000.000' },
    stats: { bedrooms: 4, bathrooms: 5, internalArea: 1200, landArea: 600 },
    badges: ['Hạng sang', 'Độc quyền'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Trải nghiệm đỉnh cao của sự sang trọng tại Sơn Trà. Căn biệt thự này mang lại tầm nhìn toàn cảnh ra biển Đông và thành phố Đà Nẵng lung linh về đêm.',
      'Nội thất được nhập khẩu trực tiếp từ Ý, kết hợp với hệ thống nhà thông minh tiên tiến nhất. Cửa kính kịch trần giúp ánh sáng tự nhiên ngập tràn mọi ngóc ngách.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Hướng Núi & Biển' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Nhà Thông Minh' },
      { icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', label: 'Garage 4 xe' },
    ],
    keyInfo: [
      { label: 'Loại hình', value: 'Siêu biệt thự' },
      { label: 'Sở hữu', value: 'Lâu dài' },
      { label: 'Nội thất', value: 'Nhập khẩu Ý' },
      { label: 'Năm xây dựng', value: '2023' },
      { label: 'Số tầng', value: '3' },
      { label: 'Tình trạng', value: 'Sẵn sàng giao' },
    ],
    nearby: [
      { time: '3 phút', place: 'Bán đảo Sơn Trà' },
      { time: '12 phút', place: 'Cầu Rồng' },
      { time: '20 phút', place: 'Sân bay Quốc tế Đà Nẵng' },
    ],
    listedDate: '01/06/2024',
    updatedDate: '5 giờ trước'
  },
  'son-tra-sky-residence': {
    id: 'son-tra-sky-residence',
    title: 'Son Tra Sky Residence',
    location: {
      address: 'Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà · Mỹ Khê',
    },
    price: { usd: '685,000', vnd: '17.000.000.000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 186, landArea: 0 },
    badges: ['Sea view', 'Mới'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'
    ],
    description: [
      'Căn hộ cao cấp với tầm nhìn tuyệt đẹp ra biển Mỹ Khê và thành phố.',
      'Không gian sống hiện đại, tiện nghi đẳng cấp 5 sao.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Hướng Biển' }
    ],
    keyInfo: [
      { label: 'Loại hình', value: 'Căn hộ cao cấp' },
      { label: 'Tình trạng', value: 'Đang bán' }
    ],
    nearby: [
      { time: '2 phút', place: 'Biển Mỹ Khê' }
    ],
    listedDate: '15/06/2024',
    updatedDate: '1 ngày trước'
  },
  'an-thuong-design-apartment': {
    id: 'an-thuong-design-apartment',
    title: 'An Thuong Design Apartment',
    location: {
      address: 'An Thượng, Ngũ Hành Sơn, Đà Nẵng',
      shortAddress: 'Mỹ An · An Thượng',
    },
    price: { usd: '425,000', vnd: '10.500.000.000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 128, landArea: 0 },
    badges: ['Turn-key'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Căn hộ thiết kế độc đáo tại khu phố Tây An Thượng sầm uất.'
    ],
    features: [],
    keyInfo: [],
    nearby: [],
    listedDate: '10/06/2024',
    updatedDate: 'Vừa xong'
  },
  'marina-garden-residence': {
    id: 'marina-garden-residence',
    title: 'Marina Garden Residence',
    location: {
      address: 'Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà · Marina',
    },
    price: { usd: '790,000', vnd: '19.700.000.000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 204, landArea: 0 },
    badges: ['Private garden'],
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80'
    ],
    description: [
      'Căn hộ có sân vườn riêng biệt, không gian xanh mát giữa lòng thành phố.'
    ],
    features: [],
    keyInfo: [],
    nearby: [],
    listedDate: '05/06/2024',
    updatedDate: '3 ngày trước'
  },
  'my-khe-coastal-apartment': {
    id: 'my-khe-coastal-apartment',
    title: 'My Khe Executive Coastal Apartment',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Mỹ Khê' },
    price: { usd: '2,250', vnd: '56.000.000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 118, landArea: 0 },
    badges: ['Most requested'],
    images: [
      '/images/listings/my-khe-coastal-apartment.webp',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Refined long-term rental apartment directly facing the East Sea horizon. Equipped with a full suite of German Bosch appliances, king-size master suite with ocean bath, and optional weekly housekeeping service.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Căn hộ' }], nearby: [{ time: '1 phút', place: 'Biển Mỹ Khê' }],
    listedDate: '10/07/2024', updatedDate: 'Hôm nay'
  },
  'han-river-executive-home': {
    id: 'han-river-executive-home',
    title: 'Han River Executive City Residence',
    location: { address: 'Hải Châu, Đà Nẵng', shortAddress: 'Hải Châu · City Centre' },
    price: { usd: '1,850', vnd: '46.000.000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 105, landArea: 0 },
    badges: ['City living'],
    images: [
      '/images/listings/han-river-executive-home.webp',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Sleek executive home in central Hai Chau district. Located steps away from major banking centers, international restaurants, and the Han River walking promenade.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Căn hộ' }], nearby: [{ time: '5 phút', place: 'Sông Hàn' }],
    listedDate: '01/07/2024', updatedDate: '2 ngày trước'
  },
  'an-thuong-urban-loft': {
    id: 'an-thuong-urban-loft',
    title: 'An Thuong Industrial Loft',
    location: { address: 'Mỹ An, Đà Nẵng', shortAddress: 'Mỹ An · An Thượng' },
    price: { usd: '1,450', vnd: '36.000.000' },
    stats: { bedrooms: 1, bathrooms: 1, internalArea: 78, landArea: 0 },
    badges: ['Walkable'],
    images: [
      '/images/listings/an-thuong-urban-loft.webp',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Stylish industrial-chic loft for long-term rental in An Thuong. High polished concrete ceilings, custom solid teak furniture, and high-speed Wi-Fi.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Loft' }], nearby: [{ time: '3 phút', place: 'Biển Mỹ Khê' }],
    listedDate: '15/07/2024', updatedDate: 'Vừa xong'
  },
  'ocean-villas-family-residence': {
    id: 'ocean-villas-family-residence',
    title: 'Ocean Villas Private Family Estate',
    location: { address: 'Hòa Hải, Đà Nẵng', shortAddress: 'Hòa Hải · Beachfront' },
    price: { usd: '3,900', vnd: '97.500.000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 280, landArea: 400 },
    badges: ['Private villa'],
    images: [
      '/images/listings/ocean-villas-family-residence.webp',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Luxury 3-bedroom detached villa located inside the exclusive gated Ocean Villas complex. Features a private swimming pool, manicured lawn gardens, and a direct shaded pathway to the private beach.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Biệt thự' }], nearby: [{ time: '1 phút', place: 'Sân Golf BRG' }],
    listedDate: '20/06/2024', updatedDate: '1 tuần trước'
  },
  'marina-two-bed-residence': {
    id: 'marina-two-bed-residence',
    title: 'Marina View Two-Bed Residence',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Han River' },
    price: { usd: '1,700', vnd: '42.500.000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 96, landArea: 0 },
    badges: ['Available now'],
    images: [
      '/images/listings/marina-two-bed-residence.webp',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Comfortable 2-bedroom long-term rental overlooking the marina basin. Features a sunlit corner layout, modern appliances, double balcony, and peaceful residential environment.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Căn hộ' }], nearby: [{ time: '5 phút', place: 'Bến du thuyền' }],
    listedDate: '01/08/2024', updatedDate: 'Vừa xong'
  },
  'son-tra-quiet-retreat': {
    id: 'son-tra-quiet-retreat',
    title: 'Son Tra Sanctuary Retreat',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Mountain' },
    price: { usd: '1,950', vnd: '48.750.000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 112, landArea: 0 },
    badges: ['Quiet location'],
    images: [
      '/images/listings/son-tra-quiet-retreat.webp',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Serene 2-bedroom home nestled near the Son Tra mountain nature reserve and river estuary.'],
    features: [], keyInfo: [{ label: 'Loại hình', value: 'Căn hộ' }], nearby: [{ time: '10 phút', place: 'Bán đảo Sơn Trà' }],
    listedDate: '05/08/2024', updatedDate: 'Hôm nay'
  }
};
