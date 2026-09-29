"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export interface CommentItem {
  id: string;
  name: string;
  content: string;
  createdAt: string | Date;
}

interface CommentsSectionProps {
  postSlug?: string;
  initialComments?: CommentItem[];
}

export default function CommentsSection({
  postSlug,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("finpulse_reader_name") || "";
    }
    return "";
  });
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postSlug) return;
    if (!name.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập họ tên và nội dung bình luận." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("finpulse_reader_name", name.trim());
      }

      const res = await fetch(`/api/posts/${encodeURIComponent(postSlug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setContent("");
        setMessage({
          type: "success",
          text: "Bình luận của bạn đã được đăng thành công!",
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTime = (time: string | Date) => {
    try {
      const d = new Date(time);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHours = Math.floor(diffMin / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSec < 60) return "Vừa xong";
      if (diffMin < 60) return `${diffMin} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;

      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // Helper avatar background colors based on first letter
  const getAvatarBg = (nameStr: string) => {
    const colors = [
      "bg-[#1E40AF] text-white",
      "bg-[#0A7A45] text-white",
      "bg-[#111827] text-white",
      "bg-[#4F46E5] text-white",
      "bg-[#0369A1] text-white",
      "bg-[#7C3AED] text-white",
    ];
    let sum = 0;
    for (let i = 0; i < nameStr.length; i++) {
      sum += nameStr.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <section className="flex flex-col gap-6 pt-8 border-t border-[#E5E7EB] w-full font-sans">
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 border-b-2 border-[#111827]">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#1E40AF]" />
          <h2 className="m-0 text-[18px] sm:text-[20px] font-bold text-[#111827]">
            Thảo luận & Bình luận
          </h2>
          <span className="text-[13px] font-semibold bg-[#F3F4F6] text-[#4B5563] px-2.5 py-0.5 rounded-full tabular-nums">
            {comments.length}
          </span>
        </div>
        <span className="text-[13px] text-[#6B7280]">
          Ý kiến đa chiều, tôn trọng góc nhìn và phân tích số liệu
        </span>
      </div>

      {/* Form Gửi Bình Luận */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-5 sm:p-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-name" className="text-[13px] font-semibold text-[#111827]">
              Họ và tên <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="comment-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="px-3.5 py-2 text-[14px] bg-white border border-[#D1D5DB] rounded-[3px] text-[#111827] outline-none focus:border-[#1E40AF] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comment-email" className="text-[13px] font-semibold text-[#111827]">
              Email <span className="text-[#6B7280] font-normal">(Không hiển thị công khai)</span>
            </label>
            <input
              id="comment-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="VD: reader@gmail.com"
              className="px-3.5 py-2 text-[14px] bg-white border border-[#D1D5DB] rounded-[3px] text-[#111827] outline-none focus:border-[#1E40AF] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment-content" className="text-[13px] font-semibold text-[#111827]">
            Nội dung bình luận <span className="text-[#DC2626]">*</span>
          </label>
          <textarea
            id="comment-content"
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ quan điểm, phản biện số liệu hoặc đặt câu hỏi về bài phân tích này..."
            className="px-3.5 py-2.5 text-[14px] leading-[1.6] bg-white border border-[#D1D5DB] rounded-[3px] text-[#111827] outline-none focus:border-[#1E40AF] resize-y min-h-[90px] transition-colors"
          />
        </div>

        {message && (
          <div
            className={`flex items-center gap-2 p-3 text-[13px] rounded-[3px] ${
              message.type === "success"
                ? "bg-[#E6F4EA] text-[#0A7A45] border border-[#B7E1CD]"
                : "bg-[#FDE8E8] text-[#C0271D] border border-[#F8B4B4]"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !content.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-[14px] font-semibold rounded-[3px] border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi bình luận</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="flex flex-col gap-4 mt-2">
        {comments.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-[#E5E7EB] rounded-[4px] text-[#6B7280] text-[14px] flex flex-col items-center gap-2">
            <MessageSquare className="w-8 h-8 text-[#9CA3AF] stroke-[1.5]" />
            <p className="m-0">Chưa có bình luận nào cho bài viết này.</p>
            <p className="m-0 text-[13px] text-[#9CA3AF]">
              Hãy là người đầu tiên chia sẻ suy nghĩ và góc nhìn của bạn!
            </p>
          </div>
        ) : (
          comments.map((c) => {
            const initialChar = c.name ? c.name.trim().charAt(0).toUpperCase() : "?";
            const avatarColorClass = getAvatarBg(c.name);

            return (
              <div
                key={c.id}
                className="flex gap-3.5 p-4 sm:p-5 bg-white border border-[#E5E7EB] rounded-[3px] transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0 ${avatarColorClass}`}
                >
                  {initialChar}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-[15px] text-[#111827]">
                      {c.name}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      {formatCommentTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="m-0 text-[14px] leading-[1.6] text-[#374151] whitespace-pre-line break-words">
                    {c.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
