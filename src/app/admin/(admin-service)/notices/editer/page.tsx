'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/lib/adminApi/notice';
import { SelectBox } from "@/components/admin/SelectBox";

interface NoticeEditorProps {
  mode: 'create' | 'edit'; // 💡 '발행'인지 '수정'인지 구분하는 모드
  initialData?: {          // 💡 수정일 경우 여기에 기존 데이터를 넘겨줌
    title: string;
    content: string;
    category: string;
  };
}

export default function NoticeWritePage({ mode, initialData }: NoticeEditorProps) {
  const router = useRouter();
  
  const [category, setCategory] = useState<'UPDATE' | 'EVENT' | 'POLICY'>((initialData?.category as 'UPDATE' | 'EVENT' | 'POLICY') ?? 'UPDATE');
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");

  const submitText = mode === 'create' ? '발행하기' : '수정하기';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDraft = await createNotice({ category, title, content });
    console.log({ category, title, content });
    router.push(`/admin/notices/${newDraft.data.id}`)
  };

  return (
    <div className="max-w-4xl mx-auto p-10 flex flex-col gap-6">
      {/* 1. 뒤로가기 버튼 */}
      <div className="flex items-center">
        <button 
          onClick={() => router.back()} 
          className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
        >
          ← 뒤로가기
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">공지사항 작성</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* 2. 카테고리 선택 */}
        <div className="flex items-center flex-row gap-10">
          <label className="text-sm font-semibold items-center text-[#54513E]">카테고리</label>
          <SelectBox value={category} onChange={setCategory} />
        </div>

        {/* 3. 제목 작성 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#54513E]">제목</label>
          <input 
            type="text" 
            placeholder="공지사항 제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#54513E]/50 border-2 p-3 rounded-md w-full focus:outline-[#2B6340]"
            required
          />
        </div>

        {/* 4. 본문 작성 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[#54513E]">본문 내용</label>
          <textarea 
            rows={12}
            placeholder="공지사항 내용을 상세히 작성하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-[#54513E]/50 border-2 p-3 rounded-md w-full resize-none focus:outline-[#2B6340]"
            required
          />
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-end gap-4 mt-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-5 py-2.5 border rounded-md hover:bg-gray-50 font-medium"
          >
            취소
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 bg-[#2B6340] text-white rounded-md hover:bg-[#1e462d] font-medium"
          >
            {submitText}
          </button>
        </div>
      </form>
    </div>
  );
}