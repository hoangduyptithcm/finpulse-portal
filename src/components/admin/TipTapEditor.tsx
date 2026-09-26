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
          class: "rounded-sm border border-stone-200 my-4 max-w-full h-auto",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-700 underline underline-offset-4 hover:text-blue-900",
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
          "min-h-[320px] max-h-[600px] overflow-y-auto px-4 py-3 focus:outline-none text-stone-800 text-sm leading-relaxed prose prose-stone max-w-none bg-white",
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
      console.error("Lỗi khi tải ảnh lên bài viết:", err);
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
    <div className="rounded-sm border border-stone-300 bg-white overflow-hidden focus-within:border-stone-800 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-stone-200 bg-stone-50 text-stone-700">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("bold") ? "bg-stone-200 text-stone-950 font-bold" : ""
          }`}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("italic") ? "bg-stone-200 text-stone-950" : ""
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 }) ? "bg-stone-200 text-stone-950 font-bold" : ""
          }`}
          title="Tiêu đề 2 (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 }) ? "bg-stone-200 text-stone-950 font-bold" : ""
          }`}
          title="Tiêu đề 3 (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("bulletList") ? "bg-stone-200 text-stone-950" : ""
          }`}
          title="Danh sách gạch đầu dòng"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("orderedList") ? "bg-stone-200 text-stone-950" : ""
          }`}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("blockquote") ? "bg-stone-200 text-stone-950" : ""
          }`}
          title="Trích dẫn (Quote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer"
          title="Đường phân cách ngang"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer ${
            editor.isActive("link") ? "bg-stone-200 text-stone-950" : ""
          }`}
          title="Chèn link liên kết"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-50"
          title="Chèn ảnh vào bài viết"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </button>

        <div className="w-[1px] h-4 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-30"
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-sm text-xs hover:bg-stone-200 hover:text-stone-900 transition-colors cursor-pointer disabled:opacity-30"
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
