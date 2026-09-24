# Requirements Document: FinPulse Portal

## 1. Giới thiệu dự án
- **Tên dự án**: FinPulse Portal (Cổng thông tin & Học tập tài chính: Crypto & Thị trường Việt Nam).
- **Mục tiêu**: Xây dựng một website tin tức/kiến thức tài chính có kèm trang quản trị (Admin) để đăng bài viết kèm hình ảnh. Nguồn traffic chính đến từ Fanpage Facebook (đính kèm link bài viết).
- **Hạ tầng sẵn có**: Đã có sẵn **Domain** và **VPS Linux** (Chi phí phát sinh mới = **0 VNĐ**).

## 2. Yêu cầu chức năng (Functional Requirements)

### 2.1. Phía Độc giả (Public Portal)
- **Trang chủ (Landing Page / News Portal)**:
  - Thanh Ticker thời gian thực: Giá Crypto phổ biến (BTC, ETH, SOL) và các chỉ số chứng khoán VN (VN-Index, VN30).
  - Bài viết nổi bật (Featured / Breaking News).
  - Danh mục bài viết: *Tiền mã hóa (Crypto)*, *Thị trường chứng khoán VN*, *Kinh tế vĩ mô*, *Kiến thức nhập môn*.
  - Lưới bài viết mới nhất (Pagination / Load more).
  - Khung kêu gọi tham gia cộng đồng (Telegram / Zalo / Facebook Fanpage).
- **Trang Chi tiết bài viết (Article Page)**:
  - Tiêu đề, ngày đăng, tác giả, danh mục.
  - Hình ảnh bài viết sắc nét, hiển thị tối ưu trên thiết bị di động (In-App Browser của Facebook).
  - Nội dung giàu định dạng: H1, H2, H3, trích dẫn, ảnh, video nhúng.
  - Nút chia sẻ nhanh (Facebook, Telegram, Copy Link).
  - Danh sách bài viết liên quan (Related articles).

### 2.2. Phía Quản trị viên (Admin Portal)
- **Xác thực (Authentication)**:
  - Đăng nhập bảo mật cho quản trị viên (Admin Login).
  - Middleware bảo vệ toàn bộ tuyến đường `/admin/*`.
- **Quản lý Bài viết (Article Management)**:
  - Tạo mới, Sửa, Xóa, Xem trước bài viết.
  - Trạng thái bài viết: Bản nháp (Draft) / Xuất bản (Published).
  - Trình soạn thảo văn bản trực quan (Rich Text Editor - TipTap).
  - Upload ảnh đại diện (Thumbnail) và ảnh trong thân bài viết trực tiếp lên VPS.
  - Tự động sinh Slug chuẩn SEO từ tiêu đề bài viết tiếng Việt.
- **Quản lý Danh mục & Thẻ (Categories & Tags)**:
  - Tạo và gán danh mục (Crypto, Chứng khoán VN...).

## 3. Yêu cầu phi chức năng (Non-Functional Requirements)
- **Tối ưu Facebook Open Graph (Cực kỳ quan trọng)**:
  - Thẻ `og:title`, `og:description`, `og:image` (kích thước chuẩn 1200x630px), `og:url`, `og:type="article"`.
  - Đảm bảo khi dán link lên Facebook sẽ hiện card ảnh lớn, rõ nét và tiêu đề bắt mắt.
- **Hiệu năng & Tiết kiệm tài nguyên**:
  - Chạy gọn nhẹ trên VPS (tiết kiệm RAM & CPU thông qua Docker).
  - Tối ưu hóa tải trang trên di động (Mobile In-App Browser Facebook) dưới 1.5 giây.
- **Chi phí**: 0 VNĐ chi phí dịch vụ bên ngoài, tự vận hành toàn bộ trên VPS hiện có.
