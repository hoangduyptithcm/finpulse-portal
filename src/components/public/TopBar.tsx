export default function TopBar() {
  const today = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const formattedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="bg-white text-[13px] text-[#4B5563] border-b border-[#E5E7EB]">
      <div className="max-w-[1240px] mx-auto px-6 min-h-[36px] py-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <span className="font-medium text-[#4B5563]">
          {formattedDate}
        </span>
        <span className="flex items-center gap-5">
          <a
            href="#newsletter"
            className="text-[#4B5563] hover:text-[#111827] transition-colors font-medium"
          >
            Bản tin email
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4B5563] hover:text-[#111827] transition-colors font-medium"
          >
            Fanpage
          </a>
        </span>
      </div>
    </div>
  );
}
