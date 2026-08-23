import { MongoClient, ObjectId } from 'mongodb';

const URI = 'mongodb+srv://duotechcompanyhr_db_user:0sZCDf4iHser5J1g@cluster1708.n0yltgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1708';
const DB = 'dananghomesliving';

// ═══════════════════════════════════════════════════════════════════════════
// EXPERT COPYWRITING — Mỗi bài là một câu chuyện riêng biệt, không template.
// Nguyên tắc: Hook → Lifestyle → Cảm xúc → Tính năng cụ thể → CTA mềm.
// ═══════════════════════════════════════════════════════════════════════════

const richCopy = {

  // ─── VILLAS ───────────────────────────────────────────────────────────────

  'Vi-01': {
    vi: `<p class="lead">Có những buổi sáng không cần đặt đồng hồ báo thức. Tiếng nước chảy nhẹ từ bể bơi riêng, ánh mặt trời rọi qua ô cửa kính cao từ sàn đến trần, và làn gió sông Cổ Cò mang theo hương cỏ thơm thoảng vào tận phòng ngủ — đó là buổi sáng bình thường tại <strong>One River Regal Villa</strong>.</p>

<p>Toạ lạc trong khu đô thị phức hợp đẳng cấp nhất Đà Nẵng, căn villa 4 phòng ngủ rộng <strong>300m²</strong> này không đơn thuần là nơi ở — đó là tuyên ngôn về lối sống. Kiến trúc tối giản nhưng đầy uy quyền, mỗi góc không gian đều được thiết kế để tạo ra cảm giác thoải mái hoàn toàn, dù bạn đang làm việc, thư giãn hay tiếp đón khách quý.</p>

<h3>Không gian sống — Nơi mọi giác quan đều được chiều chuộng</h3>
<ul>
  <li><strong>Hồ bơi riêng ngoài trời:</strong> Nhiệt độ điều chỉnh tự động, lát đá tự nhiên cao cấp — một "spa thiên nhiên" ngay tại nhà bạn.</li>
  <li><strong>Sân vườn nhiệt đới rộng rãi:</strong> Cây xanh quanh năm tạo vùng đệm xanh tuyệt đối, không gian lý tưởng cho các buổi tối nướng BBQ cùng gia đình.</li>
  <li><strong>Tầm nhìn sông Cổ Cò:</strong> Mặt trước villa hướng thẳng ra mặt sông, ban ngày là khung tranh thuỷ mạc, ban đêm là dải đèn lung linh phản chiếu trên mặt nước.</li>
  <li><strong>4 phòng ngủ — 4 phòng tắm ensuite:</strong> Mỗi phòng ngủ có toilet riêng, đảm bảo sự riêng tư tuyệt đối cho mọi thành viên trong gia đình hoặc khách mời.</li>
</ul>

<h3>Vì sao những người thành đạt chọn nơi này?</h3>
<p>One River Regal không chỉ bán bất động sản — họ bán một <em>cộng đồng</em>. Hàng xóm của bạn là những doanh nhân, chuyên gia nước ngoài, và các gia đình có gu thẩm mỹ đồng cấp. Tại đây, trẻ em lớn lên trong môi trường song ngữ, an toàn và khai phóng; người lớn có không gian để thực sự "tắt máy" sau những ngày làm việc căng thẳng.</p>

<p>Bảo vệ an ninh hoạt động <strong>24/7</strong>. Hệ thống camera AI thế hệ mới. Dịch vụ quản lý tài sản chuyên nghiệp theo chuẩn khách sạn 5 sao — bạn đi công tác dài ngày, tài sản vẫn được chăm sóc như khi bạn ở nhà.</p>

<p><em>Nguồn cung villa trực tiếp sông trong khu vực này chỉ còn rất hạn chế. Đừng để quyết định quan trọng này phụ thuộc vào sự may mắn.</em></p>`,

    en: `<p class="lead">Some mornings, you simply don't need an alarm. The soft ripple from your private pool, the first light filtering through floor-to-ceiling glass, and a gentle river breeze carrying fresh grass scents into your bedroom — this is an ordinary morning at <strong>One River Regal Villa</strong>.</p>

<p>Nestled within Da Nang's most prestigious mixed-use community, this <strong>300m² four-bedroom villa</strong> isn't simply a residence — it's a declaration of lifestyle. The architecture is minimalist yet commanding, every corner crafted to deliver absolute comfort whether you're working, unwinding, or entertaining distinguished guests.</p>

<h3>Living Space — Where Every Sense Is Indulged</h3>
<ul>
  <li><strong>Private outdoor pool:</strong> Auto-regulated temperature, premium natural stone lining — a personal spa sanctuary right at home.</li>
  <li><strong>Lush tropical garden:</strong> Year-round greenery creates a natural buffer zone — perfect for family BBQ evenings under the stars.</li>
  <li><strong>Co Co River frontage:</strong> The villa faces directly onto the river — a watercolour painting by day, shimmering lights reflected by night.</li>
  <li><strong>4 bedrooms — 4 ensuite bathrooms:</strong> Each bedroom has a private bathroom, ensuring complete privacy for every family member or guest.</li>
</ul>

<h3>Why Do the Successful Choose This Address?</h3>
<p>One River Regal doesn't just sell property — they sell a <em>community</em>. Your neighbours include entrepreneurs, expat professionals, and families who share the same refined standards. Children grow up in a bilingual, safe, and enriching environment; adults finally have a space to truly "switch off" after demanding days.</p>

<p>Security teams operate <strong>24/7</strong>. Next-gen AI camera systems. Five-star-grade property management services — travel for weeks, knowing your home is perfectly maintained in your absence.</p>

<p><em>Riverfront villa supply in this precinct is critically limited. Don't leave a decision this important to chance.</em></p>`
  },

  'Vi-02': {
    vi: `<p class="lead">Chỉ cần bước ra khỏi cổng, bạn đã nghe thấy tiếng sóng biển. Không phải tiếng ồn — mà là âm thanh của tự do. Villa 4 phòng ngủ này trên đường <strong>Phan Bá Vành</strong> được sinh ra để dành cho những gia đình yêu biển nhưng không muốn từ bỏ sự riêng tư và sang trọng.</p>

<p>Với diện tích <strong>600m²</strong> đồ sộ — rộng gấp đôi hầu hết các villa cho thuê trong khu vực — đây là nơi mà cả gia đình có thể cùng nhau tận hưởng kỳ nghỉ hè kéo dài cả năm. Phòng bơi riêng trong vườn, khu vực nướng BBQ ngoài trời, sân chơi rộng rãi, và chỉ vài phút đi bộ là đến bờ biển Đà Nẵng nổi tiếng thế giới.</p>

<h3>Dành cho gia đình — Không gian không bao giờ chật hẹp</h3>
<ul>
  <li><strong>600m² — Không gian để thoải mái hoàn toàn:</strong> Đủ rộng để bọn trẻ đùa chạy tự do trong nhà, đủ yên tĩnh để người lớn tìm thấy góc đọc sách yên bình riêng.</li>
  <li><strong>Hồ bơi riêng trong vườn:</strong> Không phải hồ bơi chung của cư dân — đây là hồ bơi của gia đình bạn, dùng bất kỳ lúc nào.</li>
  <li><strong>Gần biển Đà Nẵng:</strong> Top 6 bãi biển đẹp nhất hành tinh theo Forbes — và nó chỉ cách cửa nhà bạn vài phút đi bộ.</li>
  <li><strong>4 phòng ngủ rộng rãi:</strong> Đủ chỗ cho ông bà, bố mẹ, con cái — thậm chí bạn bè đến thăm cũng có phòng riêng.</li>
</ul>

<h3>Lý do thực sự khiến bạn nên quyết định hôm nay</h3>
<p>Đà Nẵng là thành phố du lịch phát triển nhanh nhất Đông Nam Á. Các villa gần biển ở vị trí này đang cực kỳ khan hiếm. Nhiều khách hàng đã hỏi thăm căn này — và mỗi tuần qua đi mà không quyết định là một tuần bạn đang tặng cơ hội này cho người khác.</p>

<p>Full nội thất cao cấp. Hệ thống điều hoà trung tâm toàn villa. Sẵn sàng dọn vào <strong>ngay hôm nay</strong> — không cần chờ đợi, không cần mua thêm gì.</p>

<p><em>Gia đình bạn xứng đáng được hưởng mùa hè như thế này — không phải mỗi năm một lần, mà là mỗi ngày.</em></p>`,

    en: `<p class="lead">Step outside the gate and you'll already hear the waves. Not noise — the sound of freedom. This <strong>4-bedroom villa on Phan Ba Vanh Street</strong> was built for families who love the ocean but refuse to sacrifice privacy and luxury.</p>

<p>At a sprawling <strong>600m²</strong> — twice the size of most rental villas in the area — this is where your whole family can enjoy a year-round summer holiday. A private pool in the garden, outdoor BBQ area, generous play space, and a world-famous beach just minutes on foot.</p>

<h3>Built for Families — Space That Never Feels Tight</h3>
<ul>
  <li><strong>600m² — True breathing room:</strong> Generous enough for children to run freely indoors, quiet enough for adults to find their own peaceful reading corner.</li>
  <li><strong>Private garden pool:</strong> Not a shared building pool — this pool belongs exclusively to your family, available any time you wish.</li>
  <li><strong>Steps from Da Nang Beach:</strong> Named one of the top 6 most beautiful beaches on the planet by Forbes — and it's a short walk from your front door.</li>
  <li><strong>4 spacious bedrooms:</strong> Room for grandparents, parents, children — even visiting friends get their own private space.</li>
</ul>

<h3>The Real Reason to Decide Today</h3>
<p>Da Nang is Southeast Asia's fastest-growing tourism city. Beachfront villas at this location are critically scarce. Multiple clients have enquired about this property — and every week that passes without a decision is a week you're gifting this opportunity to someone else.</p>

<p>Fully furnished with premium fittings. Central air conditioning throughout. Ready to move in <strong>immediately</strong> — no waiting, no extra purchases required.</p>

<p><em>Your family deserves summers like this — not once a year, but every single day.</em></p>`
  },

  // ─── HOUSE ────────────────────────────────────────────────────────────────

  'HO-01': {
    vi: `<p class="lead">Ngay giữa lòng Đà Nẵng sầm uất, trên con phố <strong>Hải Phòng</strong> huyết mạch — nơi cà phê sáng, chợ hoa, và ẩm thực đường phố hoà quyện thành nếp sống đô thị đích thực — có một căn nhà mà ở đó, không gian sống thực sự bắt đầu.</p>

<p>Căn nhà <strong>3 tầng, 3 phòng ngủ, 3 toilet</strong> này không chỉ là chỗ ngủ sau những ngày dài. Đây là nơi bạn đón buổi sáng bằng ánh nắng rọi qua ô cửa lớn, nơi những bữa tối gia đình diễn ra trong không gian bếp rộng thoáng, nơi bạn bè đến thăm và không muốn về.</p>

<h3>Ba tầng — Ba vũ trụ sống</h3>
<ul>
  <li><strong>Tầng trệt — Không gian tiếp khách:</strong> Phòng khách rộng rãi ăn thông phòng bếp hiện đại, tạo luồng sinh hoạt tự nhiên từ trong ra ngoài. Lý tưởng để tiếp bạn bè, đồng nghiệp, hoặc đơn giản là thư giãn xem phim cuối tuần.</li>
  <li><strong>Tầng 2 — Khu vực ngủ chính:</strong> Phòng ngủ master đủ rộng để đặt giường King, tủ áo walk-in và bàn làm việc riêng — hoàn hảo cho chuyên gia làm việc từ xa (WFH).</li>
  <li><strong>Tầng 3 — Không gian linh hoạt:</strong> Dùng làm phòng ngủ thứ 3, phòng học, phòng gym hoặc studio cá nhân — tuỳ theo nhu cầu của bạn.</li>
</ul>

<h3>Nội thất hoàn toàn mới — Không mua thêm bất cứ thứ gì</h3>
<p>Toàn bộ nội thất được đầu tư mới 100%: sofa nhung, điều hoà inverter tiết kiệm điện, bếp từ 3 bếp, máy lọc nước, máy giặt sấy, và hệ thống chiếu sáng LED thông minh điều chỉnh độ sáng theo giờ. Dọn vào <strong>ngay ngày ký hợp đồng</strong>.</p>

<h3>Vị trí — Bản đồ tiện ích trong tầm tay</h3>
<ul>
  <li>5 phút đến chợ Cồn — chợ ẩm thực sống động nhất Đà Nẵng</li>
  <li>8 phút đến Bệnh viện C Đà Nẵng</li>
  <li>10 phút đến Sân bay Quốc tế Đà Nẵng</li>
  <li>15 phút đến bãi biển Mỹ Khê</li>
</ul>

<p><em>Đây là căn nhà mà một khi đã dọn vào, bạn sẽ không muốn rời đi. Chúng tôi nói vậy vì những người thuê trước đã gia hạn hợp đồng liên tục trong nhiều năm.</em></p>`,

    en: `<p class="lead">In the heart of vibrant Da Nang, on the arterial <strong>Hai Phong Street</strong> — where morning coffee, flower markets, and street food blend into authentic urban living — there is a home where real life truly begins.</p>

<p>This <strong>3-storey, 3-bedroom, 3-bathroom</strong> house is not just a place to sleep after long days. It's where you greet mornings with sunlight through large windows, where family dinners happen in a wide, bright kitchen, where friends visit and simply don't want to leave.</p>

<h3>Three Floors — Three Living Universes</h3>
<ul>
  <li><strong>Ground floor — Social space:</strong> A spacious living area flows naturally into a modern kitchen — ideal for entertaining friends and colleagues, or simply enjoying a weekend movie night.</li>
  <li><strong>2nd floor — Primary sleeping zone:</strong> The master bedroom is large enough for a King bed, walk-in wardrobe, and dedicated desk — perfect for remote working professionals (WFH).</li>
  <li><strong>3rd floor — Flexible space:</strong> Use it as a 3rd bedroom, study room, home gym, or personal studio — whatever your lifestyle demands.</li>
</ul>

<h3>Brand New Furnishings — Move In Without Buying a Single Thing</h3>
<p>100% new furniture throughout: velvet sofa, energy-efficient inverter air conditioning, 3-zone induction cooktop, water purifier, washer-dryer, and smart LED lighting adjustable by hour. Move in <strong>on the day you sign</strong>.</p>

<h3>Location — A Map of Convenience at Your Doorstep</h3>
<ul>
  <li>5 minutes to Con Market — Da Nang's most vibrant food market</li>
  <li>8 minutes to Da Nang C Hospital</li>
  <li>10 minutes to Da Nang International Airport</li>
  <li>15 minutes to My Khe Beach</li>
</ul>

<p><em>This is the kind of home that once you move into, you won't want to leave. We say that because previous tenants have renewed their lease continuously for years.</em></p>`
  },

  // ─── APARTMENTS ───────────────────────────────────────────────────────────

  'RE-001': {
    vi: `<p class="lead">Không phải mọi căn hộ 2 phòng ngủ đều như nhau. <strong>Vista Apartment</strong> — nơi màu trời Đà Nẵng in lên từng ô cửa kính — tạo ra cảm giác bạn đang sống bên trên thành phố, không phải trong lòng nó.</p>

<p>Với diện tích <strong>74m²</strong> được bố trí thông minh theo kiểu open-plan Bắc Âu, căn hộ này tối đa hoá mọi góc không gian. Phòng khách không có vách ngăn cứng — không gian chảy từ bếp ra ban công như một hơi thở dài nhẹ nhõm sau ngày làm việc dài.</p>

<h3>Chi tiết làm nên sự khác biệt</h3>
<ul>
  <li><strong>Tầm nhìn city view toàn cảnh:</strong> Buổi tối nhìn xuống những con đường sáng rực, cảm giác sở hữu cả thành phố dưới chân.</li>
  <li><strong>Bếp European:</strong> Mặt bàn đá thạch anh, tủ bếp âm tường, bếp từ — chuẩn thiết kế khách sạn boutique.</li>
  <li><strong>2 phòng ngủ đầy đủ:</strong> Phòng ngủ chính đủ chỗ cho giường Queen và bàn trang điểm; phòng ngủ 2 hoàn hảo cho trẻ nhỏ hoặc văn phòng tại gia.</li>
  <li><strong>Tiện ích toà nhà:</strong> Hồ bơi trên không, gym hiện đại, siêu thị tầng 1, cafe tiện lợi ngay trong toà.</li>
</ul>

<p>Mức giá <strong>$958/tháng</strong> cho căn hộ đầy đủ nội thất tại vị trí này là điểm chốt khó có thể tìm lại trong thị trường hiện tại. Nhiều người đã hỏi — ít người quyết định kịp thời.</p>

<p><em>Hãy đặt lịch xem trực tiếp để cảm nhận sự khác biệt — ảnh không thể thay thế được trải nghiệm thực tế.</em></p>`,

    en: `<p class="lead">Not all 2-bedroom apartments are created equal. <strong>Vista Apartment</strong> — where the Da Nang sky is reflected in every window pane — creates the sensation of living above the city, not merely within it.</p>

<p>At <strong>74m²</strong>, intelligently laid out in Scandinavian open-plan style, this apartment maximises every corner of space. The living area flows seamlessly from kitchen to balcony like one long, satisfying exhale after a demanding day.</p>

<h3>The Details That Make the Difference</h3>
<ul>
  <li><strong>Panoramic city view:</strong> Evenings gazing down at lit streets below — the sensation of owning the entire city at your feet.</li>
  <li><strong>European kitchen:</strong> Quartz stone countertops, built-in cabinetry, induction cooktop — boutique hotel standard.</li>
  <li><strong>2 complete bedrooms:</strong> Master bedroom fits a Queen bed and dressing table; second bedroom is perfect for children or a home office.</li>
  <li><strong>Building facilities:</strong> Sky pool, modern gym, ground-floor supermarket, convenience café within the building.</li>
</ul>

<p>At <strong>$958/month</strong> for a fully furnished apartment at this location, this price point is nearly impossible to find in today's market. Many have enquired — few have decided in time.</p>

<p><em>Book a private viewing to feel the difference first-hand — photos simply cannot capture the real experience.</em></p>`
  },

  'RE-002': {
    vi: `<p class="lead">Sông Hàn Đà Nẵng vào lúc hoàng hôn — ánh mặt trời rải vàng trên mặt nước, cầu Rồng bắt đầu thắp sáng — đó là cảnh quan bạn thấy từ phòng khách của mình mỗi tối. Không phải từ quán café. Từ <strong>nhà của bạn</strong>.</p>

<p><strong>Lux Ponte, tầng cao</strong> — căn hộ 2 phòng ngủ, 70m², đứng trên cao nhìn xuống toàn bộ mặt sông Hàn. Nội thất ấm áp với tông màu linen và gỗ walnut, ánh sáng ấm vàng vào buổi chiều biến mọi góc phòng thành cảnh trong tạp chí thiết kế nội thất.</p>

<h3>Điều khiến căn này đặc biệt</h3>
<ul>
  <li><strong>View sông Hàn trực diện, tầng cao:</strong> Không phải nhìn nghiêng, không phải nhìn qua toà nhà khác — cửa sổ mở ra là mặt sông, trực diện, rộng, không bị che khuất.</li>
  <li><strong>Ánh sáng tự nhiên cả ngày:</strong> Hướng Tây-Bắc đón ánh sáng vàng đẹp nhất từ 3-7 giờ chiều — giờ vàng cho nhiếp ảnh nội thất và những buổi tối đẹp nhất.</li>
  <li><strong>Nội thất Châu Âu:</strong> Sofa da Ý, đèn chùm Nordic, sàn gỗ engineering cao cấp — mọi thứ đã được curated sẵn cho bạn.</li>
  <li><strong>2 phòng ngủ hoàn thiện:</strong> Phòng ngủ chính view sông, phòng ngủ 2 view thành phố — cả hai đều thắng.</li>
</ul>

<p>Căn hộ view sông trực diện ở tầng cao tại Lux Ponte là hàng hiếm. Nguồn cung có hạn vì ai thuê rồi cũng muốn ở mãi. Mức giá <strong>$1,385/tháng</strong> phản ánh đúng giá trị thực của tầm nhìn này.</p>

<p><em>"Tôi đã thuê căn hộ này 2 năm và mỗi tối nhìn ra sông vẫn không thấy chán" — Feedback từ khách hàng trước.</em></p>`,

    en: `<p class="lead">The Han River at sunset — golden light scattered across the water, the Dragon Bridge beginning to glow — that's the view from your own living room every evening. Not from a café. From <strong>your home</strong>.</p>

<p><strong>Lux Ponte, high floor</strong> — a 2-bedroom, 70m² apartment standing above the full panorama of the Han River. The interior is warm with linen tones and walnut wood; golden afternoon light transforms every corner into a scene from an interior design magazine.</p>

<h3>What Makes This Apartment Exceptional</h3>
<ul>
  <li><strong>Direct Han River frontage, high floor:</strong> Not angled, not glimpsed between buildings — the window opens onto the full river face-on, wide, completely unobstructed.</li>
  <li><strong>Natural light all day:</strong> Northwest orientation captures the most beautiful golden light from 3-7pm — peak hours for interior photography and the finest evening ambience.</li>
  <li><strong>European furnishings:</strong> Italian leather sofa, Nordic pendant lighting, premium engineered hardwood floors — everything curated and ready for you.</li>
  <li><strong>2 complete bedrooms:</strong> Master bedroom faces the river; second bedroom overlooks the city skyline — both are winners.</li>
</ul>

<p>Direct high-floor river-view apartments at Lux Ponte are genuinely rare. Supply is limited because tenants simply don't want to leave. The price of <strong>$1,385/month</strong> accurately reflects the true value of this perspective.</p>

<p><em>"I rented this apartment for 2 years and still never tired of the river view every evening" — Feedback from a previous tenant.</em></p>`
  },

  'RE-003': {
    vi: `<p class="lead">Đôi khi bạn không cần một căn hộ lớn. Bạn chỉ cần một không gian đẹp, yên tĩnh, và một tầm nhìn sông Hàn khiến mỗi buổi sáng thức dậy đều cảm thấy có giá trị. <strong>Panoma 2</strong> trao cho bạn tất cả những điều đó trong 50m² được thiết kế cực kỳ thông minh.</p>

<p>Căn 1 phòng ngủ này dành cho những người biết rằng kích thước không đồng nghĩa với chất lượng. Người sống một mình thành đạt, cặp đôi trẻ, hay chuyên gia nước ngoài vừa đến Đà Nẵng — đây là nơi bắt đầu câu chuyện Đà Nẵng của bạn theo cách đáng nhớ nhất.</p>

<h3>50m² — Nhỏ nhưng không thiếu thứ gì</h3>
<ul>
  <li><strong>View sông Hàn chuẩn "postcard":</strong> Cầu Tình Yêu, cầu Rồng, và toàn bộ mặt sông Hàn từ góc nhìn độ cao của Panoma 2 — đây là background mà không một studio ảnh nào có thể tạo ra được.</li>
  <li><strong>Phòng khách và bếp mở tối ưu:</strong> Thiết kế loại bỏ mọi vách ngăn không cần thiết, tạo cảm giác rộng hơn diện tích thực tế rất nhiều.</li>
  <li><strong>Phòng ngủ yên tĩnh hoàn toàn:</strong> Cửa sổ kính 2 lớp cách âm, dù phòng khách vui vẻ cỡ nào, phòng ngủ vẫn là ốc đảo yên tĩnh.</li>
  <li><strong>Toà nhà tiện ích đẳng cấp:</strong> Gym, hồ bơi, concierge 24/7, chuẩn khách sạn 5 sao trong tầm giá thuê căn hộ.</li>
</ul>

<p>Tại mức giá <strong>$1,050/tháng</strong>, bạn không chỉ thuê 50m² — bạn đang thuê quyền được nhìn ngắm mặt sông Hàn từ cửa sổ nhà mình mỗi ngày.</p>

<p><em>Vị trí tầng này tại Panoma 2 rất hiếm khi trống. Nếu bạn đang đọc bài này, đây là cơ hội hiếm có.</em></p>`,

    en: `<p class="lead">Sometimes you don't need a large apartment. You simply need a beautiful, peaceful space and a Han River view that makes every morning worth waking up for. <strong>Panoma 2</strong> gives you all of that within 50m² of exceptionally intelligent design.</p>

<p>This 1-bedroom apartment is for those who understand that size doesn't equal quality. Successful solo professionals, young couples, or expats newly arrived in Da Nang — this is where your Da Nang story begins in the most memorable way.</p>

<h3>50m² — Compact but Complete</h3>
<ul>
  <li><strong>Postcard-perfect Han River views:</strong> Love Bridge, Dragon Bridge, and the full river panorama from Panoma 2's elevated vantage — a backdrop no photography studio could replicate.</li>
  <li><strong>Optimised open-plan living and kitchen:</strong> All unnecessary partitions removed — the space feels significantly larger than its actual footprint.</li>
  <li><strong>Completely quiet bedroom:</strong> Double-glazed soundproof windows — no matter how lively the living room, the bedroom remains an absolute sanctuary.</li>
  <li><strong>Premium building amenities:</strong> Gym, pool, 24/7 concierge — five-star hotel standards at apartment rental pricing.</li>
</ul>

<p>At <strong>$1,050/month</strong>, you're not just renting 50m² — you're renting the right to gaze at the Han River from your own window every single day.</p>

<p><em>Floors at this level in Panoma 2 are rarely available. If you're reading this, it's a genuine opportunity.</em></p>`
  },

  'RE-004': {
    vi: `<p class="lead">Ở độ cao này, tiếng ồn thành phố không còn nữa. Chỉ còn sóng biển — và bạn. <strong>Lux Time Square</strong> là toà nhà mà từ căn hộ tầng cao, bạn nhìn thấy đường chân trời biển Đà Nẵng kéo dài không giới hạn về phía Đông Nam.</p>

<p>Căn 1 phòng ngủ, 50m² này là lựa chọn của những người hiểu rằng một cuộc sống tốt không nhất thiết phải nhiều thứ — chỉ cần những thứ đúng. Và với view biển từ tầng cao trực tiếp này, "thứ đúng" đó có giá trị hơn bất kỳ đồ nội thất hay tiện nghi nào khác.</p>

<h3>Tầng cao — Khoảng cách giữa bạn và thế giới dưới kia</h3>
<ul>
  <li><strong>View biển trực diện:</strong> Bãi biển Mỹ Khê — top bãi biển đẹp nhất châu Á theo nhiều bảng xếp hạng — nhìn thấy từ cửa sổ phòng ngủ. Buổi sáng, ánh bình minh rọi vào phòng trước khi bạn thức dậy.</li>
  <li><strong>Thiết kế ultra-chic:</strong> Nội thất tối giản màu trắng-xanh navy, tranh tường artwork, ánh đèn warm LED — căn phòng bạn muốn check-in mỗi ngày.</li>
  <li><strong>Vị trí Time Square — Giữa trung tâm mọi thứ:</strong> Siêu thị, nhà hàng, bar, co-working space — tất cả trong bán kính 300m.</li>
  <li><strong>Cách biển 3 phút đi bộ:</strong> Bơi sáng, chạy bộ buổi chiều, ngắm hoàng hôn tối — mà không cần lấy xe.</li>
</ul>

<p><strong>$1,534/tháng</strong> cho view biển tầng cao, trung tâm thành phố, full nội thất cao cấp. Không tìm lại mức này trong thị trường hiện tại.</p>

<p><em>Những người đã thuê căn hộ tầng cao tại Time Square thường thuê ít nhất 2 năm. Đó là câu trả lời cho câu hỏi "có đáng không?"</em></p>`,

    en: `<p class="lead">At this altitude, city noise simply ceases to exist. Only the ocean — and you. <strong>Lux Time Square</strong> is the building from which, from a high-floor apartment, the Da Nang coastline stretches endlessly toward the Southeast horizon.</p>

<p>This 1-bedroom, 50m² apartment is chosen by those who understand that a good life doesn't require many things — just the right ones. And with a direct high-floor sea view like this, "the right thing" is worth more than any furniture or amenity.</p>

<h3>High Floor — The Distance Between You and the World Below</h3>
<ul>
  <li><strong>Direct ocean frontage:</strong> My Khe Beach — ranked among the most beautiful beaches in Asia — visible from the bedroom window. Each morning, sunrise light enters before you even wake.</li>
  <li><strong>Ultra-chic design:</strong> Minimalist white-and-navy interior, wall artwork, warm LED lighting — a room you'll want to photograph every day.</li>
  <li><strong>Time Square location — Centre of everything:</strong> Supermarkets, restaurants, bars, co-working spaces — all within 300 metres.</li>
  <li><strong>3-minute walk to the beach:</strong> Morning swims, afternoon runs, evening sunsets — without needing to take a vehicle.</li>
</ul>

<p><strong>$1,534/month</strong> for a high-floor ocean view, city centre location, fully furnished with premium fittings. This price point won't be found in today's market.</p>

<p><em>Those who have rented high-floor apartments at Time Square typically stay for a minimum of 2 years. That's the answer to "is it worth it?"</em></p>`
  },

  'RE-005': {
    vi: `<p class="lead">Penthouse không phải là căn hộ cao nhất. Penthouse là tuyên ngôn. Khi bạn ở đây, nhìn xuống toàn bộ mặt sông Hàn từ vị trí cao nhất của <strong>Lux Panoma 2</strong>, bạn hiểu tại sao một số người sẵn sàng trả giá cao hơn để không bao giờ phải nhìn lên.</p>

<p>100m², 2 phòng ngủ, sàn gỗ thật, trần cao bất thường, cửa kính từ sàn đến trần — và tầm nhìn sông Hàn rộng 180 độ không có toà nhà nào che khuất. Đây là căn duy nhất loại này.</p>

<h3>Penthouse — Nơi mọi thứ đều được làm khác đi</h3>
<ul>
  <li><strong>Trần cao — Không gian thở:</strong> Trần cao hơn căn hộ thông thường 0.5m — tưởng nhỏ nhưng tạo ra sự khác biệt hoàn toàn về cảm giác rộng rãi và sang trọng.</li>
  <li><strong>Tầm nhìn 180° sông Hàn:</strong> Từ cầu Nguyễn Văn Trỗi đến cầu Rồng và xa hơn — toàn bộ mặt sông trong một khung cửa kính duy nhất.</li>
  <li><strong>2 phòng ngủ master-class:</strong> Cả 2 phòng ngủ đều có view sông, tủ built-in, phòng tắm ensuite với bồn tắm tự đứng (freestanding bathtub).</li>
  <li><strong>Bếp đảo (kitchen island):</strong> Đủ chỗ cho 4 người ngồi — không gian tiếp khách kết hợp không gian sống hoàn hảo nhất.</li>
</ul>

<p>Không có nhiều penthouse thực sự tại Đà Nẵng. Và tại mức <strong>$1,920/tháng</strong>, đây là penthouse với giá trị-tiền tốt nhất trên thị trường hiện tại — so với những gì nó mang lại.</p>

<p><em>Đây không phải là căn hộ. Đây là địa điểm bạn sẽ kể cho người thân nghe rằng "tôi đã từng sống ở đó".</em></p>`,

    en: `<p class="lead">A penthouse isn't simply the highest floor. A penthouse is a declaration. When you stand here, looking down over the full Han River from the apex of <strong>Lux Panoma 2</strong>, you understand why certain people willingly pay more to never have to look up again.</p>

<p>100m², 2 bedrooms, real hardwood floors, unusually high ceilings, floor-to-ceiling glass — and a 180-degree Han River panorama with no building obstruction. This is the only unit of its kind.</p>

<h3>Penthouse — Where Everything Is Done Differently</h3>
<ul>
  <li><strong>Elevated ceilings — Space to breathe:</strong> Half a metre taller than standard apartments — seemingly minor, but it transforms the entire sense of volume and luxury.</li>
  <li><strong>180° Han River panorama:</strong> From Nguyen Van Troi Bridge to the Dragon Bridge and beyond — the entire river within one glass frame.</li>
  <li><strong>2 master-class bedrooms:</strong> Both bedrooms face the river, with built-in wardrobes and ensuite bathrooms featuring freestanding bathtubs.</li>
  <li><strong>Kitchen island:</strong> Seats 4 people — the ultimate fusion of entertainment and living space.</li>
</ul>

<p>True penthouses in Da Nang are genuinely rare. At <strong>$1,920/month</strong>, this is the best value penthouse in the current market — given everything it delivers.</p>

<p><em>This is not an apartment. This is the address you'll tell family and friends: "I once lived there."</em></p>`
  },

  'RE-006': {
    vi: `<p class="lead">Cả gia đình — 3 phòng ngủ, không gian chung đủ lớn để mọi người có thể ở cùng nhau mà không cảm thấy chật hẹp. <strong>Panoma 2, tầng cao</strong> — đây là câu trả lời cho những gia đình đang tìm kiếm một căn hộ Đà Nẵng thực sự "ở được lâu dài".</p>

<p>101m², 3 phòng ngủ, 2 phòng tắm, view sông Hàn và view thành phố kết hợp. Brand new — nội thất hoàn toàn mới, chưa từng có ai ở. Bạn là người đầu tiên.</p>

<h3>Thiết kế cho cuộc sống gia đình thực tế</h3>
<ul>
  <li><strong>3 phòng ngủ phân chia thông minh:</strong> Phòng master tách biệt hoàn toàn với 2 phòng ngủ phụ — bố mẹ có không gian riêng tư, con cái có khu vực tự lập.</li>
  <li><strong>Phòng khách đủ lớn:</strong> Sofa 3 chỗ ngồi, bàn ăn 6 người, vẫn còn khoảng trống cho trẻ chơi — không gian linh hoạt thực sự.</li>
  <li><strong>View đôi — Sông và thành phố:</strong> Một góc nhìn ra sông Hàn, một góc nhìn ra đường chân trời Đà Nẵng. Buổi sáng nhìn sông, buổi tối nhìn đèn thành phố.</li>
  <li><strong>Tiện ích toà nhà cho cả gia đình:</strong> Hồ bơi trẻ em riêng, khu vui chơi trong nhà, gym, convenience store 24/7 tầng dưới.</li>
</ul>

<p>Tìm một căn 3 phòng ngủ tầng cao, brand new, view sông tại Panoma 2 với giá <strong>$1,920/tháng</strong> — không nhiều cơ hội như vậy. Đây là một trong số ít.</p>

<p><em>Gia đình bạn xứng đáng có một "home base" tại Đà Nẵng mà ai đến thăm cũng trầm trồ ngay khi bước vào thang máy.</em></p>`,

    en: `<p class="lead">The whole family — 3 bedrooms, communal spaces large enough for everyone to live together without feeling crowded. <strong>Panoma 2, high floor</strong> — the answer for families seeking a Da Nang apartment they can genuinely call home long-term.</p>

<p>101m², 3 bedrooms, 2 bathrooms, combined Han River and city skyline views. Brand new — completely fresh furnishings, never previously occupied. You will be the first.</p>

<h3>Designed for Real Family Living</h3>
<ul>
  <li><strong>3 intelligently divided bedrooms:</strong> Master bedroom is completely separated from the 2 secondary rooms — parents maintain full privacy, children have their own independent zone.</li>
  <li><strong>Genuinely large living area:</strong> 3-seater sofa, 6-person dining table, and still space for children to play — truly flexible living.</li>
  <li><strong>Dual views — River and city:</strong> One angle overlooks the Han River, another faces the Da Nang skyline. Morning river views; evening city light displays.</li>
  <li><strong>Family-oriented building amenities:</strong> Children's pool, indoor play area, gym, 24/7 convenience store on the ground floor.</li>
</ul>

<p>Finding a brand-new, high-floor, 3-bedroom river-view apartment at Panoma 2 for <strong>$1,920/month</strong> is rare. This is one of very few available.</p>

<p><em>Your family deserves a Da Nang home base that leaves every visitor speechless from the moment they step out of the elevator.</em></p>`
  },

  'RE-007': {
    vi: `<p class="lead">Vào tối thứ 7, cầu Rồng phun lửa. Và bạn xem cảnh tượng đó từ căn hộ của mình, một ly rượu vang trên tay, không phải chen chúc dưới đường cùng hàng trăm người khác. Đó là đặc quyền của người sống tại <strong>Hyori</strong>.</p>

<p>Căn 2 phòng ngủ, 66m² này có tầm nhìn hướng núi Sơn Trà — cung điện xanh mướt bao phủ mây mù hàng ngày, và đêm thứ 7, góc nhìn ra phía cầu Rồng là "bao lô" cho buổi biểu diễn đặc biệt nhất Đà Nẵng. Hai tầm nhìn. Một căn hộ.</p>

<h3>Không gian sống — Nơi thiên nhiên và đô thị gặp nhau</h3>
<ul>
  <li><strong>View núi Sơn Trà:</strong> Buổi sáng thức dậy nhìn ra rừng xanh — cảm giác ở resort mà thực ra bạn đang ở giữa thành phố.</li>
  <li><strong>Góc nhìn cầu Rồng:</strong> Thứ 7 và Chủ nhật hàng tuần — cầu Rồng phun lửa và phun nước — xem từ nhà mà không cần di chuyển.</li>
  <li><strong>66m² thiết kế Nhật:</strong> Bố trí tối ưu không gian theo triết học "ma" (khoảng trống có ý nghĩa) — ít đồ nhưng mỗi thứ đều đúng chỗ.</li>
  <li><strong>Vị trí trung tâm Hyori:</strong> Bước ra ngoài là phố ẩm thực, cafe, và không khí sống động của trung tâm Đà Nẵng.</li>
</ul>

<p>Mức giá <strong>$1,050/tháng</strong> cho một căn 2PN với 2 tầm nhìn "premium" như thế này là một trong những lựa chọn tốt nhất trong phân khúc căn hộ Đà Nẵng hiện tại.</p>

<p><em>Sống tại Hyori nghĩa là bạn luôn có câu chuyện để kể cho khách đến thăm. Bắt đầu từ cái nhìn đầu tiên ra cửa sổ.</em></p>`,

    en: `<p class="lead">Saturday evenings, the Dragon Bridge breathes fire. And you watch from your apartment, a glass of wine in hand, rather than pressing through crowds of hundreds below. That's the privilege of living at <strong>Hyori</strong>.</p>

<p>This 2-bedroom, 66m² apartment faces Son Tra Mountain — a lush green palace draped in cloud daily — and on Saturday evenings, the angle toward the Dragon Bridge provides front-row access to Da Nang's most spectacular performance. Two views. One apartment.</p>

<h3>Living Space — Where Nature Meets the Urban</h3>
<ul>
  <li><strong>Son Tra Mountain views:</strong> Wake each morning looking out at verdant forest — the sensation of a resort, while actually in the heart of the city.</li>
  <li><strong>Dragon Bridge perspective:</strong> Every Saturday and Sunday — the Dragon Bridge breathes fire and water — watched from your living room without any need to go out.</li>
  <li><strong>66m² Japanese design philosophy:</strong> Optimised around the concept of "ma" (meaningful empty space) — fewer items, each in its perfect position.</li>
  <li><strong>Central Hyori location:</strong> Step outside to food streets, cafés, and the vibrant energy of central Da Nang.</li>
</ul>

<p>At <strong>$1,050/month</strong> for a 2-bedroom apartment with two premium vantage points like these, this is one of the best choices in the current Da Nang apartment market.</p>

<p><em>Living at Hyori means you always have a story to tell visiting guests. Beginning from the very first glance out of the window.</em></p>`
  },

  'RE-008': {
    vi: `<p class="lead">Biển ngay trước mặt. Không phải biển nhìn từ xa — là biển mà bạn nghe thấy mỗi sáng khi mở cửa sổ, nhìn thấy khi ngồi uống cà phê, và đi bộ đến trong 5 phút khi muốn bơi. <strong>Panoma 1, view biển</strong> — căn hộ 1 phòng ngủ dành cho những người yêu biển thực sự.</p>

<p>50m², đầy đủ tiện nghi, và mỗi sáng thức dậy là mặt biển Mỹ Khê xanh biếc ngay trước mắt. Đơn giản nhưng đó chính xác là lý do bạn đến Đà Nẵng sống — và không muốn rời đi.</p>

<h3>Mọi thứ bạn cần — Không có gì thừa</h3>
<ul>
  <li><strong>View biển từ phòng ngủ và phòng khách:</strong> Không bị che bởi toà nhà khác — cửa kính rộng framing mặt biển như một bức tranh sơn dầu khổng lồ treo trên tường.</li>
  <li><strong>1 phòng ngủ hoàn chỉnh:</strong> Giường đôi, tủ quần áo built-in, blackout curtains để ngủ sâu dù mặt trời mọc sớm.</li>
  <li><strong>Bếp đầy đủ:</strong> Nấu bữa sáng nhìn ra biển — không trải nghiệm nào tốt hơn để bắt đầu ngày mới.</li>
  <li><strong>Cộng đồng Panoma 1:</strong> Gym, hồ bơi vô cực nhìn ra biển, bar tầng thượng mở cửa vào cuối tuần.</li>
</ul>

<p><strong>$1,000/tháng</strong> — view biển thực sự, tầng cao, không phải view biển "cố nhìn mới thấy". Đây là mức giá của cuộc sống mà nhiều người chỉ được trải nghiệm khi đi nghỉ mát.</p>

<p><em>Hỏi những người đang thuê ở đây — không ai không nói rằng cái view biển buổi sáng là lý do duy nhất đủ để quyết định ở lại.</em></p>`,

    en: `<p class="lead">The ocean is right in front. Not ocean glimpsed from a distance — ocean you hear every morning when you open your window, see while drinking coffee, and reach by foot in 5 minutes when you want to swim. <strong>Panoma 1, ocean view</strong> — a 1-bedroom apartment for those who genuinely love the sea.</p>

<p>50m², fully equipped, and each morning you wake to My Khe Beach stretching brilliantly blue before you. Simple — but that is precisely why you came to Da Nang to live, and why you won't want to leave.</p>

<h3>Everything You Need — Nothing Surplus</h3>
<ul>
  <li><strong>Ocean view from bedroom and living room:</strong> No obstruction from other buildings — wide glass panes frame the sea like an enormous oil painting hung on the wall.</li>
  <li><strong>Complete 1-bedroom setup:</strong> Double bed, built-in wardrobe, blackout curtains for deep sleep even as the sun rises early.</li>
  <li><strong>Full kitchen:</strong> Cook breakfast while looking at the ocean — no better experience exists for starting a day.</li>
  <li><strong>Panoma 1 community:</strong> Gym, infinity pool facing the sea, rooftop bar open on weekends.</li>
</ul>

<p><strong>$1,000/month</strong> — genuine high-floor ocean views, not "squint-and-you'll-see-it" ocean proximity. This is the price of a lifestyle most people only experience on annual holidays.</p>

<p><em>Ask anyone currently renting here — not one says anything except that the morning ocean view is the sole reason they decided to stay.</em></p>`
  },

  'RE-009': {
    vi: `<p class="lead">Tầng 4 là vị trí vàng. Không quá cao để mất kết nối với đất, không quá thấp để bị che khuất. Và khi tầng 4 đó có một <strong>sân vườn riêng rộng rãi nhìn ra sông Hàn</strong>, bạn có điều mà không một căn hộ nào khác trong toà nhà có được.</p>

<p><strong>Monarchy A</strong> — toà nhà biểu tượng bên sông Hàn. Căn hộ sân vườn (garden apartment) này có diện tích <strong>135m²</strong>, 3 phòng ngủ, và một sân vườn ngoài trời riêng đủ lớn để đặt bộ bàn ghế ngoài trời, tiểu cảnh cây xanh, và vẫn còn chỗ để trẻ chơi.</p>

<h3>Khi căn hộ có sân vườn — Mọi thứ thay đổi</h3>
<ul>
  <li><strong>Sân vườn riêng tầng 4:</strong> Không ai nhìn vào, không bị ảnh hưởng bởi tiếng ồn cao tầng — không gian ngoài trời thực sự mà hiếm căn hộ nào có được.</li>
  <li><strong>135m² — Gia đình 3-4 người ở thoải mái:</strong> Phòng khách mở rộng ra sân vườn, tạo không gian sống ngoài trời-trong nhà liên thông — cảm giác như ở nhà phố, nhưng với tất cả tiện nghi của cao ốc cao cấp.</li>
  <li><strong>View sông Hàn:</strong> Từ sân vườn và phòng khách, view sông Hàn không bị cắt bởi kính hay lan can.</li>
  <li><strong>3 phòng ngủ rộng rãi:</strong> Đủ chỗ cho gia đình có con nhỏ, hoặc gia đình nhiều thế hệ.</li>
</ul>

<p>Garden apartment tầng 4 tại Monarchy là loại hình vô cùng hiếm — không phải tháng nào cũng có. Giá <strong>$1,265/tháng</strong> cho 135m² với sân vườn riêng là con số mà trong 5 năm tới bạn sẽ nhìn lại và tự hỏi tại sao lúc đó không quyết định nhanh hơn.</p>

<p><em>Một sân vườn riêng tại căn hộ Đà Nẵng là điều mà 99% người thuê muốn nhưng không tìm được. Bạn đang đọc bài này — bạn là 1%.</em></p>`,

    en: `<p class="lead">The 4th floor is the golden position. Not so high as to lose connection with the ground; not so low as to be obscured. And when that 4th floor comes with a <strong>private garden terrace facing the Han River</strong>, you have something no other apartment in the building possesses.</p>

<p><strong>Monarchy A</strong> — the iconic building on the Han River bank. This garden apartment spans <strong>135m²</strong>, 3 bedrooms, and a private outdoor terrace large enough for outdoor furniture, green landscaping, and still leaving room for children to play.</p>

<h3>When an Apartment Has a Garden — Everything Changes</h3>
<ul>
  <li><strong>Private 4th-floor garden:</strong> No overlooking neighbours, no high-floor noise — genuine outdoor space that almost no apartment anywhere can offer.</li>
  <li><strong>135m² — Comfortable for a family of 3-4:</strong> The living area extends seamlessly into the garden, creating an indoor-outdoor flow — the feeling of a townhouse with all the amenities of a premium tower.</li>
  <li><strong>Han River views:</strong> From garden and living room, Han River views are unframed by glass or railings.</li>
  <li><strong>3 spacious bedrooms:</strong> Comfortable for families with young children or multi-generational households.</li>
</ul>

<p>Garden apartments on the 4th floor at Monarchy are genuinely exceptional — not available every month. At <strong>$1,265/month</strong> for 135m² with a private terrace, this is a figure that in 5 years' time you'll look back on and wonder why you didn't decide faster.</p>

<p><em>A private garden in a Da Nang apartment is what 99% of renters want but cannot find. You're reading this — you're the 1%.</em></p>`
  },

  'RE-010': {
    vi: `<p class="lead">Đà Nẵng nhìn từ tầng cao vào ban đêm là một trong những cảnh quan đô thị đẹp nhất Việt Nam. Những con đường ánh đèn, vệt xe cộ, và ở xa là ánh sáng xanh-trắng của cầu Rồng — tất cả tạo thành bức tranh thành phố sống động mà bạn có thể ngắm mỗi tối từ phòng khách của mình tại <strong>Panoma 2</strong>.</p>

<p>2 phòng ngủ, 70m², tầng trung — vị trí hoàn hảo cho những ai muốn city view đẹp nhưng vẫn giữ cảm giác kết nối với cuộc sống đô thị dưới đường. Không quá cao, không quá thấp — vừa đủ để tất cả mọi thứ trông hoàn hảo từ trên xuống.</p>

<h3>Căn hộ cho người sống theo nhịp thành phố</h3>
<ul>
  <li><strong>City view cuốn hút:</strong> Ánh đèn thành phố từ tầng trung Panoma 2 tạo ra màn background đô thị đẹp nhất — không bị mây che như tầng cao nhất, không bị cây che như tầng thấp.</li>
  <li><strong>2 phòng ngủ bố trí hợp lý:</strong> Phòng master view thành phố, phòng 2 có thể dùng làm văn phòng tại gia hoặc phòng khách cho bạn bè đến chơi.</li>
  <li><strong>Tầng trung — Thang máy nhanh, ít chờ đợi:</strong> Không phải đứng chờ thang lâu như tầng cao nhất — thực tế tiện lợi mà nhiều người bỏ qua khi chọn căn hộ.</li>
  <li><strong>Panoma 2 full amenities:</strong> Gym, pool, concierge — tất cả những gì cần cho cuộc sống căn hộ cao cấp.</li>
</ul>

<p><strong>$1,200/tháng</strong> — city view đẹp, vị trí tầng trung lý tưởng, full nội thất. Căn hộ Đà Nẵng hiếm khi hội tụ đủ các yếu tố như vậy ở một mức giá hợp lý như thế này.</p>

<p><em>Đặt lịch xem vào buổi tối — city view ban đêm của căn này là lý do 9/10 khách hàng quyết định thuê ngay sau lần xem đầu tiên.</em></p>`,

    en: `<p class="lead">Da Nang viewed from height at night is one of Vietnam's most beautiful urban panoramas. Illuminated streets, trails of passing cars, and in the distance the blue-white glow of the Dragon Bridge — all forming a vivid cityscape you can observe each evening from your own living room at <strong>Panoma 2</strong>.</p>

<p>2 bedrooms, 70m², mid-floor — the perfect position for those who want beautiful city views while maintaining a sense of connection with urban life below. Not too high, not too low — precisely the vantage point at which everything looks perfect from above.</p>

<h3>An Apartment for Those Who Live by the City's Rhythm</h3>
<ul>
  <li><strong>Captivating city views:</strong> City lights from a mid-floor Panoma 2 position create the finest urban backdrop — not obscured by clouds like the very top floors, not blocked by trees like lower levels.</li>
  <li><strong>2 thoughtfully arranged bedrooms:</strong> Master faces the city; bedroom 2 can serve as a home office or guest room when friends visit.</li>
  <li><strong>Mid-floor — Faster lifts, less waiting:</strong> Not queuing for elevators like the highest floors — a practical advantage many overlook when choosing apartments.</li>
  <li><strong>Panoma 2 full amenities:</strong> Gym, pool, concierge — everything required for premium apartment living.</li>
</ul>

<p><strong>$1,200/month</strong> — beautiful city views, ideal mid-floor position, fully furnished. Da Nang apartments rarely combine all these factors at such a reasonable price point.</p>

<p><em>Schedule a viewing in the evening — the night city view from this apartment is why 9 in 10 clients decide to rent immediately after their first visit.</em></p>`
  },

  'RE-011': {
    vi: `<p class="lead">Có những địa chỉ ở Đà Nẵng mà khi bạn nói tên, người nghe gật đầu với ánh mắt "à, xịn đấy". <strong>Fillmore</strong> là một trong số đó. Toà nhà ultra-luxury bên phố đi bộ sông Hàn — ngay trung tâm của mọi thứ đẹp đẽ và sôi động nhất thành phố.</p>

<p>Căn hộ 2 phòng ngủ, 71m², đầy đủ nội thất theo chuẩn khách sạn boutique 5 sao. Hàng xóm của bạn là doanh nhân nước ngoài, khách du lịch hạng sang thuê dài hạn, và những người Việt thành đạt muốn một địa chỉ tương xứng với vị thế của mình.</p>

<h3>Tại sao Fillmore — Tại sao địa chỉ quan trọng hơn bạn nghĩ</h3>
<ul>
  <li><strong>Phố đi bộ sông Hàn — ngay dưới chân:</strong> Không phải gần — là ngay đó. Bước ra khỏi toà là không gian đi bộ ven sông với ánh đèn nghệ thuật, các quán ăn fine dining, và không khí buổi tối đẳng cấp nhất Đà Nẵng.</li>
  <li><strong>View sông Hàn trực diện:</strong> Cầu Rồng, cầu Sông Hàn — background view hoàn hảo nhất từ mọi cửa sổ trong căn.</li>
  <li><strong>Nội thất resort-grade:</strong> Giường Sleepwell cao cấp, màn blackout imported, hệ thống âm thanh Sonos, SMEG fridge — mỗi thứ trong căn này đều được chọn lọc để tạo ra cảm giác "ở khách sạn mà như ở nhà".</li>
  <li><strong>Security và privacy tuyệt đối:</strong> Concierge tầng lobby kiểm soát ra vào 24/7 — không ai vào toà mà không được phép.</li>
</ul>

<p><strong>$1,533/tháng</strong> tại Fillmore, phố đi bộ sông Hàn, full nội thất 5 sao. Tính ra mỗi ngày chưa đến $52 — ít hơn một bữa ăn tối fine dining mà bạn đang tận hưởng ngay bên dưới toà nhà.</p>

<p><em>Fillmore không quảng cáo nhiều vì không cần — những người biết thì biết, và họ thường không cho ai khác biết căn của họ trống.</em></p>`,

    en: `<p class="lead">There are addresses in Da Nang where simply mentioning the name makes listeners nod with that knowing look: "ah, that's prestigious." <strong>Fillmore</strong> is one of them. An ultra-luxury building on the Han River walking street — at the very centre of everything beautiful and vibrant in the city.</p>

<p>2 bedrooms, 71m², furnished to 5-star boutique hotel standards. Your neighbours are foreign entrepreneurs, long-term luxury travellers, and successful Vietnamese residents who want an address matching their stature.</p>

<h3>Why Fillmore — Why Address Matters More Than You Think</h3>
<ul>
  <li><strong>Han River walking street — directly below:</strong> Not nearby — right there. Step out of the building into riverside promenade with art lighting, fine dining restaurants, and Da Nang's finest evening atmosphere.</li>
  <li><strong>Direct Han River views:</strong> Dragon Bridge, Han River Bridge — the perfect backdrop from every window in the apartment.</li>
  <li><strong>Resort-grade furnishings:</strong> Premium Sleepwell beds, imported blackout curtains, Sonos audio system, SMEG refrigerator — everything selected to deliver the sensation of "hotel living that feels like home."</li>
  <li><strong>Absolute security and privacy:</strong> Lobby-level concierge controls entry 24/7 — no one enters the building without authorisation.</li>
</ul>

<p><strong>$1,533/month</strong> at Fillmore, on the Han River walking street, with 5-star furnishings. That equates to less than $52 per day — less than a fine dining dinner you'll be enjoying directly below the building.</p>

<p><em>Fillmore doesn't advertise heavily because it doesn't need to — those who know, know, and they rarely tell anyone else when their unit becomes available.</em></p>`
  },

  'RE-012': {
    vi: `<p class="lead">Panoma 2 không cần giới thiệu nhiều với những người đã sống ở Đà Nẵng lâu. Nhưng với những ai mới đến — đây là toà nhà mà khi hỏi bất kỳ ai "ở Đà Nẵng thì ở đâu đẹp nhất?", Panoma 2 luôn là câu trả lời đầu tiên. Căn 2 phòng ngủ này vừa trở nên sẵn sàng cho thuê — và cửa sổ cơ hội này sẽ không mở lâu.</p>

<p>70m², 2 phòng ngủ, nội thất Châu Âu hoàn chỉnh. Bếp mở European style. Phòng khách đủ lớn để đặt bàn ăn và khu ngồi chơi riêng biệt. Căn hộ dành cho những người không muốn thoả hiệp về chất lượng sống.</p>

<h3>Những điểm cộng không thể bỏ qua</h3>
<ul>
  <li><strong>Vị trí Panoma 2 — Địa chỉ nói lên tất cả:</strong> Nằm trong tốp những toà căn hộ cao cấp nhất Đà Nẵng, địa chỉ này tạo ra ấn tượng đầu tiên cho bất kỳ ai bạn mời đến thăm.</li>
  <li><strong>2 phòng ngủ bố trí chuẩn:</strong> Phòng master có cửa sổ lớn, phòng 2 đủ chỗ cho giường đơn và bàn làm việc — hoàn hảo cho WFH professional.</li>
  <li><strong>Bếp mở Châu Âu:</strong> Mặt bàn đá marble, tủ bếp âm tường, dishwasher tích hợp — nấu ăn là niềm vui, không phải gánh nặng.</li>
  <li><strong>Tòa nhà hạng nhất:</strong> Hồ bơi infinity, gym đa năng, lounge tầng trên, reception 5 sao.</li>
</ul>

<p><strong>$1,380/tháng</strong> — Panoma 2, 2 phòng ngủ, full nội thất Châu Âu cao cấp. Nếu bạn đang tìm kiếm căn hộ Đà Nẵng tốt nhất trong tầm giá này, tìm kiếm của bạn vừa kết thúc.</p>

<p><em>Các căn hộ tại Panoma 2 thường được thuê trong vòng 72 giờ kể từ khi đăng thông tin. Đây là lần cảnh báo duy nhất.</em></p>`,

    en: `<p class="lead">Panoma 2 needs little introduction to those who have lived in Da Nang long enough. But for those newly arrived — this is the building that consistently tops any answer to "where are the best apartments in Da Nang?" This 2-bedroom unit has just become available — and this window won't stay open long.</p>

<p>70m², 2 bedrooms, complete European furnishings. European open-plan kitchen. Living area large enough for a dining table and separate seating zone. An apartment for those who refuse to compromise on quality of life.</p>

<h3>Non-Negotiable Advantages</h3>
<ul>
  <li><strong>Panoma 2 address — An address that speaks for itself:</strong> Among Da Nang's most prestigious residential towers, this address makes an immediate impression on anyone you invite to visit.</li>
  <li><strong>2 properly configured bedrooms:</strong> Master bedroom with large windows; second bedroom fits a single bed and desk — perfect for WFH professionals.</li>
  <li><strong>European open kitchen:</strong> Marble stone countertops, built-in cabinetry, integrated dishwasher — cooking becomes a pleasure, not a burden.</li>
  <li><strong>Tier-one building:</strong> Infinity pool, multi-function gym, upper lounge, 5-star reception.</li>
</ul>

<p><strong>$1,380/month</strong> — Panoma 2, 2 bedrooms, premium European furnishings. If you've been searching for the best apartment in Da Nang at this price point, your search has just ended.</p>

<p><em>Units at Panoma 2 are typically leased within 72 hours of listing. This is your only advance notice.</em></p>`
  },

  'RE-013': {
    vi: `<p class="lead">Ít người biết rằng một căn 1 phòng ngủ tại Panoma 2 có thể cảm thấy rộng hơn cả một căn 2 phòng ngủ ở nhiều toà nhà khác. Bí quyết nằm ở thiết kế: không vách ngăn không cần thiết, cửa kính mở rộng tối đa, và bố trí nội thất chuyên nghiệp tận dụng mọi m².</p>

<p>50m² tại Panoma 2 — địa chỉ mà giới expat và chuyên gia nước ngoài tại Đà Nẵng gọi là "the one to get". 1 phòng ngủ, hoàn chỉnh tuyệt đối — nơi lý tưởng cho người sống một mình thành đạt hoặc cặp đôi yêu cuộc sống đô thị đẳng cấp.</p>

<h3>Nhỏ về diện tích — Lớn về trải nghiệm</h3>
<ul>
  <li><strong>Panoma 2 — Không giải thích thêm:</strong> Địa chỉ đẳng cấp, cộng đồng chất lượng, tiện ích không thua gì khách sạn 5 sao.</li>
  <li><strong>1BR được thiết kế thông minh:</strong> Studio-style layout với sleeping zone được ngăn bởi rèm kính hoặc tủ âm tường — riêng tư khi cần, mở khi muốn rộng.</li>
  <li><strong>Bếp đầy đủ thiết bị:</strong> Không cần ăn ngoài mỗi bữa nếu không muốn — bếp này đủ để nấu mọi thứ bạn thích.</li>
  <li><strong>Tiện ích toà nhà — Như có thêm 200m²:</strong> Phòng khách chung, co-working space, gym, hồ bơi — tất cả là "extensions" của căn hộ của bạn.</li>
</ul>

<p><strong>$1,073/tháng</strong> — 1 phòng ngủ Panoma 2, trải nghiệm sống 5 sao. Đây là mức entry vào cộng đồng Panoma 2 và không có mức entry nào tốt hơn để bắt đầu.</p>

<p><em>Nếu bạn mới đến Đà Nẵng và muốn bắt đầu đúng cách, đây là căn hộ để làm điều đó.</em></p>`,

    en: `<p class="lead">Few people realise that a 1-bedroom apartment at Panoma 2 can feel more spacious than many 2-bedroom apartments elsewhere. The secret lies in design: no unnecessary partitions, maximally wide glass openings, and professional furniture arrangements that use every square metre.</p>

<p>50m² at Panoma 2 — the address that Da Nang's expat community and foreign professionals call "the one to get." 1 bedroom, absolutely complete — the ideal home for a successful solo professional or a couple who love premium urban living.</p>

<h3>Small in Footprint — Large in Experience</h3>
<ul>
  <li><strong>Panoma 2 — No further explanation needed:</strong> Premium address, quality community, amenities matching a 5-star hotel.</li>
  <li><strong>1BR intelligent design:</strong> Studio-style layout with sleeping zone divided by glass partition or built-in wardrobe — private when needed, open when you want space.</li>
  <li><strong>Fully equipped kitchen:</strong> No need to eat out every meal if you'd prefer not to — this kitchen handles everything you wish to cook.</li>
  <li><strong>Building amenities — Like having an extra 200m²:</strong> Common lounge, co-working space, gym, pool — all functioning as extensions of your apartment.</li>
</ul>

<p><strong>$1,073/month</strong> — 1-bedroom Panoma 2, 5-star living experience. This is the entry point to the Panoma 2 community, and there's no better entry point from which to begin.</p>

<p><em>If you've just arrived in Da Nang and want to start properly, this is the apartment from which to do it.</em></p>`
  },

  'RE-014': {
    vi: `<p class="lead">Da Nang đang thay đổi, và <strong>Futa Resident</strong> là bằng chứng rõ ràng nhất cho điều đó. Không phải là toà nhà cũ được renovate — đây là kiến trúc được xây dựng cho một thế hệ Đà Nẵng mới, nơi view biển và view sông không còn là đặc quyền của resort mà là điều bình thường của cuộc sống hàng ngày.</p>

<p>Căn 1 phòng ngủ, 50m² với tầm nhìn kép: biển và sông xen kẽ nhau tuỳ vị trí bạn đứng trong căn. Nội thất ultra-luxury được thiết kế bởi studio nội thất người Nhật — tối giản nhưng không thiếu thứ gì, cao cấp nhưng không phô trương.</p>

<h3>Ultra-Luxury — Không phải là từ quảng cáo</h3>
<ul>
  <li><strong>View biển + view sông — Không chọn được 1:</strong> Góc này nhìn thấy biển, quay sang nhìn thấy sông — hai tầm nhìn trong một căn hộ là điều cực kỳ hiếm có tại Đà Nẵng.</li>
  <li><strong>Nội thất Nhật — Tinh tế đến từng chi tiết:</strong> Từ tay nắm cửa đến gương phòng tắm — mọi thứ được chọn theo triết học "Wabi-Sabi": đẹp trong sự đơn giản có chủ đích.</li>
  <li><strong>Toà nhà ultra-modern:</strong> Cửa kính 2 lớp chống ồn, hệ thống lọc không khí HEPA trong căn, smart home với app điều khiển mọi thứ từ xa.</li>
  <li><strong>Cộng đồng residents chất lượng:</strong> Futa Resident được biết đến là nơi ở của nhiều CEO, chuyên gia tài chính, và doanh nhân quốc tế.</li>
</ul>

<p><strong>$1,534/tháng</strong> cho ultra-luxury 1BR với view biển-sông kép tại toà nhà đẳng cấp nhất thế hệ mới. Nếu bạn đánh giá cao sự tỉ mỉ trong thiết kế, Futa Resident sẽ vượt qua mọi kỳ vọng.</p>

<p><em>Sắp xếp một buổi xem vào buổi sáng — khi ánh nắng sớm đổ vào từ hai hướng biển và sông đồng thời, căn này trở nên phi thường theo nghĩa đen.</em></p>`,

    en: `<p class="lead">Da Nang is changing, and <strong>Futa Resident</strong> is the clearest evidence of that transformation. Not an old building renovated — this is architecture built for a new Da Nang generation, where ocean views and river views are no longer resort privileges but everyday normality.</p>

<p>A 1-bedroom, 50m² apartment with dual perspectives: ocean and river alternating depending on where you stand within the unit. Ultra-luxury interiors designed by a Japanese studio — minimalist yet complete, refined without ostentation.</p>

<h3>Ultra-Luxury — Not Just a Marketing Word Here</h3>
<ul>
  <li><strong>Ocean view + river view — You get both:</strong> This angle reveals ocean; turn and you see the river — dual premium views in one apartment, an extraordinary rarity in Da Nang.</li>
  <li><strong>Japanese interiors — Refined to the last detail:</strong> From door handles to bathroom mirrors — everything selected following "Wabi-Sabi" philosophy: beauty through intentional simplicity.</li>
  <li><strong>Ultra-modern building:</strong> Double-glazed soundproof glass, in-unit HEPA air filtration, smart home with app controlling everything remotely.</li>
  <li><strong>Quality residents community:</strong> Futa Resident is known as the address of CEOs, finance professionals, and international entrepreneurs.</li>
</ul>

<p><strong>$1,534/month</strong> for an ultra-luxury 1BR with dual ocean-river views in the most sophisticated new-generation building. If you value precision in design, Futa Resident will exceed every expectation.</p>

<p><em>Schedule a morning viewing — when early sunlight enters simultaneously from both ocean and river directions, this apartment becomes extraordinary in the most literal sense.</em></p>`
  },

  'RE-015': {
    vi: `<p class="lead">Đà Nẵng có một bí mật mà dân địa phương không muốn chia sẻ: Panoma 1 tầng cao, căn góc, nhìn ra biển vào lúc bình minh — là cảnh quan không thể mua được bằng tiền tại bất kỳ resort nào. Và tại đây, bạn không cần đặt phòng. Đây là nhà bạn.</p>

<p>Căn 1 phòng ngủ "cozy" 50m² này có mức độ chi tiết nội thất khiến nhiều căn 2 phòng ngủ phải ganh tị. Màu sắc tông ấm amber-cream, ánh đèn dimmer điều chỉnh được, và tầm nhìn biển tầng cao khiến không khí trong căn lúc nào cũng như đang ở resort ven biển.</p>

<h3>Cozy không có nghĩa là thiếu thốn</h3>
<ul>
  <li><strong>Tầm nhìn biển tầng cao — Không bị che:</strong> Từ góc này của Panoma 1, đường chân trời biển Mỹ Khê kéo dài về phía Nam không có gì cản — buổi sáng, mặt trời mọc ngay trên mặt nước trước mắt bạn.</li>
  <li><strong>Nội thất curated theo concept "warm coastal":</strong> Tone màu gỗ tếch sáng, rèm linen trắng, gối tựa hải quân — mọi thứ phối hợp để tạo cảm giác resort boutique.</li>
  <li><strong>Phòng ngủ yên tĩnh và ấm cúng:</strong> Giường King-size, drap cotton 800 thread-count, máy lạnh âm thanh thấp — ngủ ngon theo nghĩa đen.</li>
  <li><strong>Panoma 1 full amenities:</strong> Hồ bơi infinity nhìn ra biển, gym, rooftop bar — tiện ích của resort 5 sao trong mức giá căn hộ cho thuê.</li>
</ul>

<p><strong>$1,035/tháng</strong> — 1BR tầng cao biển Panoma 1, nội thất cozy coastal boutique. Buổi sáng nhìn ra biển trong khi uống cà phê là trải nghiệm không có tiền mua — nhưng ở đây bạn có thể thuê nó.</p>

<p><em>Căn này phù hợp nhất cho: digital nomad đang tìm "home base" lý tưởng, chuyên gia nước ngoài cần không gian sống chất lượng, và bất kỳ ai đã mệt mỏi với sự nhộn nhạo và chỉ muốn về nhà thấy bình yên.</em></p>`,

    en: `<p class="lead">Da Nang holds a secret that locals prefer not to share: Panoma 1, high floor, corner unit, facing the ocean at dawn — is a view that no resort money can buy. And here, you don't need to make a reservation. This is simply your home.</p>

<p>This "cozy" 1-bedroom, 50m² apartment has interior detail levels that would make many 2-bedroom units envious. Warm amber-cream tones, adjustable dimmer lighting, and a high-floor sea view that keeps the atmosphere perpetually resort-like.</p>

<h3>Cozy Does Not Mean Lacking</h3>
<ul>
  <li><strong>High-floor unobstructed ocean view:</strong> From this corner of Panoma 1, My Khe Beach's coastline extends southward with nothing in the way — each morning, the sun rises directly over the water in front of you.</li>
  <li><strong>Interiors curated on "warm coastal" concept:</strong> Light teak wood tones, white linen curtains, navy accent cushions — everything coordinated to evoke a boutique coastal resort.</li>
  <li><strong>Quiet and cozy bedroom:</strong> King-size bed, 800-thread-count cotton sheets, low-noise air conditioning — genuinely excellent sleep.</li>
  <li><strong>Panoma 1 full amenities:</strong> Infinity pool overlooking the ocean, gym, rooftop bar — 5-star resort amenities at apartment rental pricing.</li>
</ul>

<p><strong>$1,035/month</strong> — high-floor ocean-view 1BR at Panoma 1, cozy coastal boutique furnishings. Watching the sea while drinking morning coffee is an experience money can't buy — but here, you can rent it.</p>

<p><em>This apartment suits best: digital nomads searching for an ideal home base, expat professionals needing quality living space, and anyone exhausted by chaos who simply wants to come home and feel at peace.</em></p>`
  },

  'RE-016': {
    vi: `<p class="lead">Sông Hàn và skyline trung tâm Đà Nẵng — cùng một lúc, từ cùng một cửa sổ. Tại <strong>Panoma 2, tầng cao</strong>, góc nhìn này không phải ngẫu nhiên — đó là kết quả của vị trí được lựa chọn kỹ lưỡng trong toà nhà, hướng cửa sổ được tính toán để tối đa hoá hai tầm nhìn quý giá nhất của Đà Nẵng cùng một lúc.</p>

<p>Căn 1 phòng ngủ, 50m² này không dành cho người chỉ cần một chỗ ngủ. Đây dành cho người sống đúng nghĩa — người mà căn hộ của họ phản ánh cách họ nhìn nhận cuộc sống: tinh tế, có gu, và luôn muốn điều tốt nhất.</p>

<h3>Hai tầm nhìn — Một căn hộ hoàn hảo</h3>
<ul>
  <li><strong>View sông Hàn:</strong> Buổi sáng, mặt sông phản chiếu ánh nắng vàng sớm — cảnh quan thanh bình không thể tìm thấy ở bất kỳ khách sạn hay resort nào trong tầm giá này.</li>
  <li><strong>View Đà Nẵng Downtown:</strong> Buổi tối, đèn thành phố và ánh sáng của các toà nhà tạo thành bức tranh đô thị hiện đại — bạn đang nhìn tương lai của một thành phố đang lên.</li>
  <li><strong>Nội thất thiết kế cao cấp:</strong> Không phải nội thất "nhà cho thuê bình thường" — đây là sản phẩm của interior designer chuyên nghiệp với concept định sẵn.</li>
  <li><strong>1BR được tối ưu cho người sống một mình thành đạt:</strong> Mọi góc không gian đều có chức năng — không lãng phí một centimetre vuông nào.</li>
</ul>

<p><strong>$1,150/tháng</strong> — sông Hàn + Downtown Đà Nẵng, Panoma 2, 1BR cao cấp. Đây là mức giá mà 6 tháng sau bạn sẽ nhìn lại và nhận ra đã quyết định đúng.</p>

<p><em>Xem vào lúc hoàng hôn để thấy khoảnh khắc mà view sông và view thành phố cùng lúc đẹp nhất trong ngày — đó là khoảnh khắc bạn sẽ quyết định ngay tại chỗ.</em></p>`,

    en: `<p class="lead">Han River and Da Nang's downtown skyline — simultaneously, from the same window. At <strong>Panoma 2, high floor</strong>, this perspective is no accident — it's the result of a carefully selected position within the building, with window orientation calculated to maximise Da Nang's two most prized views at once.</p>

<p>This 1-bedroom, 50m² apartment is not for those who just need a place to sleep. It's for those who genuinely live — people whose home reflects how they perceive life: refined, tasteful, and always seeking the finest.</p>

<h3>Two Views — One Perfect Apartment</h3>
<ul>
  <li><strong>Han River views:</strong> Each morning, the river surface reflects early golden sunlight — a serene landscape impossible to find in any hotel or resort at this price range.</li>
  <li><strong>Da Nang Downtown views:</strong> Each evening, city lights and building illumination form a modern urban canvas — you're watching the future of a rising city.</li>
  <li><strong>Premium designed interiors:</strong> Not "typical rental furniture" — this is the work of a professional interior designer with a defined concept.</li>
  <li><strong>1BR optimised for successful solo living:</strong> Every corner of the space has function — not one square centimetre wasted.</li>
</ul>

<p><strong>$1,150/month</strong> — Han River + Da Nang Downtown, Panoma 2, premium 1BR. This is the price point that in 6 months you'll look back on and realise you made the right decision.</p>

<p><em>View at sunset to witness the moment when river view and city view are simultaneously at their most beautiful — that's the moment you'll decide on the spot.</em></p>`
  },

  'RE-017': {
    vi: `<p class="lead">Không phải ai cũng cần tầng cao nhất để có tầm nhìn đẹp nhất. <strong>Panoma 2, view biển, tầng trung</strong> — nơi bạn vẫn thấy đường chân trời biển Đà Nẵng rõ mồn một, nhưng tiết kiệm hơn so với các tầng penthouse, và vẫn đủ cao để cảm nhận khoảng trời thoáng đãng.</p>

<p>Căn 1 phòng ngủ này dành cho những người thực tế — người hiểu rằng giá trị thực không nằm ở tầng số, mà ở những gì bạn cảm thấy mỗi ngày khi sống ở đây. Và cảm giác đó tại căn này rất đơn giản: hạnh phúc.</p>

<h3>Giá trị thực — Không phô trương</h3>
<ul>
  <li><strong>View biển tầng trung — Thực ra, đủ rồi:</strong> Bạn thấy biển, bạn nghe gió biển, bạn cảm nhận không khí mặn — đó là những điều bạn tìm kiếm. Và tất cả đều có tại đây với mức giá hợp lý hơn.</li>
  <li><strong>Panoma 2 — Toà nhà không cần giải thích:</strong> Cộng đồng tuyệt vời, amenities đẳng cấp, vị trí trung tâm — địa chỉ này nói lên tất cả.</li>
  <li><strong>1 phòng ngủ hoàn chỉnh 50m²:</strong> Đủ cho người độc thân hoặc cặp đôi — không thiếu thứ gì, không thừa thứ gì.</li>
  <li><strong>Mức giá tốt nhất cho view biển Panoma 2:</strong> Cùng toà nhà, cùng tiện ích, cùng view biển — nhưng giá tốt hơn các căn tầng cao. Lựa chọn thông minh.</li>
</ul>

<p><strong>$884/tháng</strong> — view biển thực sự tại Panoma 2, 1 phòng ngủ, full nội thất. Đây là mức giá tốt nhất cho trải nghiệm sống Panoma 2 với view biển mà bạn có thể tìm thấy.</p>

<p><em>Thị trường tốt nhất thuộc về người quyết định nhanh. Tại mức giá này với vị trí này, căn hộ sẽ không ở trên thị trường lâu.</em></p>`,

    en: `<p class="lead">Not everyone needs the highest floor to have the most beautiful view. <strong>Panoma 2, ocean view, mid-floor</strong> — where you still see Da Nang's coastal horizon clearly, at a more accessible price than penthouse floors, and still elevated enough to feel that liberating sense of open sky.</p>

<p>This 1-bedroom apartment is for the pragmatist — someone who understands that real value lies not in floor numbers, but in what you feel every day living there. And that feeling in this apartment is simple: contentment.</p>

<h3>Real Value — Unpretentious</h3>
<ul>
  <li><strong>Mid-floor ocean view — Actually, this is enough:</strong> You see the ocean, you feel the sea breeze, you breathe the salt air — those are the things you came for. And all of them are here at a more reasonable price.</li>
  <li><strong>Panoma 2 — A building that needs no explanation:</strong> Outstanding community, premium amenities, central location — this address says everything.</li>
  <li><strong>Complete 1-bedroom, 50m²:</strong> Appropriate for solo professionals or couples — nothing missing, nothing excessive.</li>
  <li><strong>Best price for ocean-view Panoma 2:</strong> Same building, same amenities, same ocean views — but better priced than high-floor units. The intelligent choice.</li>
</ul>

<p><strong>$884/month</strong> — genuine ocean views at Panoma 2, 1 bedroom, fully furnished. This is the best possible price for a Panoma 2 ocean-view living experience you'll find.</p>

<p><em>The best market opportunities belong to those who decide quickly. At this price with this position, this apartment will not remain available long.</em></p>`
  }
};

async function run() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB);

  let updated = 0;
  for (const [code, copy] of Object.entries(richCopy)) {
    const result = await db.collection('properties').updateOne(
      { code },
      { $set: { description: { vi: copy.vi.trim(), en: copy.en.trim() } } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✓ Updated ${code}`);
      updated++;
    } else {
      console.log(`⚠ Not found: ${code}`);
    }
  }

  console.log(`\n✅ Done! Updated ${updated}/${Object.keys(richCopy).length} properties.`);
  await client.close();
}

run().catch(console.error);
