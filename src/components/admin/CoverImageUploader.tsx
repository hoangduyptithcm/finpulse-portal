"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImageUploader({
  value,
  onChange,
}: CoverImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Tải ảnh thất bại");
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative aspect-[1200/630] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
          <Image
            src={value}
            alt="Cover preview"
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
            >
              Đổi ảnh khác
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors shadow-lg cursor-pointer"
              title="Xóa ảnh bìa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-emerald-400 font-mono border border-slate-800">
            Tỉ lệ chuẩn Facebook 1200x630
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all text-center"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-xs text-slate-400">Đang nén WebP & tải lên VPS...</p>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                <Upload className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Tải lên ảnh bìa đại diện bài viết
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tự động nén WebP chuẩn tỉ lệ 1200x630 hiển thị đẹp trên Facebook
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] text-slate-500 shrink-0">Hoặc URL ảnh:</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-emerald-500/50"
        />
      </div>
    </div>
  );
}
