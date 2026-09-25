import Link from "next/link";

export default function TopBar() {
  return (
    <div className="bg-[#EEEAE2] text-[13px] text-[#2B2F36] border-b border-[#E3E1DC]">
      <div className="max-w-[1240px] mx-auto px-6 min-h-[34px] py-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="font-semibold">
          Quan điểm cá nhân – không phải cơ quan báo chí
        </span>
        <span className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Giới thiệu và miễn trừ
          </Link>
          <a
            href="#newsletter"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Nhận bài qua email
          </a>
        </span>
      </div>
    </div>
  );
}
