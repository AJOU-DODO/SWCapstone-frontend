"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/lib/apiAdvertiser";
import MapPicker from "./MapPicker";

interface Category {
  id: number;
  name: string;
}

export interface AdProposalFormData {
  title: string;
  content: string;
  latitude: string;
  longitude: string;
  unlockRadius: number;
  imageUrls: string[];
  categoryIds: number[];
}

interface Props {
  initialData?: Partial<AdProposalFormData>;
  isSubmitting: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (data: AdProposalFormData) => void;
}

export default function AdProposalForm({
  initialData,
  isSubmitting,
  error,
  submitLabel,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<AdProposalFormData>({
    title: initialData?.title ?? "",
    content: initialData?.content ?? "",
    latitude: initialData?.latitude ?? "",
    longitude: initialData?.longitude ?? "",
    unlockRadius: initialData?.unlockRadius ?? 10,
    imageUrls: initialData?.imageUrls ?? [""],
    categoryIds: initialData?.categoryIds ?? [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("카테고리 로딩 실패:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index: number, value: string) => {
    setForm((prev) => {
      const newUrls = [...prev.imageUrls];
      newUrls[index] = value;
      return { ...prev, imageUrls: newUrls };
    });
  };

  const addImageUrl = () => {
    setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const removeImageUrl = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const toggleCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id],
    }));
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-5">
      {/* 제목 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="광고 제목을 입력하세요."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#538752]/30"
        />
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="광고 내용을 입력하세요."
          rows={4}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#538752]/30 resize-none"
        />
      </div>

      {/* 위도 / 경도 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">위치 선택</label>
        <MapPicker
          onLocationSelect={(lat, lng) => {
            setForm((prev) => ({
              ...prev,
              latitude: String(lat),
              longitude: String(lng),
            }));
          }}
        />
        {form.latitude && form.longitude && (
          <p className="text-xs text-gray-400">
            위도: {Number(form.latitude).toFixed(6)} / 경도:{" "}
            {Number(form.longitude).toFixed(6)}
          </p>
        )}
      </div>

      {/* 해금 반경 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">해금 반경</label>
        <div className="flex items-center gap-4">
          {[10, 150].map((radius) => (
            <label
              key={radius}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <input
                type="radio"
                name="unlockRadius"
                value={radius}
                checked={form.unlockRadius === radius}
                onChange={() =>
                  setForm((prev) => ({ ...prev, unlockRadius: radius }))
                }
                className="accent-[#538752]"
              />
              <span className="text-sm text-gray-700">{radius}m</span>
            </label>
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">카테고리</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                form.categoryIds.includes(cat.id)
                  ? "bg-[#538752] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 이미지 URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">이미지 URL</label>
        <div className="flex flex-col gap-2">
          {form.imageUrls.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#538752]/30"
              />
              {form.imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageUrl(index)}
                  className="text-red-400 hover:text-red-600 text-sm transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageUrl}
            className="text-[#538752] text-sm hover:underline text-left"
          >
            + 이미지 URL 추가
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 h-11 rounded-lg border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => onSubmit(form)}
          disabled={isSubmitting}
          className="flex-1 h-11 rounded-lg bg-[#538752] text-white text-sm font-semibold hover:bg-[#2B6340] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "처리 중..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
