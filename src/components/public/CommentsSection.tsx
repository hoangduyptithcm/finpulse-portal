"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit2,
  Sparkles,
} from "lucide-react";

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
  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Likes state: map commentId -> { liked: boolean, count: number }
  const [likesMap, setLikesMap] = useState<Record<string, { liked: boolean; count: number }>>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Load reader name and liked comments from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("finpulse_reader_name");
      if (storedName) {
        setName(storedName);
      } else {
        setIsEditingName(true);
      }

      // Initialize default likes from localStorage or baseline
      const storedLikes = localStorage.getItem("finpulse_liked_comments");
      const likedIds: string[] = storedLikes ? JSON.parse(storedLikes) : [];

      const initialLikes: Record<string, { liked: boolean; count: number }> = {};
      comments.forEach((c, idx) => {
        const isLiked = likedIds.includes(c.id);
        // Realistic initial like count
        const baseCount = Math.max(1, (idx + 1) * 2 + (c.id.charCodeAt(0) % 5));
        initialLikes[c.id] = {
          liked: isLiked,
          count: isLiked ? baseCount + 1 : baseCount,
        };
      });
      setLikesMap(initialLikes);
    }
  }, [comments.length]);

  // Auto-resize textarea as content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(160, textareaRef.current.scrollHeight)}px`;
    }
  };

  const handleToggleLike = (commentId: string) => {
    setLikesMap((prev) => {
      const current = prev[commentId] || { liked: false, count: 0 };
      const nextLiked = !current.liked;
      const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1);

      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("finpulse_liked_comments");
          let list: string[] = stored ? JSON.parse(stored) : [];
          if (nextLiked) {
            if (!list.includes(commentId)) list.push(commentId);
          } else {
            list = list.filter((id) => id !== commentId);
          }
          localStorage.setItem("finpulse_liked_comments", JSON.stringify(list));
        } catch {}
      }

      return {
        ...prev,
        [commentId]: { liked: nextLiked, count: nextCount },
      };
    });
  };

  const handleReplyClick = (authorName: string) => {
    const mention = `@${authorName} `;
    setContent((prev) => (prev.startsWith(mention) ? prev : `${mention}${prev}`));
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postSlug) return;

    if (!name.trim()) {
      setIsEditingName(true);
      setTimeout(() => nameInputRef.current?.focus(), 50);
      setMessage({ type: "error", text: "Vui lòng nhập tên của bạn trước khi gửi bình luận." });
      return;
    }

    if (!content.trim()) {
      textareaRef.current?.focus();
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
        setIsEditingName(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
        setMessage({
          type: "success",
          text: "Bình luận của bạn đã được đăng thành công!",
        });
        setTimeout(() => setMessage(null), 3500);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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

      if (diffSec < 45) return "Vừa xong";
      if (diffMin < 60) return `${diffMin} phút`;
      if (diffHours < 24) return `${diffHours} giờ`;
      if (diffDays < 7) return `${diffDays} ngày`;

      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // Color generator for avatar based on name string
  const getAvatarBg = (nameStr: string) => {
    const colors = [
      "bg-[#1877F2]", // FB Blue
      "bg-[#059669]", // Emerald
      "bg-[#7C3AED]", // Violet
      "bg-[#EA580C]", // Amber / Orange
      "bg-[#0284C7]", // Sky
      "bg-[#D97706]", // Yellow
      "bg-[#DC2626]", // Red
      "bg-[#475569]", // Slate
    ];
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = (hash << 5) - hash + nameStr.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const userInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : "?";

  return (
    <section className="flex flex-col gap-5 pt-8 border-t border-[#E5E7EB] w-full font-sans">
      {/* Facebook Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E4E6EB]">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#1877F2]" />
          <h2 className="m-0 text-[18px] sm:text-[19px] font-bold text-[#050505]">
            Bình luận
          </h2>
          <span className="text-[13px] font-semibold text-[#65676B] bg-[#F0F2F5] px-2.5 py-0.5 rounded-full tabular-nums">
            {comments.length}
          </span>
        </div>
        <span className="text-[12px] sm:text-[13px] text-[#65676B] hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#1877F2]" />
          Ý kiến đa chiều, tôn trọng góc nhìn và phân tích số liệu
        </span>
      </div>

      {/* Facebook Style Comment Input */}
      <div className="flex items-start gap-3">
        {/* User Avatar */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white text-[14px] sm:text-[15px] shrink-0 shadow-sm ${
            name.trim() ? getAvatarBg(name) : "bg-[#1877F2]"
          }`}
        >
          {userInitial}
        </div>

        {/* Input Bubble */}
        <div className="flex-1 flex flex-col bg-[#F0F2F5] hover:bg-[#EBEDF0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1877F2]/20 focus-within:border-[#1877F2] border border-transparent rounded-[20px] px-4 py-2.5 transition-all shadow-sm">
          {/* Reader Name Selector/Editor */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#E4E6EB]/60 mb-1 text-[12px]">
            {isEditingName || !name.trim() ? (
              <div className="flex items-center gap-2 w-full">
                <span className="text-[#65676B] shrink-0 font-medium">Bạn là:</span>
                <input
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn (VD: Tấn Tới)..."
                  className="flex-1 bg-transparent border-0 outline-none text-[#050505] font-semibold placeholder:text-[#8A8D91] text-[13px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (name.trim()) setIsEditingName(false);
                      textareaRef.current?.focus();
                    }
                  }}
                />
                {name.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      textareaRef.current?.focus();
                    }}
                    className="text-[#1877F2] hover:underline font-semibold text-[12px] bg-transparent border-0 cursor-pointer p-0"
                  >
                    Xong
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#65676B]">
                <span>Bình luận dưới tên</span>
                <strong className="text-[#050505] font-semibold">{name}</strong>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(true);
                    setTimeout(() => nameInputRef.current?.focus(), 50);
                  }}
                  className="text-[#1877F2] hover:underline text-[11px] font-medium bg-transparent border-0 cursor-pointer flex items-center gap-0.5 ml-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Đổi tên</span>
                </button>
              </div>
            )}
          </div>

          {/* Textarea Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder={
              name.trim()
                ? `Viết bình luận công khai dưới tên ${name}...`
                : "Viết bình luận công khai... (Nhấn Enter để gửi)"
            }
            className="w-full bg-transparent border-0 outline-none text-[14px] sm:text-[15px] text-[#050505] placeholder:text-[#65676B] resize-none leading-relaxed min-h-[38px] max-h-[160px]"
          />

          {/* Bottom Actions Row */}
          <div className="flex items-center justify-between pt-1 mt-0.5 border-t border-[#E4E6EB]/40">
            <span className="text-[11px] text-[#8A8D91] hidden sm:inline">
              Nhấn <kbd className="px-1 py-0.5 bg-white border border-[#CCD0D5] rounded text-[10px] font-mono">Enter</kbd> để gửi, <kbd className="px-1 py-0.5 bg-white border border-[#CCD0D5] rounded text-[10px] font-mono">Shift+Enter</kbd> để xuống dòng
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting || !content.trim()}
                title="Gửi bình luận"
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-[13px] font-semibold border-0 transition-all cursor-pointer ${
                  content.trim()
                    ? "bg-[#1877F2] text-white hover:bg-[#166FE5] shadow-sm"
                    : "text-[#BCC0C4] bg-transparent cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Gửi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className={`flex items-center gap-2 p-3 text-[13px] rounded-[8px] animate-in fade-in transition-all ${
            message.type === "success"
              ? "bg-[#E7F3FF] text-[#1877F2] border border-[#1877F2]/20"
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

      {/* Facebook Comments Stream */}
      <div className="flex flex-col gap-3.5 pt-2">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-[#65676B] text-[14px] flex flex-col items-center gap-1.5 bg-[#F0F2F5]/50 rounded-[12px] p-6">
            <MessageCircle className="w-7 h-7 text-[#8A8D91] stroke-[1.5]" />
            <p className="m-0 font-semibold text-[#050505]">Chưa có bình luận nào</p>
            <p className="m-0 text-[13px] text-[#65676B]">
              Hãy là người đầu tiên chia sẻ suy nghĩ và góc nhìn của bạn về bài viết này!
            </p>
          </div>
        ) : (
          comments.map((c) => {
            const initialChar = c.name ? c.name.trim().charAt(0).toUpperCase() : "?";
            const avatarColorClass = getAvatarBg(c.name);
            const likeState = likesMap[c.id] || { liked: false, count: 0 };

            return (
              <div key={c.id} className="flex items-start gap-2.5 group">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] text-white shrink-0 mt-0.5 shadow-sm ${avatarColorClass}`}
                >
                  {initialChar}
                </div>

                {/* Comment Body */}
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <div className="relative max-w-full sm:max-w-[90%]">
                    {/* Facebook Gray Chat Bubble */}
                    <div className="bg-[#F0F2F5] rounded-[18px] px-3.5 py-2 text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-[#E8EAEE] transition-colors">
                      <div className="font-semibold text-[13px] sm:text-[14px] text-[#050505] hover:underline cursor-pointer leading-tight">
                        {c.name}
                      </div>
                      <div className="text-[14px] sm:text-[15px] leading-[1.45] mt-1 text-[#050505] whitespace-pre-line break-words">
                        {c.content}
                      </div>
                    </div>

                    {/* Reaction Badge on Corner of Bubble */}
                    {likeState.count > 0 && (
                      <div
                        onClick={() => handleToggleLike(c.id)}
                        className="absolute -bottom-2 right-2 bg-white rounded-full px-1.5 py-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.2)] border border-[#E4E6EB] flex items-center gap-1 text-[11px] font-semibold text-[#65676B] hover:text-[#1877F2] cursor-pointer transition-transform hover:scale-105"
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                          <ThumbsUp className="w-2.5 h-2.5 fill-white stroke-none" />
                        </span>
                        <span className="tabular-nums">{likeState.count}</span>
                      </div>
                    )}
                  </div>

                  {/* Facebook Comment Actions Bar */}
                  <div className="flex items-center gap-4 pl-3.5 pt-1 text-[12px] font-semibold text-[#65676B]">
                    <button
                      type="button"
                      onClick={() => handleToggleLike(c.id)}
                      className={`border-0 bg-transparent p-0 cursor-pointer text-[12px] font-semibold transition-colors ${
                        likeState.liked
                          ? "text-[#1877F2] font-bold"
                          : "text-[#65676B] hover:underline"
                      }`}
                    >
                      Thích
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReplyClick(c.name)}
                      className="border-0 bg-transparent p-0 cursor-pointer text-[12px] font-semibold text-[#65676B] hover:underline transition-colors"
                    >
                      Phản hồi
                    </button>

                    <span className="text-[12px] font-normal text-[#8A8D91]">
                      {formatCommentTime(c.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
