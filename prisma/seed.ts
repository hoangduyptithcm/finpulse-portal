import { PrismaClient, Role, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu cho FinPulse Portal...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@finpulse.vn";
  const rawPassword = process.env.ADMIN_PASSWORD || "AdminPassword@2026";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 1. Tạo tài khoản Admin
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "FinPulse Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Tạo tài khoản Admin: ${admin.email}`);

  // 2. Tạo các Danh mục mặc định
  const categoriesData = [
    {
      name: "Tiền mã hóa (Crypto)",
      slug: "crypto",
      description: "Tin tức, biến động thị trường và xu hướng Bitcoin, Ethereum và Altcoins.",
      order: 1,
    },
    {
      name: "Chứng khoán Việt Nam",
      slug: "chung-khoan-vn",
      description: "Bản tin thị trường VN-Index, VN30, cổ phiếu tiềm năng và báo cáo tài chính.",
      order: 2,
    },
    {
      name: "Kinh tế vĩ mô",
      slug: "kinh-te-vi-mo",
      description: "Chính sách tiền tệ, lãi suất Fed, Ngân hàng Nhà nước và chỉ số lạm phát.",
      order: 3,
    },
    {
      name: "Kiến thức đầu tư",
      slug: "kien-thuc-dau-tu",
      description: "Cẩm nang hướng dẫn đầu tư tài chính, quản lý vốn và tâm lý giao dịch.",
      order: 4,
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("✅ Khởi tạo 4 danh mục tài chính mặc định thành công.");

  // 3. Tạo một bài viết mẫu chuẩn SEO (Featured Post)
  const cryptoCategory = await prisma.category.findUnique({
    where: { slug: "crypto" },
  });

  if (cryptoCategory) {
    const samplePost = await prisma.post.upsert({
      where: { slug: "tong-quan-thi-truong-crypto-va-chu-ky-moi-2026" },
      update: {},
      create: {
        title: "Tổng quan thị trường Crypto và chu kỳ tăng trưởng mới trong năm 2026",
        slug: "tong-quan-thi-truong-crypto-va-chu-ky-moi-2026",
        excerpt: "Phân tích dòng tiền các quỹ tổ chức, chu kỳ halving và cơ hội đầu tư cho nhà đầu tư cá nhân trên thị trường tiền mã hóa.",
        content: `
          <h2>1. Bối cảnh vĩ mô và dòng tiền tổ chức</h2>
          <p>Thị trường tiền mã hóa đang bước vào giai đoạn trưởng thành với sự tham gia mạnh mẽ của các định chế tài chính lớn thông qua các quỹ Spot ETF. Khác với các chu kỳ trước đây chủ yếu dựa vào dòng tiền cá nhân FOMO, chu kỳ lần này chứng kiến sự tích lũy bền vững của dòng vốn dài hạn.</p>
          
          <h2>2. Tác động của chính sách lãi suất toàn cầu</h2>
          <p>Khi các ngân hàng trung ương lớn trên thế giới bắt đầu chu kỳ nới lỏng chính sách tiền tệ, thanh khoản dồi dào sẽ tìm đến các kênh tài sản có mức sinh lời cao hơn, trong đó Crypto và Chứng khoán là hai kênh hưởng lợi trực tiếp.</p>

          <blockquote>
            <strong>Khuyến nghị:</strong> Nhà đầu tư nên giữ tỷ trọng phân bổ vốn hợp lý, ưu tiên các tài sản nền tảng có thanh khoản cao và giá trị nội tại trước khi tìm kiếm lợi nhuận từ các altcoin vốn hóa nhỏ.
          </blockquote>

          <h2>3. Chiến lược đầu tư hiệu quả</h2>
          <p>Phương pháp DCA (bình quân giá) kết hợp với việc theo dõi sát sao chỉ số On-chain và lịch sử biến động thị trường vẫn là kim chỉ nam an toàn cho các nhà đầu tư cá nhân.</p>
        `,
        coverImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&h=630&q=80",
        status: PostStatus.PUBLISHED,
        featured: true,
        views: 128,
        categoryId: cryptoCategory.id,
        authorId: admin.id,
      },
    });
    console.log(`✅ Khởi tạo bài viết mẫu: ${samplePost.title}`);
  }

  console.log("🎉 Hoàn tất seed dữ liệu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
