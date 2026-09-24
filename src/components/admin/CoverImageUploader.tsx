"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

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
        <div className="relative aspect-[1200/630] w-full rounded-sm overflow-hidden border border-stone-200 bg-stone-100 group">
          <Image
            src={value}
            alt="Cover preview"
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
          />
          <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-sm bg-white text-stone-900 text-xs font-semibold hover:bg-stone-100 transition-colors shadow cursor-pointer"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors shadow cursor-pointer"
              title="Xóa ảnh bìa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-stone-900/80 text-[10px] text-white font-mono">
            Chuẩn Facebook 1200x630
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-stone-300 hover:border-stone-800 rounded-sm p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-stone-50/60 hover:bg-stone-50 transition-all text-center"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-stone-600" />
              <p className="text-xs text-stone-500">Đang nén WebP & tải lên...</p>
            </div>
          ) : (
            <>
              <div className="p-2.5 rounded-full bg-white text-stone-600 border border-stone-200">
                <Upload className="w-4 h-4 text-stone-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-800">
                  Tải lên ảnh bìa bài viết
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Tự động nén WebP chuẩn 1200x630 cho Facebook
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] text-stone-500 shrink-0">Hoặc URL ảnh:</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
        />
      </div>
    </div>
  );
}
