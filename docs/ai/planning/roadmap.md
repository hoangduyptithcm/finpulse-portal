# Roadmap & Kế hoạch triển khai theo từng ngày (Day-by-Day Plan)

Mục tiêu: Xây dựng hoàn chỉnh FinPulse Portal chạy trên VPS sẵn có, cấu hình tên miền và kiểm thử kéo link Facebook thành công trong vòng **7 ngày**.

---

### 📅 Ngày 1: Thiết lập Dự án, CSDL & Môi trường Docker
- **Mục tiêu**: Chuẩn bị nền tảng Next.js, ORM Prisma và môi trường Database.
- **Công việc cụ thể**:
  - Khởi tạo dự án Next.js (App Router, TypeScript, Tailwind CSS).
  - Cấu hình Prisma ORM với CSDL PostgreSQL.
  - Viết file `docker-compose.yml` để chạy PostgreSQL cục bộ và trên VPS.
  - Tạo schema database: `User` (Admin), `Category`, `Post`, `Tag`.
  - Chạy migration khởi tạo các bảng và seed tài khoản Admin đầu tiên.

---

### 📅 Ngày 2: Hệ thống Xác thực Admin & Layout CMS
- **Mục tiêu**: Quản trị viên có thể đăng nhập bảo mật và truy cập giao diện quản trị.
- **Công việc cụ thể**:
  - Cài đặt & cấu hình NextAuth.js (Auth.js) chế độ Credentials (Email/Password với bcrypt).
  - Viết middleware bảo vệ tất cả các route bắt đầu bằng `/admin/*`.
  - Xây dựng giao diện Admin Dashboard Layout (Sidebar điều hướng, Header hiển thị thông tin admin, nút Đăng xuất).
  - Màn hình thống kê nhanh (Số lượng bài viết, lượt xem, bài nháp).

---

### 📅 Ngày 3: Trình soạn thảo TipTap & Upload hình ảnh lên VPS
- **Mục tiêu**: Admin có thể viết bài chuẩn SEO, định dạng văn bản và chèn ảnh trực tiếp.
- **Công việc cụ thể**:
  - Tích hợp trình soạn thảo WYSIWYG TipTap (hỗ trợ H1, H2, Bold, Italic, Link, Blockquote, Image).
  - Xây dựng API route `/api/upload` tiếp nhận file ảnh từ máy tính, lưu vào thư mục `/uploads` trên VPS.
  - Thêm chức năng nén ảnh nhẹ (dùng `sharp` để convert sang định dạng WebP).
  - Màn hình danh sách bài viết (Hiển thị bảng bài viết, nút Sửa/Xóa, bộ lọc theo Trạng thái Draft/Published).
  - Màn hình Quản lý Danh mục (Tạo danh mục: Crypto, Chứng khoán VN...).

---

### 📅 Ngày 4: Xây dựng Giao diện Trang chủ (Public Landing Page)
- **Mục tiêu**: Người dùng truy cập trang chủ thấy giao diện tin tức tài chính hiện đại, uy tín.
- **Công việc cụ thể**:
  - Tích hợp thanh Ticker chạy giá thời gian thực (BTC, ETH, SOL qua CoinGecko API và chỉ số VN-Index).
  - Thiết kế Header với Logo, Menu danh mục và Nút chuyển Dark/Light Mode.
  - Section Tin nóng / Bài viết tiêu điểm (Hero Article).
  - Section Tin tức theo Danh mục (Tabs lọc: Tất cả, Crypto, Thị trường VN).
  - Section Kêu gọi tham gia cộng đồng (Telegram / Zalo / Fanpage Facebook).
  - Footer trang web với thông tin bản quyền và liên hệ.

---

### 📅 Ngày 5: Trang Chi tiết bài viết & Tối ưu SEO Facebook (OG Tags)
- **Mục tiêu**: Đảm bảo trải nghiệm đọc bài hoàn hảo trên điện thoại và link chia sẻ Facebook hiển thị ảnh lớn.
- **Công việc cụ thể**:
  - Xây dựng trang `app/posts/[slug]/page.tsx` hiển thị nội dung bài viết.
  - Cấu hình hàm `generateMetadata` của Next.js sinh đúng thẻ Open Graph:
    - `og:title`, `og:description`, `og:image` (kích thước chuẩn 1200x630).
  - Thêm nút chia sẻ mạng xã hội (Share Facebook, Copy link, Share Telegram).
  - Khu vực hiển thị Bài viết liên quan (Related Posts).
  - Tối ưu giao diện cho In-App Browser của Facebook (không vỡ khung, font chữ to rõ, không giật lag).

---

### 📅 Ngày 6: Đóng gói Docker & Triển khai lên VPS + Cấu hình Tên miền
- **Mục tiêu**: Website chính thức hoạt động trên VPS với domain riêng và chứng chỉ SSL HTTPS.
- **Công việc cụ thể**:
  - Viết `Dockerfile` đa tầng (multi-stage build) để tối ưu kích thước image Next.js (< 150MB).
  - Cấu hình file `docker-compose.prod.yml` chạy trên VPS:
    - Container 1: Next.js Web App.
    - Container 2: PostgreSQL.
    - Container 3: Nginx Reverse Proxy (gắn volume `/uploads` để phục vụ ảnh tĩnh).
  - Trỏ bản ghi DNS (A record `@` và `www`) từ nhà cung cấp domain về địa chỉ IP của VPS.
  - Cài đặt Certbot cấp chứng chỉ SSL miễn phí từ Let's Encrypt (tự động chuyển hướng HTTP -> HTTPS).

---

### 📅 Ngày 7: Kiểm thử thực tế với Facebook & Tối ưu bảo mật
- **Mục tiêu**: Hoàn thiện toàn bộ hệ thống, kiểm thử chia sẻ link thực tế từ Fanpage.
- **Công việc cụ thể**:
  - Dùng công cụ **Facebook Sharing Debugger** cào thử link bài viết, kiểm tra ảnh preview và tiêu đề.
  - Kiểm tra tốc độ tải trang bằng Google PageSpeed Insights (mục tiêu > 90 điểm di động).
  - Cấu hình sao lưu CSDL tự động (cronjob dump database mỗi đêm lưu trên VPS).
  - Viết hướng dẫn vận hành: Cách đăng bài, cách dán link lên Fanpage để đạt tương tác cao nhất.
