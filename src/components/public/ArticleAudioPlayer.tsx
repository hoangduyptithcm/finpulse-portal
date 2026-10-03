"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Headphones,
  Volume2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

interface ArticleAudioPlayerProps {
  title: string;
  excerpt?: string | null;
  content?: string | null;
  shortAnswer?: string | null;
  shortAnswerBullets?: string[] | null;
}

type AudioMode = "summary" | "full";

export const VOICE_OPTIONS = [
  { id: "duet", label: "🎙️ Song ca Nam & Nữ (Xen kẽ)", desc: "Xen kẽ Diễm Trinh & Hưng Thịnh" },
  { id: "diem_trinh", label: "👩 Diễm Trinh (Nữ - Truyền cảm)", desc: "Trầm ấm, diễn cảm tự nhiên" },
  { id: "hung_thinh", label: "👨 Hưng Thịnh (Nam - Trầm ấm)", desc: "Trầm, dứt khoát, tin cậy" },
  { id: "mai_linh", label: "👩 Mai Linh (Nữ - Trong trẻo)", desc: "Tươi sáng, năng động" },
  { id: "duc_an", label: "👨 Đức An (Nam - Phát thanh viên)", desc: "Ấm áp, phát thanh viên" },
];

export default function ArticleAudioPlayer({
  title,
  excerpt,
  content,
  shortAnswer,
  shortAnswerBullets,
}: ArticleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AudioMode>("summary");
  const [voice, setVoice] = useState<string>("duet");
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const [isVoiceMenuOpen, setIsVoiceMenuOpen] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobCache = useRef<Record<string, string>>({});

  // Prepare clean text for summary
  const summaryText = useMemo(() => {
    const parts: string[] = [title];
    if (shortAnswer) {
      parts.push("Tóm tắt quan điểm: " + shortAnswer);
    }
    if (shortAnswerBullets && shortAnswerBullets.length > 0) {
      parts.push(shortAnswerBullets.join(". "));
    }
    if (excerpt && !shortAnswer) {
      parts.push("Tóm tắt nội dung: " + excerpt);
    }
    return parts.join(". ");
  }, [title, shortAnswer, shortAnswerBullets, excerpt]);

  // Prepare clean text for full reading
  const fullText = useMemo(() => {
    let body = "";
    if (content) {
      // Strip HTML tags and entities, maintaining pauses between blocks and tables
      body = content
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<\/(p|div|h[1-6]|li|tr|table|blockquote)>/gi, ". ")
        .replace(/<(br|hr)\s*\/?>/gi, ". ")
        .replace(/<\/td>\s*<td[^>]*>/gi, ", ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    }
    // Limit to reasonable full briefing
    return `${title}. ${summaryText}. ${body}`.slice(0, 3200).trim();
  }, [title, summaryText, content]);

  // Format MM:SS helper
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  // IntersectionObserver to show sticky mini-bar when scrolled past main player
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (playerRef.current) {
      observer.observe(playerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Revoke any blob URLs
      Object.values(audioBlobCache.current).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Fetch or retrieve audio blob URL for given mode and voice
  const getAudioUrl = async (
    targetMode: AudioMode,
    targetVoice: string = voice
  ): Promise<string> => {
    const cacheKey = `${targetMode}_${targetVoice}`;
    if (audioBlobCache.current[cacheKey]) {
      return audioBlobCache.current[cacheKey];
    }

    const textToRead = targetMode === "summary" ? summaryText : fullText;
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textToRead, voice: targetVoice }),
    });

    if (!res.ok) {
      throw new Error(`TTS server error: ${res.status}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioBlobCache.current[cacheKey] = url;
    return url;
  };

  // Switch voice dynamically
  const handleVoiceChange = async (newVoice: string) => {
    if (newVoice === voice) {
      setIsVoiceMenuOpen(false);
      return;
    }
    setIsVoiceMenuOpen(false);
    setVoice(newVoice);

    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsLoading(true);

    try {
      const url = await getAudioUrl(mode, newVoice);
      const audio = new Audio(url);
      audio.playbackRate = playbackRate;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = (e) => {
        console.error("[Audio Player Error]:", e);
        setIsPlaying(false);
        setIsLoading(false);
      };

      audioRef.current = audio;
      if (wasPlaying) {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("[Voice Switch Error]:", err);
      setIsLoading(false);
    }
  };

  // Initialize or play audio
  const handlePlay = async () => {
    try {
      if (audioRef.current && audioRef.current.src) {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      setIsLoading(true);
      const url = await getAudioUrl(mode);

      const audio = new Audio(url);
      audio.playbackRate = playbackRate;

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = (e) => {
        console.error("[Audio Player Error]:", e);
        setIsPlaying(false);
        setIsLoading(false);
      };

      audioRef.current = audio;
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error("[Audio Playback Error]:", err);
      setIsLoading(false);
      setIsPlaying(false);
      alert("Không thể tải giọng đọc Tiếng Việt lúc này. Vui lòng thử lại sau ít giây.");
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleRewind10 = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.currentTime - 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleForward10 = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = ratio * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleModeChange = async (newMode: AudioMode) => {
    if (newMode === mode) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setMode(newMode);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    setIsSpeedMenuOpen(false);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Main In-Article Audio Player Card */}
      <div
        ref={playerRef}
        className="w-full my-6 p-4 sm:p-5 bg-[#F9FAFB] border border-[#111827] rounded-[3px] shadow-[3px_3px_0_#111827] flex flex-col gap-4 font-sans select-none transition-all"
      >
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-full bg-[#111827] text-white">
              <Headphones className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-[13.5px] text-[#111827] flex items-center gap-1.5">
                Bản tin âm thanh AI
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]">
                  <Sparkles className="w-2.5 h-2.5" />
                  Giọng đọc Tiếng Việt chuẩn
                </span>
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-0.5 bg-[#E5E7EB] rounded-[3px] text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => handleModeChange("summary")}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer border-0 ${
                mode === "summary"
                  ? "bg-white text-[#111827] shadow-sm font-bold"
                  : "bg-transparent text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              ⚡ Tóm tắt nhanh
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("full")}
              className={`px-3 py-1 rounded-[2px] transition-all cursor-pointer border-0 ${
                mode === "full"
                  ? "bg-white text-[#111827] shadow-sm font-bold"
                  : "bg-transparent text-[#4B5563] hover:text-[#111827]"
              }`}
            >
              📖 Toàn văn bài viết
            </button>
          </div>
        </div>

        {/* Center Control Panel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Main Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={handleTogglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? "Tạm dừng" : "Phát âm thanh"}
              className="w-12 h-12 rounded-full bg-[#111827] hover:bg-[#1E40AF] active:scale-95 disabled:opacity-70 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 border-0"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Rewind 10s */}
            <button
              type="button"
              onClick={handleRewind10}
              title="Lùi lại 10 giây"
              className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-gray-100 text-[#4B5563] flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Forward 10s */}
            <button
              type="button"
              onClick={handleForward10}
              title="Tua tới 10 giây"
              className="w-8 h-8 rounded-full border border-[#D1D5DB] bg-white hover:bg-gray-100 text-[#4B5563] flex items-center justify-center cursor-pointer transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Sound Wave Equalizer (Animated when playing) */}
            <div className="flex items-end gap-1 h-6 px-2">
              {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((height, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${height}%` : "20%",
                    transition: "height 0.25s ease",
                    animationDuration: `${0.4 + (i % 4) * 0.15}s`,
                  }}
                  className={`w-1 rounded-full bg-[#1E40AF] ${
                    isPlaying ? "animate-pulse" : "opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Time & Speed Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Timestamp */}
            <span className="font-mono text-[12.5px] font-semibold text-[#4B5563] tabular-nums">
              {isLoading ? (
                <span className="text-[#1E40AF] flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Đang tải giọng đọc...
                </span>
              ) : (
                `${formatTime(currentTime)} / ${formatTime(duration)}`
              )}
            </span>

            {/* Voice Selector Dropdown (Song ca Nam Nữ / Đơn giọng) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsVoiceMenuOpen(!isVoiceMenuOpen);
                  setIsSpeedMenuOpen(false);
                }}
                title="Chọn giọng đọc AI hoặc song ca"
                className="px-2.5 py-1 bg-white border border-[#D1D5DB] rounded text-[12px] font-bold text-[#111827] hover:border-[#111827] flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>
                  {VOICE_OPTIONS.find((v) => v.id === voice)?.label ||
                    "🎙️ Giọng đọc"}
                </span>
                {isVoiceMenuOpen ? (
                  <ChevronUp className="w-3 h-3 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                )}
              </button>

              {isVoiceMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#111827] shadow-[3px_3px_0_#111827] rounded py-1 z-30 min-w-[230px] flex flex-col">
                  <div className="px-3 py-1 border-b border-[#E5E7EB] text-[10.5px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Chọn giọng đọc AI Kokoro
                  </div>
                  {VOICE_OPTIONS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVoiceChange(v.id)}
                      className={`px-3 py-2 text-left hover:bg-[#EFF6FF] cursor-pointer transition-colors border-0 bg-transparent flex flex-col gap-0.5 ${
                        voice === v.id ? "bg-[#F3F4F6]" : ""
                      }`}
                    >
                      <span
                        className={`text-[12px] font-bold flex items-center justify-between ${
                          voice === v.id ? "text-[#1E40AF]" : "text-[#111827]"
                        }`}
                      >
                        {v.label}
                        {voice === v.id && (
                          <span className="text-[10px] bg-[#EFF6FF] text-[#1E40AF] px-1.5 py-0.2 rounded font-bold">
                            Đang chọn
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        {v.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Playback Speed Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsSpeedMenuOpen(!isSpeedMenuOpen);
                  setIsVoiceMenuOpen(false);
                }}
                className="px-2 py-1 bg-white border border-[#D1D5DB] rounded text-[12px] font-bold text-[#111827] hover:border-[#111827] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{playbackRate}x</span>
                {isSpeedMenuOpen ? (
                  <ChevronUp className="w-3 h-3 text-[#6B7280]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                )}
              </button>

              {isSpeedMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#111827] shadow-[2px_2px_0_#111827] rounded py-1 z-30 min-w-[72px] flex flex-col">
                  {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-3 py-1 text-[12px] text-left hover:bg-[#EFF6FF] hover:text-[#1E40AF] cursor-pointer transition-colors border-0 bg-transparent ${
                        playbackRate === rate
                          ? "font-bold text-[#1E40AF]"
                          : "text-[#374151]"
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar (Clickable/Scrubbable) */}
        <div
          onClick={handleSeek}
          className="w-full h-2 bg-[#E5E7EB] rounded-full cursor-pointer overflow-hidden relative group"
        >
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-[#1E40AF] transition-[width] duration-150 relative"
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#111827] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Sticky Floating Audio Bar (Only visible when user scrolls down and audio is active) */}
      {(isPlaying || currentTime > 0) && isStickyVisible && (
        <aside
          aria-label="Trình phát âm thanh nổi"
          className="fixed bottom-3 right-3 sm:right-6 z-40 max-w-[360px] w-[calc(100%-24px)] bg-[#111827] text-white p-3.5 rounded-[4px] shadow-2xl border border-gray-700 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Tạm dừng audio" : "Phát audio"}
              className="w-9 h-9 rounded-full bg-white text-[#111827] hover:bg-[#EFF6FF] flex items-center justify-center shrink-0 cursor-pointer border-0 shadow"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-bold text-white line-clamp-1">
                {title}
              </span>
              <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {mode === "summary" ? "Tóm tắt" : "Toàn văn"} · {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                playerRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              title="Cuộn về trình phát"
              className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              title="Dừng và đóng"
              className="p-1.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer border-0 bg-transparent font-bold text-[13px]"
            >
              ✕
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
