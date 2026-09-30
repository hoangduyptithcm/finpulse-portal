import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { ABOUT_PAGE_DATA } from "@/data/portalData";

export const metadata = {
  title: "Giới thiệu & Miễn trừ | Nhịp đập tài chính",
  description:
    "Về Nhịp đập tài chính và phương pháp phân tích của Minh Anh. Nguyên tắc nguồn số liệu, cách sử dụng AI và tuyên bố miễn trừ trách nhiệm.",
};

export default function AboutPage() {
  const { useSrc, noSrc, process } = ABOUT_PAGE_DATA;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Navbar */}
      <Navbar />

      {/* 3. Screen 09: Giới thiệu */}
      <main className="max-w-[800px] mx-auto px-6 py-11 pb-20 w-full flex flex-col gap-9">
        <div className="flex flex-col gap-3.5">
          <h1 className="m-0 font-serif font-bold text-[38px] sm:text-[44px] tracking-[-0.02em] text-[#16181D]">
            Về Nhịp đập tài chính
          </h1>
          <p className="m-0 font-serif text-[18px] sm:text-[19px] leading-[1.6] text-[#2B2F36]">
            Nhịp đập tài chính là sổ phân tích cá nhân của Minh Anh. Chúng tôi theo đuổi nguyên tắc <strong>minh bạch nguồn gốc dữ liệu tuyệt đối</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[14px] leading-[1.55] text-[#374151]">
            <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[3px]">
              <strong className="text-[#1E40AF] block mb-1">🟢 Phân tích chuyên sâu & BCTC:</strong>
              Tự tay bóc tách từ Báo cáo tài chính kiểm toán, nghị quyết công bố thông tin trên HOSE/HNX và Ủy ban Chứng khoán Nhà nước.
            </div>
            <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[3px]">
              <strong className="text-[#111827] block mb-1">🔵 Điểm tin & Sự kiện thị trường:</strong>
              Chắt lọc từ nguồn báo chí kinh tế chính thống (CafeF, VnEconomy...), luôn ghi rõ link nguồn trích dẫn, nói không với tin đồn vô căn cứ.
            </div>
          </div>
        </div>

        {/* Nguồn số liệu so sánh: Tôi dùng vs Tôi không dùng */}
        <div id="nguon-so-lieu" className="grid grid-cols-1 sm:grid-cols-2 gap-5 scroll-mt-24">
          <div className="flex flex-col gap-2.5 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px]">
            <strong className="text-[15px] text-[#0A7A45]">Tôi dùng</strong>
            {useSrc.map((x) => (
              <span
                key={x}
                className="text-[15px] leading-[1.5] pt-2 border-t border-[#E5E7EB] text-[#374151]"
              >
                {x}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px]">
            <strong className="text-[15px] text-[#C0271D]">Tôi không dùng</strong>
            {noSrc.map((x) => (
              <span
                key={x}
                className="text-[15px] leading-[1.5] pt-2 border-t border-[#E5E7EB] text-[#374151]"
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        {/* Quy trình dùng AI */}
        <section className="flex flex-col gap-3">
          <h2 className="m-0 text-[22px] font-bold text-[#111827]">
            Tôi dùng AI như thế nào
          </h2>
          <ol className="m-0 p-0 list-none flex flex-col">
            {process.map((p) => (
              <li
                key={p.n}
                className="flex gap-4 py-3.5 border-t border-[#E5E7EB] text-[16px] leading-[1.55]"
              >
                <span className="font-serif font-bold text-[22px] leading-[1.1] text-[#1D4ED8] w-5 flex-shrink-0">
                  {p.n}
                </span>
                <span className="text-[#374151]">{p.text}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Miễn trừ trách nhiệm */}
        <section
          id="mien-tru"
          className="flex flex-col gap-2.5 p-6 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[2px] scroll-mt-24"
        >
          <h2 className="m-0 text-[18px] font-bold text-[#111827]">
            Miễn trừ trách nhiệm
          </h2>
          <p className="m-0 text-[16px] leading-[1.6] text-[#374151]">
            Nội dung do tác giả biên soạn với hỗ trợ công cụ AI, mang tính trao
            đổi kiến thức. Không phải thông tin báo chí, không phải khuyến nghị
            mua/bán. Số liệu lấy từ nguồn công bố; nhà đầu tư tự kiểm chứng.
          </p>
        </section>

        {/* Liên hệ */}
        <section
          id="lien-he"
          className="flex flex-col gap-1.5 text-[16px] leading-[1.6] scroll-mt-24"
        >
          <h2 className="m-0 text-[18px] font-bold text-[#16181D]">Liên hệ</h2>
          <span className="text-[#2B2F36]">
            Góp ý số liệu sai hoặc cần đính chính:{" "}
            <a
              href="mailto:lienhe@finpulse.vn"
              className="font-semibold text-[#133A63] hover:underline"
            >
              lienhe@finpulse.vn
            </a>
            . Tôi sửa bài và ghi rõ ngày đính chính.
          </span>
        </section>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
