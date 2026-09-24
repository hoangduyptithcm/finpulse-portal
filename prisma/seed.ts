import { PrismaClient, Role, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp toàn bộ dữ liệu mẫu theo bản thiết kế Claude Design...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@finpulse.vn";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword@2026";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Tạo tài khoản Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: "Minh Anh",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // 2. Tạo 4 danh mục theo thiết kế
  const categories = [
    { name: "Tiền mã hóa", slug: "crypto", description: "Tin tức Crypto, Bitcoin, Ethereum và DeFi", order: 1 },
    { name: "Chứng khoán", slug: "chung-khoan", description: "Thị trường VN-Index, VN30 và cổ phiếu", order: 2 },
    { name: "Vĩ mô", slug: "vi-mo", description: "Lãi suất, Fed, Ngân hàng Nhà nước và tỷ giá", order: 3 },
    { name: "Kiến thức đầu tư", slug: "kien-thuc-dau-tu", description: "Cẩm nang và kinh nghiệm đầu tư thực chiến", order: 4 },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }

  // 3. Toàn bộ các bài viết theo đúng thiết kế
  const postsData = [
    {
      title: "Tổng quan thị trường Crypto và chu kỳ tăng trưởng mới trong năm 2026",
      slug: "tong-quan-thi-truong-crypto-va-chu-ky-moi-nam-2026",
      excerpt: "Dòng tiền từ các quỹ ETF giữ vai trò dẫn dắt, trong khi nhà đầu tư cá nhân quay lại chậm hơn các chu kỳ trước.",
      content: `
        <h2>1. Bối cảnh vĩ mô và dòng tiền tổ chức</h2>
        <p>Thị trường tiền mã hóa đang bước vào giai đoạn trưởng thành với sự tham gia mạnh mẽ của các định chế tài chính lớn thông qua các quỹ Spot ETF. Khác với các chu kỳ trước đây chủ yếu dựa vào dòng tiền cá nhân FOMO, chu kỳ lần này chứng kiến sự tích lũy bền vững của dòng vốn dài hạn.</p>
        <h2>2. Tác động của chính sách tiền tệ toàn cầu</h2>
        <p>Khi các ngân hàng trung ương lớn trên thế giới bắt đầu chu kỳ nới lỏng chính sách tiền tệ, thanh khoản dồi dào sẽ tìm đến các kênh tài sản có mức sinh lời cao hơn.</p>
        <blockquote>Khuyến nghị: Nhà đầu tư nên giữ tỷ trọng phân bổ vốn hợp lý, ưu tiên các tài sản nền tảng có thanh khoản cao.</blockquote>
      `,
      coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: true,
      views: 2431,
      categorySlug: "crypto",
    },
    {
      title: "Spot ETF Ethereum ghi nhận dòng vào kỷ lục",
      slug: "spot-etf-ethereum-ghi-nhan-dong-vao-ky-luc",
      excerpt: "Dòng vốn ròng đổ vào các quỹ ETF Ethereum tại Mỹ đạt mức cao nhất kể từ ngày niêm yết.",
      content: "<p>Dòng tiền ròng từ các quỹ đầu tư tổ chức đang đẩy thị phần của Ethereum tăng mạnh trở lại.</p>",
      coverImage: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1850,
      categorySlug: "crypto",
    },
    {
      title: "Halving đã qua 2 năm: giá Bitcoin phản ứng thế nào?",
      slug: "halving-da-qua-2-nam-gia-bitcoin-phan-ung-the-nao",
      excerpt: "Nhìn lại lịch sử các đợt halving trước để đối chiếu với biến động giá Bitcoin ở chu kỳ hiện tại.",
      content: "<p>Dữ liệu on-chain cho thấy chu kỳ tăng trưởng thường bùng nổ mạnh nhất sau 18-24 tháng kể từ sự kiện Halving.</p>",
      coverImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 2100,
      categorySlug: "crypto",
    },
    {
      title: "Khối ngoại quay lại mua ròng nhóm ngân hàng sau 3 tuần",
      slug: "khoi-ngoai-quay-lai-mua-rong-nhom-ngan-hang-sau-3-tuan",
      excerpt: "Dòng vốn ngoại tập trung gom mạnh các cổ phiếu ngân hàng có định giá hấp dẫn và tỷ lệ nợ xấu được kiểm soát tốt.",
      content: "<p>Khối ngoại đã mua ròng hơn 800 tỷ đồng trong phiên giao dịch, chấm dứt chuỗi bán ròng liên tiếp.</p>",
      coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1980,
      categorySlug: "chung-khoan",
    },
    {
      title: "Fed giữ nguyên lãi suất, phát tín hiệu cắt giảm vào tháng 12",
      slug: "fed-giu-nguyen-lai-suat-phat-tin-hieu-cat-giam-thang-12",
      excerpt: "Chủ tịch Powell nhấn mạnh lạm phát đang trên đà hướng về mục tiêu 2% bền vững.",
      content: "<p>Quyết định của Fed phù hợp với dự đoán của đa số các chuyên gia kinh tế trên phố Wall.</p>",
      coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 2744,
      categorySlug: "vi-mo",
    },
    {
      title: "Cổ phiếu thép trước mùa báo cáo quý III",
      slug: "co-phieu-thep-truoc-mua-bao-cao-quy-iii",
      excerpt: "Biên lợi nhuận của các doanh nghiệp đầu ngành như HPG, NKG dự kiến cải thiện nhờ giá nguyên liệu đầu vào hạ nhiệt.",
      content: "<p>Thị trường thép trong nước ghi nhận sản lượng tiêu thụ khả quan hơn trong tháng vừa qua.</p>",
      coverImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1034,
      categorySlug: "chung-khoan",
    },
    {
      title: "Solana tăng 6% nhờ hoạt động DeFi phục hồi",
      slug: "solana-tang-6-nho-hoat-dong-defi-phuc-hoi",
      excerpt: "Khối lượng giao dịch DEX trên hệ sinh thái Solana tiếp tục vượt Ethereum trong tuần thứ ba liên tiếp.",
      content: "<p>Phí mạng rẻ và tốc độ xử lý nhanh giúp Solana thu hút lượng lớn người dùng mới vào hệ sinh thái.</p>",
      coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1455,
      categorySlug: "crypto",
    },
    {
      title: "VN-Index vượt 1.290 điểm, thanh khoản cải thiện rõ rệt",
      slug: "vn-index-vuot-1290-diem-thanh-khoan-cai-thien-ro-ret",
      excerpt: "Dòng tiền lan sang nhóm bất động sản và chứng khoán trong phiên chiều.",
      content: "<p>Sự bứt phá của các nhóm ngành trụ cột đã giúp chỉ số dễ dàng chinh phục ngưỡng cản tâm lý.</p>",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 3105,
      categorySlug: "chung-khoan",
    },
    {
      title: "Nhóm ngân hàng dẫn dắt, VCB và TCB tăng trên 2%",
      slug: "nhom-ngan-hang-dan-dat-vcb-va-tcb-tang-tren-2-phan-tram",
      excerpt: "Thanh khoản toàn thị trường vượt 20,000 tỷ đồng với sự đóng góp lớn từ nhóm cổ phiếu vua.",
      content: "<p>Cổ phiếu ngân hàng tiếp tục thu hút dòng tiền dẫn dắt thị trường đi lên.</p>",
      coverImage: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1520,
      categorySlug: "chung-khoan",
    },
    {
      title: "Ba mã bán lẻ được khối ngoại gom mạnh tuần qua",
      slug: "ba-ma-ban-le-duoc-khoi-ngoai-gom-manh-tuan-qua",
      excerpt: "Kỳ vọng tiêu dùng nội địa hồi phục trong quý cuối năm là động lực thúc đẩy khối ngoại giải ngân.",
      content: "<p>Nhóm cổ phiếu bán lẻ đang lấy lại đà tăng trưởng ổn định sau thời gian điều chỉnh.</p>",
      coverImage: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 940,
      categorySlug: "chung-khoan",
    },
    {
      title: "Lịch chia cổ tức tiền mặt tuần 40",
      slug: "lich-chia-co-tuc-tien-mat-tuan-40",
      excerpt: "Tổng hợp các doanh nghiệp chốt quyền nhận cổ tức bằng tiền mặt với tỷ lệ lên đến 30%.",
      content: "<p>Nhà đầu tư lưu ý ngày giao dịch không hưởng quyền để đảm bảo quyền lợi nhận cổ tức.</p>",
      coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 780,
      categorySlug: "chung-khoan",
    },
    {
      title: "Đọc báo cáo tài chính trong 10 phút: 5 chỉ số cần nhớ",
      slug: "doc-bao-cao-tai-chinh-trong-10-phut-5-chi-so-can-nho",
      excerpt: "P/E, ROE, biên lợi nhuận gộp, dòng tiền tự do và nợ vay trên vốn chủ.",
      content: `
        <h2>1. Tỷ số P/E (Price to Earnings)</h2>
        <p>Đo lường mức giá thị trường so với thu nhập trên mỗi cổ phần.</p>
        <h2>2. Tỷ suất sinh lời trên vốn chủ sở hữu (ROE)</h2>
        <p>Chỉ số vàng phản ánh hiệu quả sử dụng vốn của ban lãnh đạo doanh nghiệp.</p>
        <h2>3. Biên lợi nhuận gộp (Gross Margin)</h2>
        <p>Cho thấy lợi thế cạnh tranh của sản phẩm trên thị trường.</p>
        <h2>4. Dòng tiền tự do (Free Cash Flow)</h2>
        <p>Dòng tiền thực tế mà doanh nghiệp tạo ra sau khi trừ chi phí tái đầu tư.</p>
        <h2>5. Nợ vay trên vốn chủ sở hữu (D/E)</h2>
        <p>Đo lường mức độ đòn bẩy tài chính và an toàn thanh toán.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 3960,
      categorySlug: "kien-thuc-dau-tu",
    },
    {
      title: "DCA là gì? Cách bình quân giá cho người mới",
      slug: "dca-la-gi-cach-binh-quan-gia-cho-nguoi-moi",
      excerpt: "Chiến lược phân bổ vốn định kỳ giúp loại bỏ yếu tố cảm xúc và tối ưu hóa giá vốn dài hạn.",
      content: "<p>DCA (Dollar-Cost Averaging) là phương pháp mua đều đặn một lượng tài sản cố định bất kể giá thị trường tăng hay giảm.</p>",
      coverImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 4812,
      categorySlug: "kien-thuc-dau-tu",
    },
    {
      title: "Quản lý vốn: vì sao không nên dồn hết vào một mã",
      slug: "quan-ly-von-vi-sao-khong-nen-don-het-vao-mot-ma",
      excerpt: "Nguyên tắc đa dạng hóa danh mục để bảo vệ tài khoản khỏi những đợt sụt giảm bất ngờ.",
      content: "<p>Không bao giờ bỏ tất cả trứng vào một giỏ là bài học vỡ lòng nhưng nhiều nhà đầu tư vẫn mắc phải.</p>",
      coverImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1702,
      categorySlug: "kien-thuc-dau-tu",
    },
    {
      title: "Phân biệt cổ phiếu tăng trưởng và cổ phiếu giá trị",
      slug: "phan-biet-co-phieu-tang-truong-va-co-phieu-gia-tri",
      excerpt: "Hiểu rõ đặc tính từng loại cổ phiếu để xây dựng chiến lược đầu tư phù hợp với khẩu vị rủi ro.",
      content: "<p>Cổ phiếu tăng trưởng tập trung vào tốc độ mở rộng doanh thu, trong khi cổ phiếu giá trị mang lại sự an toàn nhờ tài sản vững chắc.</p>",
      coverImage: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1350,
      categorySlug: "kien-thuc-dau-tu",
    },
    {
      title: "Ví lạnh và ví nóng: nên giữ tiền mã hóa ở đâu?",
      slug: "vi-lanh-va-vi-nong-nen-giu-tien-ma-hoa-o-dau",
      excerpt: "Hướng dẫn bảo mật tài sản Crypto cá nhân, ưu và nhược điểm của từng loại ví lưu trữ.",
      content: "<p>Ví lạnh (Ledger, Trezor) phù hợp cho lưu trữ dài hạn, ví nóng (Metamask, Trust) tiện lợi cho giao dịch hàng ngày.</p>",
      coverImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1120,
      categorySlug: "kien-thuc-dau-tu",
    },
    {
      title: "Tỷ giá ổn định, NHNN bơm thanh khoản qua OMO",
      slug: "ty-gia-on-dinh-nhnn-bom-thanh-khoan-qua-omo",
      excerpt: "Thị trường liên ngân hàng hạ nhiệt sau động thái hỗ trợ thanh khoản kịp thời của Ngân hàng Nhà nước.",
      content: "<p>Thanh khoản hệ thống ngân hàng dồi dào trở lại giúp mặt bằng lãi suất duy trì ở mức thấp hỗ trợ doanh nghiệp.</p>",
      coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&h=630&q=80",
      status: PostStatus.PUBLISHED,
      featured: false,
      views: 1210,
      categorySlug: "vi-mo",
    },
  ];

  for (const item of postsData) {
    const categoryId = catMap[item.categorySlug];
    if (!categoryId) continue;

    await prisma.post.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        status: item.status,
        featured: item.featured,
        views: item.views,
        categoryId,
      },
      create: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        status: item.status,
        featured: item.featured,
        views: item.views,
        categoryId,
        authorId: admin.id,
      },
    });
  }

  console.log(`✅ Nạp thành công ${postsData.length} bài viết khớp 100% bản thiết kế Claude!`);
}

main()
  .catch((e) => {
    console.error("Lỗi khi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
