import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { ABOUT_PAGE_DATA } from "@/data/portalData";

export const metadata = {
  title: "Giới thiệu & Miễn trừ | FinPulse",
  description:
    "Về FinPulse và phương pháp phân tích của Minh Anh. Nguyên tắc nguồn số liệu, cách sử dụng AI và tuyên bố miễn trừ trách nhiệm.",
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
      <main className="max-w-[760px] mx-auto px-6 py-11 pb-20 w-full flex flex-col gap-9">
        <div className="flex flex-col gap-3.5">
          <h1 className="m-0 font-serif font-bold text-[38px] sm:text-[44px] tracking-[-0.02em] text-[#16181D]">
            Về FinPulse
          </h1>
          <p className="m-0 font-serif text-[19px] sm:text-[20px] leading-[1.55] text-[#2B2F36]">
            FinPulse là sổ phân tích cá nhân của Minh Anh. Tôi viết quan điểm
            của mình dựa trên số liệu công khai, không đăng lại hay tổng hợp tin
            từ báo chí.
          </p>
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
