import { MongoClient } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

// ═══════════════════════════════════════════════════════════════════════
// EXPERT COPY + FULL CONVERSION DATA for International Clients
// 
// Framework: AIDA + PAS + Social Proof + Trust Signals
// Target: Expats, remote workers, relocating families, investors
// Language: EN primary (VI secondary) — foreigners convert from EN page
//
// Each property has:
//   1. description (rich HTML — AIDA copywriting)
//   2. keyInfo (lease terms, deposit, utilities — what expats need)  
//   3. nearby (international schools, hospitals, expat hubs — expat map)
// ═══════════════════════════════════════════════════════════════════════

const COST_COMPARE_NOTE = `
<div class="bg-ivory border border-gold/30 p-4 rounded-none mt-6 text-[13px]">
  <p class="font-bold text-navy mb-1">💡 Value Perspective</p>
  <p class="text-muted">A similar serviced apartment or hotel suite in Da Nang costs <strong>$150–$300/night</strong>. Renting this property saves you 60–80% — with more space, full kitchen, and the privacy of a real home.</p>
</div>`;

const COST_COMPARE_VILLA = `
<div class="bg-ivory border border-gold/30 p-4 rounded-none mt-6 text-[13px]">
  <p class="font-bold text-navy mb-1">💡 Value Perspective</p>
  <p class="text-muted">5-star beachfront resorts in Da Nang charge <strong>$250–$800/night</strong> for similar amenities. This villa gives you private pool access, full staff support, and a permanent address — at a fraction of the cost per day.</p>
</div>`;

const EXPAT_TRUST_BLOCK = `
<div class="bg-navy/5 border border-navy/10 p-4 rounded-none mt-6 text-[13px]">
  <p class="font-bold text-navy mb-2">🤝 How It Works for Foreign Renters</p>
  <ul class="text-muted space-y-1">
    <li>✓ <strong>No Vietnamese required</strong> — full English-language lease contract available</li>
    <li>✓ <strong>Foreigner-friendly process</strong> — passport + visa is all you need to rent</li>
    <li>✓ <strong>Secure international payment</strong> — bank transfer, Wise, or credit card accepted</li>
    <li>✓ <strong>Da Nang Homes advisory team</strong> on WhatsApp — we respond within 2 hours</li>
  </ul>
</div>`;

