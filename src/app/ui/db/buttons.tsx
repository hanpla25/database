import { Loader2, Paperclip, Send } from "lucide-react";

type AttachmentButtonProps = {
  onFileChange?: (file: File | null) => void;
};

export function AttachmentButton({ onFileChange }: AttachmentButtonProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (onFileChange) onFileChange(file);
  };

  return (
    <>
      <label
        htmlFor="attachment"
        className="left-2 top-2 text-gray-500 cursor-pointer inline-flex items-center justify-center w-5 h-5"
      >
        <Paperclip size={18} />
      </label>
      <input
        type="file"
        id="attachment"
        name="attachment"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
export function PostButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-1
        ${isPending ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {isPending ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          등록 중...
        </>
      ) : (
        <>
          <Send size={16} />
          등록
        </>
      )}
    </button>
  );
}
