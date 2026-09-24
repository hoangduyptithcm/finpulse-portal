"use client";

import { useState } from "react";
import { Share2, Check, Copy, Send } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(fbUrl, "_blank", "width=600,height=500");
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(tgUrl, "_blank", "width=600,height=500");
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Chia sẻ:</span>
      </span>

      {/* Facebook Share Button */}
      <button
        type="button"
        onClick={handleFacebookShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        title="Chia sẻ lên Facebook"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>Facebook</span>
      </button>

      {/* Telegram Share Button */}
      <button
        type="button"
        onClick={handleTelegramShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
        title="Chia sẻ qua Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Telegram</span>
      </button>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
        title="Sao chép liên kết"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Đã chép link!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Sao chép link</span>
          </>
        )}
      </button>
    </div>
  );
}
