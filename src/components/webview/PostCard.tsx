"use client";

import React from "react";
import { Lock, LockOpen, ThumbsUp, Hash, Mail } from "lucide-react";
import Image from "next/image";
import { NestSummary } from "@/app/(webview)/nests/page";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type PostType = "image" | "text";

interface PostCardProps {
  post: NestSummary;
  key?: React.Key;
  selectNest: () => void;
  index: number;
}

export default function PostCard({ post, selectNest, index }: PostCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (post.unlocked) {
      router.prefetch(`/nests/${post.id}`);
    }
  }, [post.id, post.unlocked, router]);

  // staggered animation
  useEffect(() => {
    if (visible) return;
    const timer = setTimeout(() => {
      setVisible(true);
    }, index * 80);
    return () => clearTimeout(timer);
  }, [index, visible]);

  return (
    <div
      onClick={selectNest}
      className={`relative bg-white rounded-[2rem] p-5 shadow-sm border border-[#F0EBE0] mb-6 last:mb-0 cursor-pointer active:scale-[0.99] transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* 이미지 영역 */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden relative">
          {/* skeleton */}
          {post.thumbnailUrl && !imageLoaded && (
            <div className="absolute inset-0 bg-[#F0EBE0] animate-pulse rounded-2xl" />
          )}

          {!post.thumbnailUrl && (
            <div className="absolute inset-0 bg-linear-to-br from-rose-100 to-teal-100" />
          )}

          {post.thumbnailUrl && (
            <Image
              src={post.thumbnailUrl}
              alt="둥지 썸네일"
              fill
              onLoad={() => setImageLoaded(true)}
              className={`object-cover transition-all duration-500 ${
                post.unlocked ? "" : "blur-lg scale-110"
              } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              sizes="(max-width: 768px) 100vw, 448px"
              priority={index === 0}
            />
          )}

          {/* 미해금 오버레이 그라데이션 */}
          {!post.unlocked && (
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          )}

          {/* 미해금 자물쇠 아이콘 */}
          {!post.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Lock size={24} className="text-white/80" />
              </div>
            </div>
          )}

          {/* 엽서 아이콘 */}
          {post.hasPostcard && (
            <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Mail className="w-4 h-4 text-[#3C5A3E]" />
            </div>
          )}

          {/* AD 마크 */}
          {post.ad && (
            <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-bold tracking-wider">
              AD
            </div>
          )}

          {/* 해금 상태 오버레이 */}
          {post.unlocked && imageLoaded && (
            <div className="absolute inset-0 bg-linear-to-t from-[#3C5A3E]/10 to-transparent pointer-events-none" />
          )}
        </div>

        {/* 카테고리 칩 */}
        {post.categoryNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.categoryNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0EBE0] text-[#5C5346] text-[11px] font-medium rounded-full"
              >
                <Hash size={10} />
                {name}
              </span>
            ))}
          </div>
        )}

        {/* 본문 */}
        <p className="text-[#4A4A4A] text-[0.95rem] leading-relaxed line-clamp-2 font-medium">
          {post.content}
        </p>
      </div>

      {/* Bottom Indicator */}
      <div className="mt-4 pt-4 border-t border-[#F8F5F0] flex justify-between items-center">
        {/* 좋아요 */}
        <div className="flex items-center gap-1.5 text-[#A09B8E]">
          <ThumbsUp size={13} />
          <span className="text-xs font-medium">{post.likeCount}</span>
        </div>

        {/* 잠금 상태 */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[0.75rem] font-semibold uppercase tracking-wider ${
              post.unlocked ? "text-[#7A9E5A]" : "text-[#A09B8E]"
            }`}
          >
            {post.unlocked ? "Unlocked" : "Locked"}
          </span>
          <div
            className={`px-3 py-1 rounded-full border ${
              post.unlocked
                ? "bg-[#7A9E5A]/10 border-[#7A9E5A]/20"
                : "bg-[#FAF7E4] border-[#F0EBE0]"
            }`}
          >
            {post.unlocked ? (
              <LockOpen size={12} className="text-[#7A9E5A]" />
            ) : (
              <Lock size={12} className="text-[#A09B8E]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
