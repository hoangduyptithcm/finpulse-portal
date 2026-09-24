"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung phân tích tài chính...",
}: TipTapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rounded-xl border border-slate-700/60 my-4 max-w-full h-auto shadow-md",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-400 underline underline-offset-4 hover:text-emerald-300",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] max-h-[600px] overflow-y-auto px-4 py-3 focus:outline-none text-slate-200 text-sm leading-relaxed prose prose-invert prose-emerald max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Tải ảnh thất bại");
      }

      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      alert("Lỗi khi tải ảnh lên bài viết: " + (err as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Nhập đường dẫn liên kết (URL):", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden focus-within:border-emerald-500/50 transition-colors">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-800 bg-slate-900/60 text-slate-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("bold") ? "bg-emerald-500/20 text-emerald-400 font-bold" : ""
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("italic") ? "bg-emerald-500/20 text-emerald-400" : ""
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "bg-emerald-500/20 text-emerald-400 font-bold" : ""
          }`}
          title="Tiêu đề 2 (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 }) ? "bg-emerald-500/20 text-emerald-400 font-bold" : ""
          }`}
          title="Tiêu đề 3 (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("bulletList") ? "bg-emerald-500/20 text-emerald-400" : ""
          }`}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("orderedList") ? "bg-emerald-500/20 text-emerald-400" : ""
          }`}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("blockquote") ? "bg-emerald-500/20 text-emerald-400" : ""
          }`}
          title="Trích dẫn (Quote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title="Đường phân cách ngang"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer ${
            editor.isActive("link") ? "bg-emerald-500/20 text-emerald-400" : ""
          }`}
          title="Chèn link liên kết"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Chèn ảnh vào bài viết"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
