"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories,
  getPresignedUrls,
  uploadImageToS3,
} from "@/lib/apiAdvertiser";
import MapPicker from "./MapPicker";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";

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

interface ImageItem {
  url: string;
  file: File | null;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>(
    initialData?.imageUrls?.map((url) => ({ url, file: null })) ?? [],
  );

  const activeBlobUrls = useRef<Set<string>>(new Set());

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

  useEffect(() => {
    return () => {
      activeBlobUrls.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const newImages = selected.map((file) => {
      const url = URL.createObjectURL(file);
      activeBlobUrls.current.add(url);
      return { url, file };
    });

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const removeFile = (index: number) => {
    const target = images[index];
    if (target.file) {
      URL.revokeObjectURL(target.url);
      activeBlobUrls.current.delete(target.url);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((cid) => cid !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      const existingUrls = images
        .filter((img) => img.file === null)
        .map((img) => img.url);

      const newFiles = images
        .filter((img) => img.file !== null)
        .map((img) => img.file as File);

      let imageUrls: string[] = [...existingUrls];

      if (newFiles.length > 0) {
        const fileNames = newFiles.map(
          (file, i) => `ad_${Date.now()}_${i}.${file.name.split(".").pop()}`,
        );
        const presignedData = await getPresignedUrls(fileNames);

        await Promise.all(
          presignedData.data.map((item: { presignedUrl: string }, i: number) =>
            uploadImageToS3(item.presignedUrl, newFiles[i]),
          ),
        );

        const newUrls = presignedData.data.map(
          (item: { fileUrl: string }) => item.fileUrl,
        );
        imageUrls = [...imageUrls, ...newUrls];
      }

      onSubmit({ ...form, imageUrls });
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isSubmitting || isUploading;

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

      {/* 이미지 업로드 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">이미지</label>
        <div className="flex flex-wrap gap-2">
          {/* 미리보기 */}
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
            >
              <Image
                src={image.url}
                alt={`미리보기 ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={image.file !== null}
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}

          {/* 파일 추가 버튼 */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 hover:border-[#538752] hover:bg-gray-50 transition-colors"
          >
            <ImagePlus className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">추가</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1 h-11 rounded-lg border-2 border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 h-11 rounded-lg bg-[#538752] text-white text-sm font-semibold hover:bg-[#2B6340] transition-colors disabled:opacity-50"
        >
          {isPending ? "처리 중..." : submitLabel}
        </button>
      </div>
    </div>
  );
}
