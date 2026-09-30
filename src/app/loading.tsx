export default function GlobalLoading() {
  return (
    <div className="w-full min-h-screen bg-white text-[#111827]">
      {/* Top indeterminate animated progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#EFF6FF] z-50 overflow-hidden">
        <div className="h-full bg-[#1E40AF] animate-pulse w-full" />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-10 flex flex-col gap-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-[#F3F4F6] rounded w-36" />

        {/* Title skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-10 bg-[#E5E7EB] rounded w-3/4" />
          <div className="h-10 bg-[#E5E7EB] rounded w-1/2" />
        </div>

        {/* Excerpt skeleton */}
        <div className="h-6 bg-[#F3F4F6] rounded w-4/5" />

        {/* Meta bar skeleton */}
        <div className="py-4 border-t border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5E7EB]" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 bg-[#E5E7EB] rounded w-28" />
              <div className="h-3 bg-[#F3F4F6] rounded w-40" />
            </div>
          </div>
          <div className="h-4 bg-[#F3F4F6] rounded w-24" />
        </div>

        {/* Content body skeleton */}
        <div className="flex flex-col gap-4 max-w-[1020px]">
          <div className="h-4 bg-[#F3F4F6] rounded w-full" />
          <div className="h-4 bg-[#F3F4F6] rounded w-full" />
          <div className="h-4 bg-[#F3F4F6] rounded w-5/6" />
          <div className="h-40 bg-[#F9FAFB] border border-[#E5E7EB] rounded mt-4" />
          <div className="h-4 bg-[#F3F4F6] rounded w-full" />
          <div className="h-4 bg-[#F3F4F6] rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}
