import Link from "next/link";
import { Users, ArrowUpRight, BookOpen, CheckCircle2 } from "lucide-react";

interface SidebarBannerProps {
  variant?: "default" | "compact";
  className?: string;
}

export default function SidebarBanner({
  variant = "default",
  className = "",
}: SidebarBannerProps) {
  const facebookUrl =
    process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com";
  const telegramUrl =
    process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me";

  if (variant === "compact") {
    return (
      <div
        className={`p-5 bg-[#F9FAFB] border border-[#111827] rounded-[3px] shadow-[4px_4px_0_#111827] flex flex-col gap-3.5 ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold text-[11px] tracking-wide border border-[#BFDBFE]">
            <Users className="w-3 h-3" />
            Cộng đồng FinPulse
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0A7A45]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A7A45] animate-pulse" />
            Online 24/7
          </span>
        </div>

        <h3 className="m-0 font-serif font-bold text-[16px] text-[#111827] leading-[1.3]">
          Kết nối cùng 15.000+ Nhà đầu tư thực chiến
        </h3>

        <p className="m-0 text-[13px] leading-[1.5] text-[#4B5563]">
          Cập nhật tin vĩ mô và bóc tách BCTC sớm nhất mỗi ngày.
        </p>

        <div className="flex flex-col gap-2 pt-1">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-[13px] rounded transition-colors group no-underline"
          >
            <FacebookIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Theo dõi Fanpage Facebook</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 bg-[#229ED9] hover:bg-[#1E8EC4] text-white font-bold text-[13px] rounded transition-colors group no-underline"
          >
            <TelegramIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Tham gia Kênh Telegram</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 bg-[#F9FAFB] border border-[#111827] rounded-[3px] shadow-[4px_4px_0_#111827] flex flex-col gap-4 relative overflow-hidden ${className}`}
    >
      {/* Top Header Badge & Live indicator */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] font-bold text-[11px] tracking-wide border border-[#BFDBFE]">
          <Users className="w-3.5 h-3.5" />
          Cộng đồng Nhà đầu tư
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0A7A45]">
          <span className="w-2 h-2 rounded-full bg-[#0A7A45] animate-pulse" />
          Online 24/7
        </span>
      </div>

      {/* Main Title & Description */}
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 font-serif font-bold text-[18px] text-[#111827] leading-[1.3]">
          Kết nối cùng 15.000+ Nhà đầu tư thực chiến
        </h3>
        <p className="m-0 text-[13.5px] leading-[1.55] text-[#4B5563]">
          Đón đọc bài bóc tách BCTC sớm nhất, cập nhật biến động dòng tiền và cùng trao đổi góc nhìn đa chiều, minh bạch số liệu.
        </p>
      </div>

      {/* Key Features Bullet List */}
      <ul className="m-0 p-0 list-none flex flex-col gap-2 text-[12.5px] text-[#374151]">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A45] shrink-0" />
          <span>Nhận thông báo bài phân tích mới trước giờ mở cửa</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A45] shrink-0" />
          <span>Biểu đồ số liệu & chỉ số định giá P/E, P/B trực quan</span>
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A7A45] shrink-0" />
          <span>Góc nhìn độc lập, không phím hàng lùa gà</span>
        </li>
      </ul>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-[13.5px] rounded transition-all duration-150 shadow-sm group no-underline"
        >
          <FacebookIcon className="w-4 h-4 fill-current shrink-0" />
          <span>Theo dõi Fanpage Facebook</span>
          <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#229ED9] hover:bg-[#1E8EC4] text-white font-bold text-[13.5px] rounded transition-all duration-150 shadow-sm group no-underline"
        >
          <TelegramIcon className="w-4 h-4 fill-current shrink-0" />
          <span>Tham gia Kênh Telegram</span>
          <ArrowUpRight className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
        </a>
      </div>

      {/* Mini Educational Callout */}
      <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[12px]">
        <Link
          href="/thuat-ngu"
          className="text-[#1E40AF] hover:underline font-semibold flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Từ điển thuật ngữ BCTC & Định giá →</span>
        </Link>
      </div>
    </div>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z" />
    </svg>
  );
}
