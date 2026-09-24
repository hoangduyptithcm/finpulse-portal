# System Architecture & Design: FinPulse Portal

## 1. Kiến trúc hạ tầng trên VPS (0đ phát sinh)

Tận dụng 100% tài nguyên của VPS hiện có, đóng gói toàn bộ dịch vụ qua Docker Compose để dễ bảo trì, sao lưu và không tốn chi phí thuê SaaS bên thứ ba.

```mermaid
graph TD
    User["Người dùng (Facebook In-App / Trình duyệt Mobile)"]
    Admin["Quản trị viên (Đăng bài, upload ảnh)"]
    
    subgraph VPS["Hạ tầng VPS Linux (Đã có sẵn)"]
        subgraph ReverseProxy["Nginx & SSL"]
            Certbot["Certbot Let's Encrypt (SSL Miễn phí)"]
            NginxServer["Nginx Reverse Proxy (Port 80 / 443)"]
        end
        
        subgraph DockerServices["Docker Compose Environment"]
            App["Next.js Fullstack App (Port 3000)<br/>- Public Portal<br/>- Admin CMS (/admin)<br/>- Server Actions & API Routes"]
            Postgres[("PostgreSQL Database (Port 5432)")]
            StorageVol["Persistent Volume (/uploads)<br/>Lưu trữ ảnh bài viết trên ổ đĩa VPS"]
        end
    end
    
    User -->|HTTPS Domain| NginxServer
    Admin -->|HTTPS Domain/admin| NginxServer
    NginxServer -->|Proxy Pass| App
    NginxServer -->|Serve Static /uploads| StorageVol
    App -->|Prisma ORM| Postgres
    App -->|Upload Image File| StorageVol
```

---

## 2. Lựa chọn Tech Stack kỹ thuật

| Thành phần | Lựa chọn | Lý do tiết kiệm & tối ưu |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Gộp cả Frontend & Backend API trong 1 tiến trình duy nhất (giảm 50% RAM so với tách riêng FE/BE). Hỗ trợ Server-Side Rendering (SSR) sinh thẻ Open Graph cho Facebook Bot. |
| **Database** | **PostgreSQL (Docker)** | Hệ quản trị CSDL quan hệ chuẩn, mạnh mẽ, bền bỉ, chạy container chỉ tốn ~100MB RAM. |
| **ORM** | **Prisma** | Schema type-safe, tự động generate migrations, dễ query và bảo trì. |
| **Authentication** | **NextAuth.js (Auth.js)** | Xác thực trực tiếp trong Next.js bằng tài khoản Admin bí mật mã hóa bcrypt, không cần dịch vụ auth bên ngoài. |
| **Lưu trữ ảnh** | **Local Volume + Nginx Static Serve** | Lưu file trực tiếp vào thư mục trên ổ đĩa VPS, Nginx làm nhiệm vụ cache và trả ảnh cực nhanh với chi phí 0đ. |
| **Trình soạn thảo** | **TipTap (Headless WYSIWYG)** | Rất nhẹ, hỗ trợ paste ảnh, kéo thả, tạo heading, trích dẫn, code block. |
| **Proxy & SSL** | **Nginx + Let's Encrypt** | Tự động gia hạn chứng chỉ bảo mật HTTPS miễn phí vĩnh viễn. |

---

## 3. Thiết kế CSDL (Database Schema)

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string password
        string name
        string role
        datetime createdAt
    }

    Category {
        string id PK
        string name
        string slug UK
        string description
    }

    Post {
        string id PK
        string title
        string slug UK
        string excerpt
        text content
        string thumbnail
        string status
        int views
        string categoryId FK
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    Tag {
        string id PK
        string name
        string slug UK
    }

    PostTag {
        string postId FK
        string tagId FK
    }

    User ||--o{ Post : "writes"
    Category ||--o{ Post : "contains"
    Post ||--o{ PostTag : "has"
    Tag ||--o{ PostTag : "categorizes"
```

---

## 4. Tối ưu hóa chia sẻ Facebook (Facebook OpenGraph Pipeline)

Khi người dùng dán link bài viết lên Fanpage Facebook:
1. Facebook Crawler gửi request đến URL `https://yourdomain.com/posts/[slug]`.
2. Next.js Server Component render trước mã HTML chứa các thẻ:
   - `<meta property="og:title" content="Tiêu đề bài viết hấp dẫn" />`
   - `<meta property="og:description" content="Tóm tắt nội dung 1-2 câu kích thích tò mò" />`
   - `<meta property="og:image" content="https://yourdomain.com/uploads/thumbnail-1200x630.jpg" />`
   - `<meta property="og:type" content="article" />`
3. Facebook hiển thị bài viết dạng **Card ảnh lớn** (Large Image Card) giúp tăng tỷ lệ click (CTR) từ Fanpage về Website lên gấp 3-5 lần so với card ảnh nhỏ.
