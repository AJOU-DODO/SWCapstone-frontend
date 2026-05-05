"use client";

import { useNestEditorStore } from "@/lib/store/nestEditorStore";

export function TitleInput() {
  const { title, setTitle } = useNestEditorStore();

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="제목을 입력하세요."
      maxLength={50}
      className="w-full bg-transparent text-base font-medium text-[#3D3830] placeholder:text-[#B0AC9C] outline-none"
    />
  );
}
