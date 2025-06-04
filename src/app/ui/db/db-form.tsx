"use client";

import { AttachmentButton, PostButton } from "./buttons";
import { useActionState, useRef, useState } from "react";
import { post } from "@/app/lib/actions";

export default function DbForm() {
  const [state, formAction, isPending] = useActionState(post, null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleResize = () => {
    const textarea = textareaRef.current;
    const maxLine = 5;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        maxLine * 28
      )}px`;
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };
  return (
    <form
      action={formAction}
      className="fixed bottom-0 w-full bg-white border-t p-4 flex items-end gap-2 pb-8"
    >
      <div className="relative flex-1">
        <AttachmentButton onFileChange={handleFileChange} />
        {/* 파일 이름 표시 */}
        {fileName && (
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {fileName}
          </span>
        )}
        <textarea
          name="text"
          id="text"
          className="w-full scrollbar-hide pl-8 pr-4 py-2 border rounded-2xl focus:outline-none focus:ring resize-none"
          rows={1}
          placeholder="내용을 입력하세요"
          ref={textareaRef}
          onInput={handleResize}
        />
        {state?.message && state.message && (
          <p className="absolute left-2 -bottom-5 text-xs text-red-500">
            {state.message}
          </p>
        )}
      </div>
      <PostButton isPending={isPending} />
    </form>
  );
}
