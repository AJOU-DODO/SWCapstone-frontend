"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { publishAnswer } from "@/lib/adminApi/inquiry"; 

interface AnswerFormProps {
  inquiryId: number;
}

export default function AnswerForm({ inquiryId }: AnswerFormProps) {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setIsSubmitting(true);

    try {
      await publishAnswer(inquiryId, answer);
      
      setAnswer("");
      router.refresh();
    } catch (error) {
      console.error("답변 등록 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg space-y-3">
      {/* 1. 입력창 */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isSubmitting}
        placeholder="답변을 입력하세요."
        className="w-full min-h-[160px] p-4 border border-gray-300 rounded-lg shadow-sm 
                 focus:ring-2 focus:ring-[#54513E] focus:border-[#54513E] outline-none 
                 transition-all text-sm resize-none bg-white text-gray-800"
      />

      {/* 2. 전송 버튼 */}
      <div className="flex justify-end">
        <button 
        type="submit"
        className="px-6 py-2.5 bg-[#54513E] text-white text-sm font-semibold 
                  rounded-lg shadow hover:bg-[#434031] active:scale-98 transition-all"
        >
          {isSubmitting ? "등록 중..." : "답변 등록"}
        </button>
      </div>
    </form>
  );
}