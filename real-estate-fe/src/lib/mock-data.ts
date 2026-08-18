export interface Property {
  id: string;
  title: string;
  location: {
    address: string;
    shortAddress: string;
  };
  price: {
    usd: string;
    vnd?: string;
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
    title: 'Biệt thự Ocean Estate Signature Villa',
    location: {
      address: 'Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
      shortAddress: 'Hòa Hải, Ngũ Hành Sơn',
    },
    price: { usd: '$3,596,000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 917, landArea: 450 },
    badges: ['Biệt thự biển', 'Nổi bật', 'Sở hữu lâu dài'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Ocean Estate Signature Villa đại diện cho đỉnh cao của lối sống nghỉ dưỡng thượng lưu bên bờ biển Ngũ Hành Sơn. Tọa lạc tại vị thế kết nối trực tiếp với đại dương xanh mát, căn biệt thự được thiết kế bởi đơn vị kiến trúc hàng đầu thế giới, khai thác trọn vẹn ánh sáng tự nhiên cùng làn gió biển nguyên sơ.',
      'Không gian nội thất rộng 917m² được chăm chút tỉ mỉ với sàn đá cẩm thạch Ý nhập khẩu, trần cao vút kịch trần kết hợp hệ kính cường lực Low-E chống nhiệt tràn viền. Mọi khu vực từ phòng khách trung tâm đến bếp ăn gia đình đều được trang bị thiết bị cao cấp từ Miele và Sub-Zero.',
      'Khu vực ngoại cảnh riêng tư 450m² bao gồm hồ bơi tràn bờ nước mặn, thảm cỏ xanh mướt và chòi vọng cảnh BBQ hoàn hảo cho những bữa tiệc riêng tư dưới hoàng hôn. Phòng ngủ master sở hữu ban công panoramic hướng nhìn ôm trọn bờ biển Mỹ Khê danh tiếng.',
      'Được quản lý theo tiêu chuẩn nghỉ dưỡng 5 sao quốc tế, dự án mang lại tiềm năng gia tăng giá trị bền vững và nguồn thu cho thuê vượt trội đối với các nhà đầu tư danh giá.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Tầm nhìn Biển Panoramic' },
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Hồ bơi tràn bờ riêng' },
      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', label: 'Sân vườn & Terrace BBQ' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Nội thất nhập khẩu Châu Âu' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Hệ thống Smart Home Control4' },
      { icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', label: 'Garage 2 xe ô tô' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'An ninh 3 lớp 24/7' },
      { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Lối đi riêng ra bãi biển' },
    ],
    keyInfo: [
      { label: 'Loại hình BĐS', value: 'Biệt thự đơn lập bờ biển' },
      { label: 'Pháp lý sở hữu', value: 'Sổ hồng lâu dài' },
      { label: 'Tình trạng nội thất', value: 'Bàn giao full cao cấp' },
      { label: 'Năm hoàn thiện', value: '2023' },
      { label: 'Quy mô xây dựng', value: '2 tầng + 1 tum' },
      { label: 'Hướng nhà', value: 'Đông Nam (Hướng biển)' },
    ],
    nearby: [
      { time: '2 phút', place: 'Sân Golf BRG & Montgomerie Links' },
      { time: '5 phút', place: 'Bãi biển Mỹ Khê danh tiếng' },
      { time: '12 phút', place: 'Trung tâm hành chính Hải Châu' },
      { time: '15 phút', place: 'Sân bay Quốc tế Đà Nẵng' },
      { time: '20 phút', place: 'Phố cổ Hội An' }
    ],
    listedDate: '15/05/2024',
    updatedDate: 'Đang cập nhật'
  },
  'riverfront-penthouse': {
    id: 'riverfront-penthouse',
    title: 'Biệt thự Trên Không Sơn Trà Sky Sanctuary',
    location: {
      address: 'Bán đảo Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà, Đà Nẵng',
    },
    price: { usd: '$4,200,000' },
    stats: { bedrooms: 4, bathrooms: 5, internalArea: 1200, landArea: 600 },
    badges: ['Siêu dinh thự', 'Độc quyền', 'Sở hữu lâu dài'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Nằm kiêu hãnh trên vách đá ven biển bán đảo Sơn Trà, Sơn Trà Sky Sanctuary là kiệt tác kiến trúc hiện đại kết hợp hài hòa giữa thiên nhiên hùng vĩ và tiện nghi siêu xa xỉ. Mỗi đường nét thiết kế đều tôn vinh vẻ đẹp kiệt tác của biển cả và núi rừng nguyên sinh.',
      'Sở hữu tổng diện tích sàn 1,200m² với 4 phòng ngủ master gia chủ khép kín, phòng lưu trữ rượu vang đạt chuẩn bảo quản Pháp, phòng chiếu phim gia đình âm thanh Dolby Atmos và khu spa xông hơi thư giãn riêng biệt.',
      'Nội thất được hoàn thiện thủ công từ gỗ óc chó Bắc Mỹ và đá tự nhiên Marble Bồ Đào Nha. Cửa kính tự động trượt mở đưa không khí biển tươi mát vào trọn vẹn không gian sống thượng lưu.',
      'Bán đảo Sơn Trà được mệnh danh là lá phổi xanh của Đà Nẵng, mang lại môi trường sống trong lành tuyệt đối cùng giá trị bất động sản gia tăng không giới hạn theo thời gian.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Tầm nhìn Hướng Núi & Biển 360°' },
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Bể bơi vô cực vô biên' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Nhà thông minh Lutron & Bang & Olufsen' },
      { icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', label: 'Hầm để xe 4 ô tô siêu sang' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Thang máy riêng bảo mật thẻ từ' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Phòng thử rượu & cigar thượng hạng' },
      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', label: 'Khu vườn rooftop panorama' },
    ],
    keyInfo: [
      { label: 'Loại hình BĐS', value: 'Siêu dinh thự ven biển' },
      { label: 'Pháp lý sở hữu', value: 'Sổ hồng vĩnh viễn' },
      { label: 'Nội thất', value: 'Độc bản nhập khẩu Ý' },
      { label: 'Năm hoàn thiện', value: '2024' },
      { label: 'Số tầng', value: '3 tầng' },
      { label: 'Tình trạng', value: 'Sẵn sàng bàn giao' },
    ],
    nearby: [
      { time: '3 phút', place: 'Khu bảo tồn thiên nhiên Sơn Trà' },
      { time: '8 phút', place: 'InterContinental Danang Resort' },
      { time: '12 phút', place: 'Cầu Rồng & Trung tâm Đà Nẵng' },
      { time: '20 phút', place: 'Sân bay Quốc tế Đà Nẵng' }
    ],
    listedDate: '01/06/2024',
    updatedDate: 'Vừa cập nhật'
  },
  'son-tra-sky-residence': {
    id: 'son-tra-sky-residence',
    title: 'Căn hộ Cao Cấp Son Tra Sky Luxury Residence',
    location: {
      address: 'Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà · Mỹ Khê',
    },
    price: { usd: '$685,000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 186, landArea: 0 },
    badges: ['Tầm nhìn biển', 'Mới hoàn thiện', 'Căn hộ luxury'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80'
    ],
    description: [
      'Son Tra Sky Luxury Residence sở hữu tọa độ vàng trên trục đường ven biển sầm nát nhất Đà Nẵng. Căn hộ tầng cao mang đến góc nhìn panorama tuyệt mỹ ôm trọn bãi biển Mỹ Khê thơ mộng và toàn cảnh thành phố lung linh về đêm.',
      'Không gian căn hộ 186m² được tối ưu hóa thông minh với 3 phòng ngủ rộng rãi, logia đón gió biển mát lành và phòng khách liên thông bếp hiện đại. Nội thất bàn giao cao cấp từ các thương hiệu Kohler, Grohe và Hafele.',
      'Cư dân tận hưởng trọn vẹn chuỗi tiện ích chuẩn resort 5 sao bao gồm bể bơi vô cực chân mây tại tầng rooftop, phòng gym hiện đại, trung tâm thương mại và dịch vụ quản lý gia đình chu đáo.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Tầm nhìn Biển Mỹ Khê' },
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Bể bơi vô cực tầng thượng' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Nội thất nhập khẩu cao cấp' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Khóa cửa thông minh 4 chức năng' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Dịch vụ Concierge 24/7' },
      { icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z', label: 'Chỗ đậu xe ô tô định danh' }
    ],
    keyInfo: [
      { label: 'Loại hình BĐS', value: 'Căn hộ cao cấp' },
      { label: 'Tình trạng pháp lý', value: 'Sổ hồng lâu dài' },
      { label: 'Tầng', value: 'Tầng 18' },
      { label: 'Năm hoàn thiện', value: '2024' },
      { label: 'Tình trạng', value: 'Sẵn sàng chuyển vào' }
    ],
    nearby: [
      { time: '2 phút', place: 'Bãi biển Mỹ Khê' },
      { time: '5 phút', place: 'Cầu Sông Hàn' },
      { time: '10 phút', place: 'Sân bay Quốc tế Đà Nẵng' }
    ],
    listedDate: '15/06/2024',
    updatedDate: '1 ngày trước'
  },
  'an-thuong-design-apartment': {
    id: 'an-thuong-design-apartment',
    title: 'Căn Hộ Thiết Kế An Thong Executive Boutique',
    location: {
      address: 'An Thượng, Ngũ Hành Sơn, Đà Nẵng',
      shortAddress: 'Mỹ An · An Thượng',
    },
    price: { usd: '$425,000' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 128, landArea: 0 },
    badges: ['Turn-key', 'Khu phố Tây'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80'
    ],
    description: [
      'Tọa lạc tại trái tim khu phố du lịch An Thượng sầm uất, căn hộ boutique mang phong cách kiến trúc Indochine pha lẫn hiện đại. Chỉ cách bãi biển 3 phút đi bộ, đây là tài sản bất động sản dòng tiền lý tưởng cho thuê chuyên gia nước ngoài.',
      'Nội thất được đo đạc hoàn thiện từ gỗ gõ đỏ tự nhiên, thiết bị vệ sinh TOTO cao cấp cùng hệ thống chiếu sáng nghệ thuật 3 kịch bản. Căn hộ bàn giao trọn gói chìa khóa trao tay.'
    ],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Cách biển 200m' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Nội thất gỗ tự nhiên' },
      { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Dòng tiền cho thuê cao' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Thang máy thẻ từ' }
    ],
    keyInfo: [
      { label: 'Loại hình BĐS', value: 'Căn hộ Boutique' },
      { label: 'Sở hữu', value: 'Lâu dài' }
    ],
    nearby: [
      { time: '3 phút', place: 'Bãi biển Mỹ Khê' },
      { time: '1 phút', place: 'Khu phố Tây An Thượng' }
    ],
    listedDate: '10/06/2024',
    updatedDate: 'Vừa cập nhật'
  },
  'marina-garden-residence': {
    id: 'marina-garden-residence',
    title: 'Biệt Thự Vườn Marina Garden Luxury Villa',
    location: {
      address: 'Sơn Trà, Đà Nẵng',
      shortAddress: 'Sơn Trà · Marina',
    },
    price: { usd: '$790,000' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 204, landArea: 320 },
    badges: ['Sân vườn riêng', 'Bến du thuyền'],
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80'
    ],
    description: [
      'Căn biệt thự sở hữu khuôn viên sân vườn riêng biệt tràn ngập sắc xanh cây lá ngay cạnh bến du thuyền quốc tế Đà Nẵng. Không gian sống an nhiên, biệt lập với môi trường sinh thái trong lành.'
    ],
    features: [
      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', label: 'Sân vườn riêng 320m²' },
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Hồ bơi thư giãn' }
    ],
    keyInfo: [],
    nearby: [],
    listedDate: '05/06/2024',
    updatedDate: '3 ngày trước'
  },
  'my-khe-coastal-apartment': {
    id: 'my-khe-coastal-apartment',
    title: 'Căn Hộ Cho Thuê My Khe Executive Coastal Suite',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Mỹ Khê' },
    price: { usd: '$2,250/tháng' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 118, landArea: 0 },
    badges: ['Cho thuê dài hạn', 'View biển direct'],
    images: [
      '/images/listings/my-khe-coastal-apartment.webp',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Căn hộ cho thuê dài hạn cao cấp trực diện biển Mỹ Khê. Được trang bị trọn bộ thiết bị bếp Bosch Đức, phòng ngủ master king-size hướng biển và dịch vụ dọn phòng định kỳ.'],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Trực diện Biển Mỹ Khê' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Đầy đủ nội thất cao cấp' },
      { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Dịch vụ housekeeping' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Căn hộ cho thuê' }], 
    nearby: [{ time: '1 phút', place: 'Biển Mỹ Khê' }],
    listedDate: '10/07/2024', updatedDate: 'Hôm nay'
  },
  'han-river-executive-home': {
    id: 'han-river-executive-home',
    title: 'Căn Hộ Han River Executive Residence',
    location: { address: 'Hải Châu, Đà Nẵng', shortAddress: 'Hải Châu · Trung tâm' },
    price: { usd: '$1,850/tháng' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 105, landArea: 0 },
    badges: ['Trung tâm phố', 'Cho thuê dài hạn'],
    images: [
      '/images/listings/han-river-executive-home.webp',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Căn hộ hiện đại dành cho chuyên gia tại trung tâm Hải Châu. Chỉ vài bước chân tới các trung tâm tài chính ngân hàng, nhà hàng quốc tế và đường dạo bộ ven Sông Hàn.'],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Tầm nhìn Sông Hàn' },
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Nội thất sang trọng' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Căn hộ cao cấp' }], 
    nearby: [{ time: '5 phút', place: 'Cầu Rồng & Sông Hàn' }],
    listedDate: '01/07/2024', updatedDate: '2 ngày trước'
  },
  'an-thuong-urban-loft': {
    id: 'an-thuong-urban-loft',
    title: 'An Thuong Industrial Luxury Loft',
    location: { address: 'Mỹ An, Đà Nẵng', shortAddress: 'Mỹ An · An Thượng' },
    price: { usd: '$1,450/tháng' },
    stats: { bedrooms: 1, bathrooms: 1, internalArea: 78, landArea: 0 },
    badges: ['Loft thiết kế'],
    images: [
      '/images/listings/an-thuong-urban-loft.webp',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Loft phong cách công nghiệp hiện đại cho thuê dài hạn tại An Thượng. Trần bê tông mài cao thoáng, nội thất gỗ teak tự nhiên và mạng internet tốc độ cao.'],
    features: [
      { icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', label: 'Thiết kế Industrial Loft' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Loft' }], 
    nearby: [{ time: '3 phút', place: 'Biển Mỹ Khê' }],
    listedDate: '15/07/2024', updatedDate: 'Vừa xong'
  },
  'ocean-villas-family-residence': {
    id: 'ocean-villas-family-residence',
    title: 'Ocean Villas Private Family Beach Villa',
    location: { address: 'Hòa Hải, Đà Nẵng', shortAddress: 'Hòa Hải · Beachfront' },
    price: { usd: '$3,900/tháng' },
    stats: { bedrooms: 3, bathrooms: 3, internalArea: 280, landArea: 400 },
    badges: ['Biệt thự gia đình', 'Cho thuê dài hạn'],
    images: [
      '/images/listings/ocean-villas-family-residence.webp',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Biệt thự đơn lập 3 phòng ngủ sang trọng nằm trong khu phức hợp Ocean Villas khép kín. Sở hữu bể bơi riêng, sân vườn thảm cỏ rợp bóng mát và lối đi riêng ra bãi biển.'],
    features: [
      { icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', label: 'Bể bơi riêng' },
      { icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3', label: 'Sân vườn 400m²' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Biệt thự' }], 
    nearby: [{ time: '1 phút', place: 'Sân Golf BRG' }],
    listedDate: '20/06/2024', updatedDate: '1 tuần trước'
  },
  'marina-two-bed-residence': {
    id: 'marina-two-bed-residence',
    title: 'Marina View Executive Residence',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Sông Hàn' },
    price: { usd: '$1,700/tháng' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 96, landArea: 0 },
    badges: ['Available now'],
    images: [
      '/images/listings/marina-two-bed-residence.webp',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Căn hộ 2 phòng ngủ xinh xắn tầm nhìn hướng bến du thuyền. Căn góc ngập tràn ánh nắng tự nhiên, ban công kép và không gian sống an tĩnh.'],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'View bến du thuyền' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Căn hộ' }], 
    nearby: [{ time: '5 phút', place: 'Bến du thuyền' }],
    listedDate: '01/08/2024', updatedDate: 'Vừa xong'
  },
  'son-tra-quiet-retreat': {
    id: 'son-tra-quiet-retreat',
    title: 'Son Tra Mountain Sanctuary Residence',
    location: { address: 'Sơn Trà, Đà Nẵng', shortAddress: 'Sơn Trà · Núi Sơn Trà' },
    price: { usd: '$1,950/tháng' },
    stats: { bedrooms: 2, bathrooms: 2, internalArea: 112, landArea: 0 },
    badges: ['Yên tĩnh'],
    images: [
      '/images/listings/son-tra-quiet-retreat.webp',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
    ],
    description: ['Căn hộ 2 phòng ngủ thanh bình ẩn mình gần khu bảo tồn thiên nhiên bán đảo Sơn Trà và cửa sông.'],
    features: [
      { icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z', label: 'Hướng Núi Sơn Trà' }
    ], 
    keyInfo: [{ label: 'Loại hình BĐS', value: 'Căn hộ' }], 
    nearby: [{ time: '10 phút', place: 'Bán đảo Sơn Trà' }],
    listedDate: '05/08/2024', updatedDate: 'Hôm nay'
  }
};
