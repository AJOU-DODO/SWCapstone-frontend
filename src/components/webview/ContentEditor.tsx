"use client";

import { useCallback, useRef } from "react";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";

export function ContentEditor() {
  const { content, setContent, errors, clearErrors } = useNestEditorStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
      if (errors.content) clearErrors();

      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    },
    [setContent, errors.content, clearErrors],
  );

  return (
    <div className="space-y-1">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        placeholder="여기에 본문을 작성하세요."
        rows={8}
        className={`w-full resize-none text-sm text-[#3D3830] placeholder:text-[#B0AC9C] leading-relaxed outline-none transition-colors bg-white rounded-xl p-4 shadow-sm${
          errors.content
            ? "border-red-300 placeholder:text-red-300"
            : "border-transparent"
        }`}
        style={{ minHeight: "180px" }}
      />
      {errors.content && (
        <p className="text-xs text-red-400">{errors.content}</p>
      )}
    </div>
  );
}