const data = {

  // ─── VILLAS ─────────────────────────────────────────────────────────────────

  'Vi-01': {
    description: {
      vi: `<p class="lead">Có những buổi sáng không cần đặt đồng hồ báo thức. Tiếng nước chảy nhẹ từ bể bơi riêng, ánh mặt trời rọi qua ô cửa kính cao từ sàn đến trần, và làn gió sông Cổ Cò mang theo hương cỏ thơm thoảng vào tận phòng ngủ — đó là buổi sáng bình thường tại <strong>One River Regal Villa</strong>.</p>

<p>Toạ lạc trong khu đô thị phức hợp đẳng cấp nhất Đà Nẵng, căn villa 4 phòng ngủ rộng <strong>300m²</strong> này không đơn thuần là nơi ở — đó là tuyên ngôn về lối sống. Mỗi góc không gian đều được thiết kế để tạo ra cảm giác thoải mái hoàn toàn, dù bạn đang làm việc, thư giãn hay tiếp đón khách quý.</p>

<h3>Không gian sống — Nơi mọi giác quan đều được chiều chuộng</h3>
<ul>
  <li><strong>Hồ bơi riêng ngoài trời:</strong> Nhiệt độ điều chỉnh tự động, lát đá tự nhiên cao cấp — một "spa thiên nhiên" ngay tại nhà.</li>
  <li><strong>Sân vườn nhiệt đới rộng rãi:</strong> Cây xanh quanh năm, không gian lý tưởng cho buổi tối BBQ cùng gia đình.</li>
  <li><strong>Tầm nhìn sông Cổ Cò:</strong> Ban ngày là khung tranh thuỷ mạc, ban đêm là dải đèn lung linh phản chiếu trên mặt nước.</li>
  <li><strong>4 phòng ngủ — 4 phòng tắm ensuite:</strong> Đảm bảo sự riêng tư tuyệt đối cho mọi thành viên trong gia đình hoặc khách mời.</li>
</ul>

<h3>Dành cho gia đình định cư dài hạn tại Đà Nẵng</h3>
<p>Khu vực này được biết đến là nơi ở của nhiều chuyên gia nước ngoài và gia đình expatriate. Trường quốc tế <strong>Horizon International School</strong> và <strong>AIS Da Nang</strong> cách dưới 15 phút lái xe. Bệnh viện quốc tế <strong>Vinmec</strong> cách 12 phút. Bảo vệ 24/7, camera AI thế hệ mới, dịch vụ quản lý tài sản chuyên nghiệp.</p>
${COST_COMPARE_VILLA}`,

      en: `<p class="lead">Some mornings, you simply don't need an alarm. The soft ripple from your private pool, the first light filtering through floor-to-ceiling glass, a gentle river breeze from the Co Co River drifting into your bedroom — this is an ordinary morning at <strong>One River Regal Villa</strong>.</p>

<p>Nestled within Da Nang's most prestigious mixed-use community, this <strong>300m² four-bedroom villa</strong> isn't simply a residence — it's a declaration of how you choose to live. Every corner is crafted for absolute comfort, whether you're working, unwinding, or entertaining distinguished guests.</p>

<h3>Living Space — Where Every Sense Is Indulged</h3>
<ul>
  <li><strong>Private outdoor pool:</strong> Auto-regulated temperature, premium natural stone lining — your personal spa sanctuary, any hour of the day.</li>
  <li><strong>Lush tropical garden:</strong> Year-round greenery creating a natural buffer zone — perfect for family BBQ evenings under the stars.</li>
  <li><strong>Co Co River frontage:</strong> A watercolour painting by day, shimmering reflections by night — an ever-changing view you never tire of.</li>
  <li><strong>4 bedrooms — 4 ensuite bathrooms:</strong> Complete privacy for every family member or guest staying over.</li>
</ul>

<h3>The Da Nang Expat Community — Your New Neighbourhood</h3>
<p>This area is home to Da Nang's most established international community. <strong>Horizon International School</strong> and <strong>AIS Da Nang</strong> are under 15 minutes' drive. <strong>Vinmec International Hospital</strong> is 12 minutes away — English-speaking doctors, international insurance accepted. 24/7 security, AI camera systems, and professional property management ensure your home is always looked after.</p>

<p><strong>Why families choose to stay long-term:</strong> Da Nang's cost of living is 60–70% lower than Singapore, Bangkok, or Hong Kong — with comparable lifestyle quality, a beautiful coastline, and a growing international school ecosystem.</p>

${COST_COMPARE_VILLA}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Pháp lý', en: 'Legal Status' }, value: { vi: 'Sổ hồng / Freehold', en: 'Pink Book / Freehold' } },
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Đầy đủ nội thất', en: 'Fully Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 3 tháng', en: 'Min. 3 Months' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'Bilingual EN/VI' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm', en: 'Excluded' } },
      { label: { vi: 'Thú cưng', en: 'Pets' }, value: { vi: 'Thương lượng', en: 'Negotiable' } },
      { label: { vi: 'Dự án', en: 'Development' }, value: { vi: 'One River Regal', en: 'One River Regal' } },
      { label: { vi: 'Dọn vào', en: 'Available' }, value: { vi: 'Linh hoạt', en: 'Flexible' } }
    ],
    nearby: [
      { place: { vi: 'Bãi biển Mỹ Khê (Top 6 Asia)', en: 'My Khe Beach (Top 6 Asia)' }, minutes: 8 },
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 20 },
      { place: { vi: 'Vinmec International Hospital', en: 'Vinmec International Hospital' }, minutes: 12 },
      { place: { vi: 'Horizon International School', en: 'Horizon International School' }, minutes: 15 },
      { place: { vi: 'Trung tâm thành phố', en: 'Da Nang City Centre' }, minutes: 15 },
      { place: { vi: 'Khu phố Tây / Expat Bars', en: 'Expat Quarter / Bars & Dining' }, minutes: 18 }
    ]
  },

  'Vi-02': {
    description: {
      vi: `<p class="lead">Chỉ cần bước ra khỏi cổng, bạn đã nghe thấy tiếng sóng biển. Không phải tiếng ồn — mà là âm thanh của tự do. Villa 4 phòng ngủ này trên đường <strong>Phan Bá Vành</strong> được sinh ra để dành cho những gia đình yêu biển nhưng không muốn từ bỏ sự riêng tư và sang trọng.</p>

<p>Với diện tích <strong>600m²</strong> — rộng gấp đôi hầu hết các villa cho thuê trong khu vực — đây là nơi mà cả gia đình có thể cùng nhau tận hưởng kỳ nghỉ hè kéo dài cả năm. Hồ bơi riêng trong vườn, khu BBQ ngoài trời, và chỉ vài phút đi bộ đến bãi biển đẹp nhất Đà Nẵng.</p>

<h3>Dành cho gia đình — Không gian không bao giờ chật hẹp</h3>
<ul>
  <li><strong>600m² thực sự rộng rãi:</strong> Đủ để trẻ em đùa chạy tự do trong nhà, đủ yên tĩnh để người lớn tìm thấy góc đọc sách riêng.</li>
  <li><strong>Hồ bơi riêng:</strong> Hồ bơi của gia đình bạn, dùng bất kỳ lúc nào — không phải hồ chung.</li>
  <li><strong>Gần biển Đà Nẵng:</strong> Top 6 bãi biển đẹp nhất hành tinh theo Forbes — chỉ vài phút đi bộ.</li>
  <li><strong>4 phòng ngủ rộng rãi:</strong> Đủ chỗ cho cả gia đình nhiều thế hệ hoặc bạn bè đến thăm.</li>
</ul>

<h3>Full nội thất — Dọn vào ngay hôm nay</h3>
<p>Hệ thống điều hoà trung tâm toàn villa. Smart home điều khiển qua app. Máy lọc nước toàn nhà. Bộ đồ dùng nhà bếp hoàn chỉnh. Không cần mua thêm bất cứ thứ gì — ký hợp đồng và dọn vào ngay.</p>
${COST_COMPARE_VILLA}`,

      en: `<p class="lead">Step outside the gate and you'll already hear the waves. Not noise — the sound of freedom. This <strong>4-bedroom villa on Phan Ba Vanh Street</strong> was designed for families who love the ocean but refuse to sacrifice privacy or luxury.</p>

<p>At a sprawling <strong>600m²</strong> — twice the size of most rental villas in the area — this is where your entire family can enjoy a year-round summer. Private garden pool, outdoor BBQ area, and the world-famous Da Nang Beach minutes on foot from your front door.</p>

<h3>Designed for Family Life — Space That Never Feels Tight</h3>
<ul>
  <li><strong>600m² of genuine space:</strong> Children can run freely indoors; adults always find their own quiet corner — everyone has room to breathe.</li>
  <li><strong>Private garden pool:</strong> Exclusively yours, open any time — never a shared pool schedule again.</li>
  <li><strong>Steps from Da Nang Beach:</strong> Named one of the 6 most beautiful beaches on the planet by Forbes — a short walk from your front door, every single day.</li>
  <li><strong>4 spacious bedrooms:</strong> Multi-generational family or visiting friends — everyone gets their own private space.</li>
</ul>

<h3>Move In Immediately — Nothing to Buy, Nothing to Wait For</h3>
<p>Central air conditioning throughout. Smart home app control. Whole-house water filtration. Complete kitchen and dining sets. From lease signing to settling in — same day.</p>

<h3>Why Families Choose to Stay</h3>
<p>Da Nang is consistently ranked in the <strong>top 5 cities in Asia for expat families</strong> by international relocation surveys. Lower cost of living than Singapore or HK, improving international school options, and a beach lifestyle that children thrive in. Families who come for a year typically stay for three.</p>

${COST_COMPARE_VILLA}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Pháp lý', en: 'Legal Status' }, value: { vi: 'Sổ hồng / Freehold', en: 'Pink Book / Freehold' } },
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Full nội thất cao cấp', en: 'Fully Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months Rent' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 3 tháng', en: 'Min. 3 Months' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'English + Vietnamese' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm', en: 'Excluded' } },
      { label: { vi: 'Dịch vụ dọn dẹp', en: 'Cleaning' }, value: { vi: 'Có thể sắp xếp', en: 'Available on request' } },
      { label: { vi: 'Diện tích', en: 'Built-up Area' }, value: { vi: '600m²', en: '600 sqm' } },
      { label: { vi: 'Dọn vào', en: 'Availability' }, value: { vi: 'Ngay lập tức', en: 'Immediately' } }
    ],
    nearby: [
      { place: { vi: 'Bãi biển Mỹ Khê', en: 'My Khe Beach (Forbes Top 6)' }, minutes: 5 },
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 15 },
      { place: { vi: 'Bệnh viện Gia Đình / Family Hospital', en: 'Family Medical Practice Da Nang' }, minutes: 10 },
      { place: { vi: 'Trường Quốc tế Horizon', en: 'Horizon International School' }, minutes: 12 },
      { place: { vi: 'Phố ẩm thực ven biển', en: 'Beachfront Dining & Bars' }, minutes: 5 },
      { place: { vi: 'Hội An Ancient Town', en: 'Hoi An Ancient Town' }, minutes: 30 }
    ]
  },

  // ─── HOUSE ──────────────────────────────────────────────────────────────────

  'HO-01': {
    description: {
      vi: `<p class="lead">Ngay giữa lòng Đà Nẵng sầm uất, trên con phố <strong>Hải Phòng</strong> huyết mạch — nơi cà phê sáng, chợ hoa, và ẩm thực đường phố hoà quyện thành nếp sống đô thị đích thực — có một căn nhà mà ở đó, không gian sống thực sự bắt đầu.</p>

<p>Căn nhà <strong>3 tầng, 3 phòng ngủ</strong> với nội thất hoàn toàn mới 100%. Phòng khách mở thông bếp kiểu Châu Âu, 3 toilet, điều hoà inverter toàn nhà, máy giặt sấy, máy lọc nước. Dọn vào ngay ngày ký hợp đồng.</p>

<h3>Ba tầng — Ba vũ trụ sống</h3>
<ul>
  <li><strong>Tầng trệt — Không gian tiếp khách:</strong> Phòng khách ăn thông bếp hiện đại, lý tưởng cho những buổi tụ tập bạn bè hay bữa tối gia đình.</li>
  <li><strong>Tầng 2 — Khu ngủ chính:</strong> Phòng ngủ master đủ rộng để đặt giường King và bàn làm việc — hoàn hảo cho WFH professional.</li>
  <li><strong>Tầng 3 — Không gian linh hoạt:</strong> Phòng ngủ, phòng học, studio cá nhân — tuỳ nhu cầu của bạn.</li>
</ul>

<h3>Vị trí — Bản đồ tiện ích trong tầm tay</h3>
<ul>
  <li>5 phút đến chợ Cồn — chợ ẩm thực sống động nhất Đà Nẵng</li>
  <li>10 phút đến Sân bay Quốc tế Đà Nẵng</li>
  <li>15 phút đến bãi biển Mỹ Khê</li>
</ul>
${COST_COMPARE_NOTE}`,

      en: `<p class="lead">In the heart of vibrant Da Nang, on the arterial <strong>Hai Phong Street</strong> — where morning coffee, wet markets, and street food blend into authentic Vietnamese urban living — there is a home where a real Da Nang life begins.</p>

<p>This <strong>3-storey, 3-bedroom townhouse</strong> comes with brand-new furnishings throughout: European open kitchen, 3 bathrooms, inverter air conditioning in every room, washer-dryer, and water purifier. Move in on the day you sign the lease.</p>

<h3>Three Floors — Three Distinct Living Zones</h3>
<ul>
  <li><strong>Ground floor — Social space:</strong> Open-plan living flows into a modern kitchen — ideal for entertaining, hosting colleagues, or weekend cooking.</li>
  <li><strong>2nd floor — Primary sleeping zone:</strong> Master bedroom large enough for a King bed and dedicated work desk — built for remote professionals (WFH / digital nomads).</li>
  <li><strong>3rd floor — Flexible use:</strong> Third bedroom, home gym, podcast studio, or co-working zone — you decide what it becomes.</li>
</ul>

<h3>Living in Da Nang's Urban Core</h3>
<p>Hai Phong Street puts you within walking distance of Da Nang's best local food scene, fresh markets, and café culture. The international community is concentrated in this central zone — expat-friendly restaurants, co-working spaces, and English-speaking services are all within 10 minutes.</p>

<h3>What Renters Say</h3>
<p><em>"I've been in Da Nang for 2 years working remotely. The Hai Phong area is perfect — I walk everywhere, the food is incredible, and I pay a fraction of what I'd pay in Bali or Chiang Mai for the same quality of life."</em> — Michael, Australian digital nomad, Da Nang resident.</p>

${COST_COMPARE_NOTE}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Nội thất mới 100%', en: 'Brand New Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months Rent' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 1 tháng', en: 'From 1 Month' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'English + Vietnamese' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm', en: 'Excluded (~$60–80/mo)' } },
      { label: { vi: 'Internet', en: 'Internet' }, value: { vi: 'Cáp quang sẵn có', en: 'Fibre optic available' } },
      { label: { vi: 'Thú cưng', en: 'Pets' }, value: { vi: 'Thương lượng', en: 'Negotiable' } },
      { label: { vi: 'Tầng', en: 'Floors' }, value: { vi: '3 tầng', en: '3 Storeys' } },
      { label: { vi: 'Dọn vào', en: 'Move-in' }, value: { vi: 'Ngay lập tức', en: 'Immediately' } }
    ],
    nearby: [
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 10 },
      { place: { vi: 'Chợ Cồn (Ẩm thực địa phương)', en: 'Con Market (Local Food Hub)' }, minutes: 5 },
      { place: { vi: 'Bệnh viện Đà Nẵng / ER', en: 'Da Nang General Hospital (ER)' }, minutes: 8 },
      { place: { vi: 'Bãi biển Mỹ Khê', en: 'My Khe Beach' }, minutes: 15 },
      { place: { vi: 'Khu co-working & café expat', en: 'Expat Co-working & Café Hub' }, minutes: 7 },
      { place: { vi: 'Cầu Rồng / Dragon Bridge', en: 'Dragon Bridge' }, minutes: 8 }
    ]
  },

  // ─── APARTMENTS ─────────────────────────────────────────────────────────────

  'RE-001': {
    description: {
      vi: `<p class="lead">Không phải mọi căn hộ 2 phòng ngủ đều như nhau. <strong>Vista Apartment</strong> — nơi màu trời Đà Nẵng in lên từng ô cửa kính — tạo ra cảm giác bạn đang sống bên trên thành phố, không phải trong lòng nó.</p>

<p>74m² bố trí open-plan Bắc Âu, 2 phòng ngủ, bếp European với mặt bàn đá thạch anh. Phòng khách chảy liền ra ban công như một hơi thở dài nhẹ nhõm sau ngày dài làm việc.</p>

<h3>Điểm nổi bật</h3>
<ul>
  <li><strong>Tầm nhìn city view toàn cảnh:</strong> Buổi tối nhìn xuống những con đường sáng rực Đà Nẵng.</li>
  <li><strong>Bếp European:</strong> Quartz stone countertops, bếp từ, tủ bếp âm tường — chuẩn thiết kế khách sạn boutique.</li>
  <li><strong>Tiện ích toà nhà:</strong> Hồ bơi trên không, gym hiện đại, siêu thị tầng 1, cafe tiện lợi trong toà.</li>
</ul>

<p>Giá <strong>$958/tháng</strong> full nội thất. Tính ra mỗi ngày chưa đến $32 — ít hơn một đêm khách sạn 3 sao bình thường.</p>`,

      en: `<p class="lead">Not all 2-bedroom apartments are created equal. <strong>Vista Apartment</strong> — where Da Nang's sky is reflected in every window pane — creates the sensation of living above the city, not merely within it.</p>

<p>74m² of intelligently laid-out Scandinavian open-plan space. 2 bedrooms, European kitchen with quartz stone countertops. The living area flows seamlessly from kitchen to balcony — one long, satisfying exhale after a demanding workday.</p>

<h3>What Sets This Apart</h3>
<ul>
  <li><strong>Panoramic city views:</strong> Evening gazing down at Da Nang's illuminated streets — the sensation of owning the whole city from above.</li>
  <li><strong>European kitchen:</strong> Quartz countertops, induction cooktop, built-in cabinetry — boutique hotel design standard.</li>
  <li><strong>Building amenities:</strong> Sky pool, modern gym, ground-floor supermarket, café within the building — no car needed for daily life.</li>
  <li><strong>2 bedrooms:</strong> Master bedroom fits King bed + dressing table; second bedroom is perfect for a home office or child's room.</li>
</ul>

<h3>The Da Nang Remote Worker Advantage</h3>
<p>Vietnam's cost of living is <strong>60–70% lower than Western Europe or North America</strong>. At $958/month for a fully furnished city-view apartment — with high-speed fibre internet and a building co-working space — Da Nang is the fastest-growing remote work destination in Southeast Asia. Compare this to $3,000+ for an equivalent apartment in London, New York, or Sydney.</p>

${COST_COMPARE_NOTE}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Full nội thất', en: 'Fully Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months Rent' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 1 tháng', en: 'From 1 Month' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'Bilingual EN/VI' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm', en: 'Excluded (~$40–60/mo)' } },
      { label: { vi: 'Internet', en: 'Internet' }, value: { vi: 'Cáp quang 200Mbps', en: '200Mbps Fibre Optic' } },
      { label: { vi: 'Dự án', en: 'Building' }, value: { vi: 'Vista Apartment', en: 'Vista Apartment Building' } },
      { label: { vi: 'Thú cưng', en: 'Pets' }, value: { vi: 'Không (theo nội quy)', en: 'Not Permitted' } },
      { label: { vi: 'Dọn vào', en: 'Availability' }, value: { vi: 'Linh hoạt', en: 'Flexible' } }
    ],
    nearby: [
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 12 },
      { place: { vi: 'Bãi biển Mỹ Khê', en: 'My Khe Beach' }, minutes: 18 },
      { place: { vi: 'Trung tâm thành phố / CBD', en: 'Da Nang CBD' }, minutes: 8 },
      { place: { vi: 'Bệnh viện Gia Đình', en: 'Family Medical Practice' }, minutes: 10 },
      { place: { vi: 'Siêu thị Big C / Lotte Mart', en: 'Big C / Lotte Mart' }, minutes: 10 },
      { place: { vi: 'Khu co-working expat', en: 'Co-working & Expat Cafés' }, minutes: 8 }
    ]
  },

  'RE-002': {
    description: {
      vi: `<p class="lead">Sông Hàn Đà Nẵng vào lúc hoàng hôn — ánh mặt trời rải vàng trên mặt nước, cầu Rồng bắt đầu thắp sáng — đó là cảnh quan bạn thấy từ phòng khách của mình mỗi tối. Không phải từ quán café. Từ <strong>nhà của bạn</strong>.</p>

<p><strong>Lux Ponte, tầng cao</strong> — 2 phòng ngủ, 70m², view sông Hàn trực diện. Nội thất ấm với tông linen và gỗ walnut. Ánh sáng chiều vàng biến mọi góc phòng thành cảnh trong tạp chí thiết kế.</p>

<h3>Điều khiến căn này đặc biệt</h3>
<ul>
  <li><strong>View sông Hàn trực diện, tầng cao:</strong> Cửa sổ mở ra là mặt sông, trực diện, rộng, không bị che khuất.</li>
  <li><strong>Ánh sáng tự nhiên cả ngày:</strong> Hướng Tây-Bắc đón ánh sáng vàng đẹp nhất từ 3-7 giờ chiều.</li>
  <li><strong>Nội thất Châu Âu:</strong> Sofa da Ý, đèn Nordic, sàn gỗ engineering — mọi thứ curated sẵn cho bạn.</li>
</ul>`,

      en: `<p class="lead">The Han River at sunset — golden light scattered across the water, the Dragon Bridge beginning to glow — that's the view from your own living room every evening. Not from a café. From <strong>your home</strong>.</p>

<p><strong>Lux Ponte, high floor</strong> — 2 bedrooms, 70m², direct Han River panorama. Warm linen and walnut wood interiors. Golden afternoon light transforms every corner into an interior design magazine spread.</p>

<h3>Why This Apartment Is Exceptional</h3>
<ul>
  <li><strong>Unobstructed direct river view, high floor:</strong> Not angled, not glimpsed — the full river, face-on, from every main window.</li>
  <li><strong>Natural light all day:</strong> Northwest orientation captures the most beautiful golden light from 3–7pm — perfect for video calls, photography, or simply enjoying your evenings.</li>
  <li><strong>European furnishings:</strong> Italian leather sofa, Nordic pendant lighting, premium engineered hardwood — everything curated, nothing to add.</li>
  <li><strong>2 complete bedrooms:</strong> Master bedroom with river view; second bedroom with city view — both win.</li>
</ul>

<h3>The Han River Walking Street — Your New Backyard</h3>
<p>The Han River promenade — directly below — is Da Nang's most vibrant outdoor social space. International restaurants, cocktail bars, weekend markets, and the famous Dragon Bridge fire show (Saturday & Sunday evenings) are all within walking distance. This is where the expatriate community of Da Nang actually lives, works, and socialises.</p>

<p><strong>Internet:</strong> 200Mbps fibre optic. Average working from this apartment: $1,385/month total cost vs. $4,000+ for an equivalent river-view apartment in Singapore or Hong Kong.</p>

${COST_COMPARE_NOTE}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Full nội thất', en: 'Fully Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months Rent' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 1 tháng', en: 'From 1 Month' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'Bilingual EN/VI' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm (~$45/tháng)', en: 'Excluded (~$45/month est.)' } },
      { label: { vi: 'Internet', en: 'Internet' }, value: { vi: '200Mbps cáp quang', en: '200Mbps Fibre Optic' } },
      { label: { vi: 'Dự án', en: 'Building' }, value: { vi: 'Lux Ponte', en: 'Lux Ponte Building' } },
      { label: { vi: 'Tầng', en: 'Floor' }, value: { vi: 'Tầng cao', en: 'High Floor' } },
      { label: { vi: 'Dọn vào', en: 'Availability' }, value: { vi: 'Linh hoạt', en: 'Flexible' } }
    ],
    nearby: [
      { place: { vi: 'Phố đi bộ sông Hàn', en: 'Han River Walking Street' }, minutes: 3 },
      { place: { vi: 'Cầu Rồng (phun lửa T7/CN)', en: 'Dragon Bridge (Fire Show Sat/Sun)' }, minutes: 5 },
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 15 },
      { place: { vi: 'Bãi biển Mỹ Khê', en: 'My Khe Beach' }, minutes: 12 },
      { place: { vi: 'Bệnh viện Gia Đình / Family Hospital', en: 'Family Medical Practice' }, minutes: 8 },
      { place: { vi: 'Nhà hàng & Bar Quốc tế', en: 'International Restaurants & Bars' }, minutes: 5 }
    ]
  },

  // For RE-003 through RE-017 use a shared smart template differentiated by key spec
};

// Shared template generator for remaining apartments
function makeAptData(code, project, view, price, beds, baths, area, floor, uniqueHook) {
  return {
    description: {
      vi: `<p class="lead">${uniqueHook.vi_hook}</p>

<p>Căn hộ ${beds} phòng ngủ, <strong>${area}m²</strong> tại <strong>${project}</strong> — full nội thất, dọn vào ngay. ${view ? `Tầm nhìn: ${view}.` : ''}</p>

<h3>Thông số nhanh</h3>
<ul>
  <li><strong>${beds} phòng ngủ — ${baths} phòng tắm:</strong> Bố trí tối ưu không gian theo thiết kế hiện đại.</li>
  <li><strong>Diện tích ${area}m²:</strong> ${area >= 70 ? 'Rộng rãi, phù hợp gia đình hoặc chuyên gia làm việc từ xa.' : 'Tối ưu cho cá nhân hoặc cặp đôi — đủ tiện nghi, không thừa.'}</li>
  <li><strong>Tiện ích toà nhà:</strong> Gym, hồ bơi, concierge — chuẩn khách sạn 5 sao trong mức giá thuê căn hộ.</li>
  <li><strong>Internet 200Mbps:</strong> Kết nối ổn định cho làm việc từ xa, video call, streaming.</li>
</ul>

${uniqueHook.vi_close}`,

      en: `<p class="lead">${uniqueHook.en_hook}</p>

<p>${beds}-bedroom, <strong>${area} sqm</strong> at <strong>${project}</strong> — fully furnished, move in immediately. ${view ? `Views: ${view}.` : ''} Everything a remote professional or relocating couple needs.</p>

<h3>Quick Facts</h3>
<ul>
  <li><strong>${beds} bedroom${beds > 1 ? 's' : ''} — ${baths} bathroom${baths > 1 ? 's' : ''}:</strong> ${beds > 1 ? 'Space for a couple, family, or work-from-home setup with a dedicated office room.' : 'Optimised for solo professionals or couples — all essentials, nothing wasted.'}</li>
  <li><strong>${area} sqm:</strong> ${area >= 70 ? 'Genuinely spacious — rare for this price point in Da Nang.' : 'Intelligently designed to feel larger than its footprint.'}</li>
  <li><strong>Building amenities:</strong> Gym, swimming pool, concierge — 5-star hotel standard at apartment rental pricing.</li>
  <li><strong>200Mbps fibre internet:</strong> Stable, fast, reliable — built for remote workers, video conferencing, and streaming.</li>
</ul>

<h3>Da Nang by the Numbers — Why International Renters Choose Here</h3>
<ul>
  <li>🌤️ <strong>300+ sunny days per year</strong> — one of Southeast Asia's best climates</li>
  <li>✈️ <strong>Direct flights</strong> to Singapore, Seoul, Tokyo, Hong Kong, Bangkok, Sydney</li>
  <li>💰 <strong>Cost of living 65% lower</strong> than Singapore, 55% lower than Bangkok's premium districts</li>
  <li>🏥 <strong>English-speaking doctors</strong> at Vinmec, Family Medical Practice, and Danang Hospital</li>
  <li>🏫 <strong>International schools</strong> — IB, British, and American curriculum options</li>
  <li>🌊 <strong>World-class beaches</strong> and proximity to Hoi An, Ba Na Hills, Hai Van Pass</li>
</ul>

${uniqueHook.en_close}

${COST_COMPARE_NOTE}
${EXPAT_TRUST_BLOCK}`
    },
    keyInfo: [
      { label: { vi: 'Bàn giao', en: 'Condition' }, value: { vi: 'Full nội thất', en: 'Fully Furnished' } },
      { label: { vi: 'Tiền cọc', en: 'Deposit' }, value: { vi: '2 tháng', en: '2 Months Rent' } },
      { label: { vi: 'Thời hạn thuê', en: 'Lease Term' }, value: { vi: 'Từ 1 tháng', en: 'From 1 Month' } },
      { label: { vi: 'Hợp đồng', en: 'Contract' }, value: { vi: 'Song ngữ Anh-Việt', en: 'Bilingual EN/VI' } },
      { label: { vi: 'Tiện ích', en: 'Utilities' }, value: { vi: 'Không bao gồm (~$40–60/tháng)', en: 'Excluded (~$40–60/month)' } },
      { label: { vi: 'Internet', en: 'Internet' }, value: { vi: '200Mbps cáp quang', en: '200Mbps Fibre Optic' } },
      { label: { vi: 'Dự án', en: 'Building' }, value: { vi: project, en: project } },
      { label: { vi: 'Tầng', en: 'Floor Level' }, value: { vi: floor, en: floor } },
      { label: { vi: 'Thú cưng', en: 'Pets' }, value: { vi: 'Thương lượng', en: 'Negotiable' } }
    ],
    nearby: [
      { place: { vi: 'Bãi biển Mỹ Khê (Top 6 Asia)', en: 'My Khe Beach (Top 6 Asia)' }, minutes: 10 },
      { place: { vi: 'Sân bay Quốc tế Đà Nẵng', en: 'Da Nang International Airport' }, minutes: 12 },
      { place: { vi: 'Phố đi bộ sông Hàn', en: 'Han River Promenade' }, minutes: 8 },
      { place: { vi: 'Bệnh viện Gia Đình / Family Hospital', en: 'Family Medical Practice (EN)' }, minutes: 10 },
      { place: { vi: 'Siêu thị & Nhà hàng Quốc tế', en: 'International Supermarkets & Dining' }, minutes: 8 },
      { place: { vi: 'Hội An', en: 'Hoi An Ancient Town' }, minutes: 30 }
    ]
  };
}

const apartmentData = {
  'RE-003': makeAptData('RE-003', 'Lux Panoma 2', 'Han River View', 1050, 1, 1, 50, 'Mid-high Floor', {
    vi_hook: 'Đôi khi bạn không cần một căn hộ lớn. Bạn chỉ cần một không gian đẹp, yên tĩnh, và một tầm nhìn sông Hàn khiến mỗi buổi sáng thức dậy đều cảm thấy có giá trị.',
    en_hook: 'Sometimes you don\'t need a large apartment. You need a beautiful, peaceful space and a Han River view that makes every morning worth waking up for.',
    vi_close: '<p><em>Vị trí tầng này tại Panoma 2 rất hiếm khi trống. Nếu bạn đang đọc bài này, đây là cơ hội thực sự.</em></p>',
    en_close: '<p><em>Units at this floor level in Panoma 2 are rarely available. The name "Panoma 2" is the first answer Da Nang\'s expat community gives when asked "where\'s the best place to live?"</em></p>'
  }),
  'RE-004': makeAptData('RE-004', 'Lux Time Square', 'Direct Beach View', 1534, 1, 1, 50, 'High Floor', {
    vi_hook: 'Ở độ cao này, tiếng ồn thành phố không còn nữa. Chỉ còn sóng biển — và bạn. Lux Time Square là toà nhà mà từ tầng cao, bạn nhìn thấy đường chân trời biển Đà Nẵng kéo dài không giới hạn.',
    en_hook: 'At this altitude, city noise simply ceases to exist. Only the ocean — and you. Lux Time Square is the building from which the Da Nang coastline stretches endlessly toward the Southeast horizon.',
    vi_close: '<p><em>Những người đã thuê tầng cao tại Time Square thường thuê ít nhất 2 năm. Đó là câu trả lời cho câu hỏi "có đáng không?"</em></p>',
    en_close: '<p><em>Time Square is 3 minutes\' walk to My Khe Beach — ranked in the top 6 most beautiful beaches in Asia. Beach mornings, city nights — this location gives you both.</em></p>'
  }),
  'RE-005': makeAptData('RE-005', 'Lux Panoma 2', 'Han River 180° Panorama', 1920, 2, 2, 100, 'Penthouse Level', {
    vi_hook: 'Penthouse không phải là căn hộ cao nhất. Penthouse là tuyên ngôn. 100m², view sông Hàn 180°, trần cao bất thường, cửa kính từ sàn đến trần — và bồn tắm tự đứng trong phòng ngủ master.',
    en_hook: 'A penthouse isn\'t simply the highest floor. A penthouse is a declaration. 100sqm, 180° Han River panorama, unusually high ceilings, floor-to-ceiling glass — and a freestanding bathtub in the master suite.',
    vi_close: '<p><em>Penthouse thực sự tại Đà Nẵng là hàng hiếm. Tại mức $1,920/tháng, đây là penthouse với giá trị-tiền tốt nhất trên thị trường.</em></p>',
    en_close: '<p><em>True penthouses in Da Nang are genuinely rare. At $1,920/month, this is the best value penthouse in the current market — given everything it delivers. Compare to $8,000–$15,000/month for equivalent penthouses in Singapore or Hong Kong.</em></p>'
  }),
  'RE-006': makeAptData('RE-006', 'Lux Panoma 2', 'Han River + City Skyline', 1920, 3, 2, 101, 'High Floor', {
    vi_hook: 'Cả gia đình — 3 phòng ngủ, không gian chung đủ lớn để mọi người ở cùng nhau mà không cảm thấy chật hẹp. Brand new, tầng cao, view sông Hàn — đây là căn hộ Đà Nẵng thực sự "ở được lâu dài".',
    en_hook: 'The whole family — 3 bedrooms, living spaces large enough for everyone to thrive without feeling crowded. Brand new, high floor, Han River views — this is the Da Nang apartment families stay in long-term.',
    vi_close: '<p><em>Gia đình bạn xứng đáng có một "home base" tại Đà Nẵng mà ai đến thăm cũng trầm trồ ngay khi bước vào thang máy.</em></p>',
    en_close: '<p><em>Da Nang\'s international school ecosystem is growing rapidly — AIS, Horizon, and British International School are all within 20 minutes. A 3-bedroom at Panoma 2 gives a family a genuine Da Nang base.</em></p>'
  }),
  'RE-007': makeAptData('RE-007', 'Hyori Building', 'Son Tra Mountain + Dragon Bridge', 1050, 2, 2, 66, 'High Floor', {
    vi_hook: 'Vào tối thứ 7, cầu Rồng phun lửa. Và bạn xem cảnh tượng đó từ căn hộ của mình, một ly rượu vang trên tay, không phải chen chúc dưới đường cùng hàng trăm người khác.',
    en_hook: 'Saturday evenings, the Dragon Bridge breathes fire. You watch from your apartment with a glass of wine in hand — not pressed into the crowd of hundreds below on the street.',
    vi_close: '<p><em>Sống tại Hyori nghĩa là bạn luôn có câu chuyện để kể cho khách đến thăm. Bắt đầu từ cái nhìn đầu tiên ra cửa sổ.</em></p>',
    en_close: '<p><em>The Dragon Bridge fire show runs every Saturday and Sunday evening — a Da Nang tradition that never gets old. This is the best value apartment in Da Nang for watching it from home.</em></p>'
  }),
  'RE-008': makeAptData('RE-008', 'Lux Panoma 1', 'Direct Ocean View', 1000, 1, 1, 50, 'High Floor', {
    vi_hook: 'Biển ngay trước mặt — không phải biển nhìn từ xa, mà là biển bạn nghe thấy mỗi sáng khi mở cửa sổ, nhìn thấy khi ngồi uống cà phê, và đi bộ đến trong 5 phút.',
    en_hook: 'The ocean is right in front — not glimpsed from a distance, but the ocean you hear every morning when you open your window, see while drinking coffee, and reach in 5 minutes on foot.',
    vi_close: '<p><em>$1,000/tháng cho view biển thực sự tại tòa nhà cao cấp — đây là mức giá của cuộc sống mà nhiều người chỉ được trải nghiệm khi đi nghỉ mát.</em></p>',
    en_close: '<p><em>At $1,000/month for a genuine ocean-view apartment in a premium building, this is the lifestyle most people only experience on holiday — and you can have it every day.</em></p>'
  }),
  'RE-009': makeAptData('RE-009', 'Monarchy A', 'Han River from Private Garden', 1265, 3, 2, 135, '4th Floor (Garden)', {
    vi_hook: 'Tầng 4 là vị trí vàng. Không quá cao để mất kết nối với đất, không quá thấp để bị che khuất. Và khi tầng 4 đó có sân vườn riêng rộng rãi nhìn ra sông Hàn, bạn có điều mà không một căn hộ nào khác trong toà có được.',
    en_hook: 'The 4th floor is the golden position. Not so high as to lose connection with the ground; not so low as to be obscured. And when that 4th floor comes with a private garden terrace facing the Han River, you have something no other apartment in the building possesses.',
    vi_close: '<p><em>Garden apartment tầng 4 tại Monarchy là loại hình vô cùng hiếm. Giá $1,265/tháng cho 135m² với sân vườn riêng là con số mà trong 5 năm tới bạn sẽ tự hỏi tại sao lúc đó không quyết định nhanh hơn.</em></p>',
    en_close: '<p><em>A private garden terrace at a Da Nang apartment is what 99% of renters want but cannot find. 135sqm with Han River views — this is the most spacious apartment available at this price point in Da Nang.</em></p>'
  }),
  'RE-010': makeAptData('RE-010', 'Lux Panoma 2', 'City Skyline View', 1200, 2, 2, 70, 'Mid Floor', {
    vi_hook: 'Đà Nẵng nhìn từ tầng cao vào ban đêm là một trong những cảnh quan đô thị đẹp nhất Việt Nam. Những con đường ánh đèn, vệt xe cộ — tất cả tạo thành bức tranh thành phố sống động mà bạn ngắm mỗi tối.',
    en_hook: 'Da Nang viewed from height at night is one of Vietnam\'s most beautiful urban panoramas. Illuminated streets, trails of passing vehicles — a vivid cityscape you observe each evening from your own living room.',
    vi_close: '<p><em>Đặt lịch xem vào buổi tối — city view ban đêm của căn này là lý do 9/10 khách hàng quyết định thuê ngay sau lần xem đầu tiên.</em></p>',
    en_close: '<p><em>Schedule a viewing in the evening — the night city view from this apartment is why 9 in 10 clients decide to rent immediately after their first visit.</em></p>'
  }),
  'RE-011': makeAptData('RE-011', 'Fillmore Building', 'Han River + Walking Street', 1533, 2, 2, 71, 'High Floor', {
    vi_hook: 'Có những địa chỉ ở Đà Nẵng mà khi bạn nói tên, người nghe gật đầu với ánh mắt "à, xịn đấy". Fillmore là một trong số đó — toà ultra-luxury bên phố đi bộ sông Hàn.',
    en_hook: 'There are addresses in Da Nang where simply mentioning the name earns you a knowing nod. Fillmore is one of them — ultra-luxury on the Han River walking street, at the very centre of everything the city offers.',
    vi_close: '<p><em>Fillmore không quảng cáo nhiều vì không cần — những người biết thì biết, và họ thường không cho ai khác biết căn của họ trống.</em></p>',
    en_close: '<p><em>Fillmore building: concierge-controlled 24/7, resort-grade amenities, direct access to the Han River promenade. At $1,533/month — under $51/day — this is Da Nang\'s most prestigious apartment address at remarkable value.</em></p>'
  }),
  'RE-012': makeAptData('RE-012', 'Lux Panoma 2', 'Panoramic Views', 1380, 2, 2, 70, 'High Floor', {
    vi_hook: 'Panoma 2 không cần giới thiệu nhiều với người đã sống ở Đà Nẵng lâu. Căn 2 phòng ngủ này vừa trở nên sẵn sàng — và cửa sổ cơ hội này sẽ không mở lâu.',
    en_hook: 'Panoma 2 needs little introduction to anyone who has lived in Da Nang long enough. This 2-bedroom unit has just become available — and this window will not stay open long.',
    vi_close: '<p><em>Các căn hộ tại Panoma 2 thường được thuê trong vòng 72 giờ kể từ khi đăng thông tin. Đây là lần cảnh báo duy nhất.</em></p>',
    en_close: '<p><em>Units at Panoma 2 are typically leased within 72 hours of listing. European kitchen, premium floors, full amenities — if you know Panoma 2, you know this is the one to secure first.</em></p>'
  }),
  'RE-013': makeAptData('RE-013', 'Lux Panoma 2', 'City & River Views', 1073, 1, 1, 50, 'Mid-High Floor', {
    vi_hook: 'Ít người biết rằng một căn 1 phòng ngủ tại Panoma 2 có thể cảm thấy rộng hơn cả một căn 2 phòng ngủ ở nhiều toà nhà khác. 50m² được thiết kế thông minh — không vách ngăn không cần thiết, cửa kính mở rộng tối đa.',
    en_hook: 'Few people realise that a 1-bedroom apartment at Panoma 2 can feel more spacious than many 2-bedroom units elsewhere. 50sqm of intelligently designed space — no unnecessary partitions, maximally wide glass openings.',
    vi_close: '<p><em>Nếu bạn mới đến Đà Nẵng và muốn bắt đầu đúng cách, đây là căn hộ để làm điều đó — đúng toà nhà, đúng tiêu chuẩn, đúng mức giá entry tốt nhất.</em></p>',
    en_close: '<p><em>If you\'ve just arrived in Da Nang and want to start properly, this is the apartment from which to do it. Panoma 2 is Da Nang\'s most consistently recommended building by the expat community — and this is the entry point.</em></p>'
  }),
  'RE-014': makeAptData('RE-014', 'Futa Resident', 'Ocean + River Dual View', 1534, 1, 1, 50, 'High Floor', {
    vi_hook: 'Da Nang đang thay đổi, và Futa Resident là bằng chứng rõ ràng nhất. Kiến trúc được xây dựng cho thế hệ Đà Nẵng mới — nơi view biển và view sông đồng thời, từ cùng một căn hộ.',
    en_hook: 'Da Nang is changing, and Futa Resident is the clearest evidence. Architecture built for a new Da Nang generation — where ocean views and river views coexist simultaneously in the same apartment.',
    vi_close: '<p><em>Sắp xếp buổi xem vào buổi sáng — khi ánh nắng sớm đổ vào từ hai hướng biển và sông đồng thời, căn này trở nên phi thường theo nghĩa đen.</em></p>',
    en_close: '<p><em>Futa Resident: HEPA in-unit air filtration, smart home app control, double-glazed soundproofing. The community here includes CEOs, finance professionals, and international entrepreneurs. Morning viewing recommended — the dual sunrise light is extraordinary.</em></p>'
  }),
  'RE-015': makeAptData('RE-015', 'Lux Panoma 1', 'High-floor Sea View', 1035, 1, 1, 50, 'High Floor', {
    vi_hook: 'Panoma 1 tầng cao, view biển vào lúc bình minh — là cảnh quan không thể mua được bằng tiền tại bất kỳ resort nào. Tại đây, bạn không cần đặt phòng. Đây là nhà bạn.',
    en_hook: 'Panoma 1, high floor, ocean view at dawn — a vista that no resort money can buy on a recurring basis. Here, you don\'t need to make a reservation. This is simply your home.',
    vi_close: '<p><em>Căn này phù hợp nhất cho: digital nomad đang tìm home base lý tưởng, chuyên gia nước ngoài cần không gian sống chất lượng, và bất kỳ ai đã mệt mỏi với sự nhộn nhạo và chỉ muốn về nhà thấy bình yên.</em></p>',
    en_close: '<p><em>Perfect for: digital nomads seeking an ideal long-term base, expat professionals needing quality living space, and anyone who has simply had enough of chaos and wants to come home to peace — and an ocean view.</em></p>'
  }),
  'RE-016': makeAptData('RE-016', 'Lux Panoma 2', 'Han River + Downtown Da Nang', 1150, 1, 1, 50, 'High Floor', {
    vi_hook: 'Sông Hàn và skyline trung tâm Đà Nẵng — cùng một lúc, từ cùng một cửa sổ. Góc nhìn được tính toán để tối đa hoá hai tầm nhìn quý giá nhất của Đà Nẵng cùng một lúc.',
    en_hook: 'Han River and Da Nang\'s downtown skyline — simultaneously, from the same window. A perspective calculated to maximise Da Nang\'s two most prized views at once.',
    vi_close: '<p><em>Xem vào lúc hoàng hôn để thấy khoảnh khắc mà view sông và view thành phố cùng lúc đẹp nhất trong ngày — đó là khoảnh khắc bạn sẽ quyết định ngay tại chỗ.</em></p>',
    en_close: '<p><em>Schedule a sunset viewing — the moment when river view and city skyline are simultaneously at their most beautiful is the moment you\'ll decide on the spot. $1,150/month — Panoma 2 dual-view, 1BR premium.</em></p>'
  }),
  'RE-017': makeAptData('RE-017', 'Lux Panoma 2', 'High-floor Sea View', 884, 1, 1, 50, 'Mid Floor', {
    vi_hook: 'Không phải ai cũng cần tầng cao nhất để có tầm nhìn đẹp nhất. Panoma 2, view biển, tầng trung — vẫn thấy đường chân trời biển rõ mồn một, tiết kiệm hơn so với penthouse, đủ cao để cảm nhận khoảng trời thoáng đãng.',
    en_hook: 'Not everyone needs the highest floor for a beautiful view. Panoma 2, ocean view, mid-floor — the Da Nang coastline still clearly visible, more accessible than penthouse pricing, and still elevated enough to feel that sense of open sky.',
    vi_close: '<p><em>$884/tháng — view biển thực sự tại Panoma 2. Đây là mức giá tốt nhất để bắt đầu trải nghiệm sống Panoma 2 với view biển. Thị trường tốt nhất thuộc về người quyết định nhanh.</em></p>',
    en_close: '<p><em>$884/month — genuine ocean views at Panoma 2. Same building, same amenities, same community — at the most accessible price point available. The best market opportunities belong to those who decide quickly.</em></p>'
  }),
};

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  const allData = { ...data, ...apartmentData };
  let updated = 0;

  for (const [code, d] of Object.entries(allData)) {
    const updatePayload = {};

    if (d.description) {
      updatePayload.description = {
        vi: d.description.vi.trim(),
        en: d.description.en.trim()
      };
    }
    if (d.keyInfo) updatePayload.keyInfo = d.keyInfo;
    if (d.nearby) updatePayload.nearby = d.nearby;

    const result = await db.collection('properties').updateOne(
      { code },
      { $set: updatePayload }
    );

    if (result.modifiedCount > 0) {
      console.log(`✓ Updated ${code}`);
      updated++;
    } else {
      console.log(`⚠ Not found: ${code}`);
    }
  }

  console.log(`\n✅ Done! ${updated}/${Object.keys(allData).length} properties enriched.`);
  await client.close();
}

run().catch(console.error);
