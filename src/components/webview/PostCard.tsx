"use client";

import React from "react";
import { Lock, LockOpen, ThumbsUp, Hash, Mail } from "lucide-react";
import Image from "next/image";
import { NestSummary } from "@/app/(webview)/nests/page";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type PostType = "image" | "text";

interface PostCardProps {
  post: NestSummary;
  key?: React.Key;
  selectNest: () => void;
}

export default function PostCard({ post, selectNest }: PostCardProps) {
  const router = useRouter();
  useEffect(() => {
    if (post.unlocked) {
      router.prefetch(`/nests/${post.id}`);
    }
  });
  return (
    <div
      onClick={selectNest}
      className="relative bg-white rounded-[2rem] p-5 shadow-sm border border-[#F0EBE0] mb-6 last:mb-0 cursor-pointer active:scale-[0.99] transition-transform"
    >
      <div className="flex flex-col gap-4">
        {/* 이미지 영역 */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden relative bg-linear-to-br from-rose-100 to-teal-100">
          {post.thumbnailUrl && (
            <Image
              src={post.thumbnailUrl}
              alt="둥지 썸네일"
              fill
              className={`object-cover transition-all duration-300 ${
                post.unlocked ? "" : "blur-lg scale-110"
              }`}
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />
          )}
          {/* 미해금 상태에서만 자물쇠 아이콘 */}
          {!post.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock size={32} className="text-white/60" />
            </div>
          )}
          {/* 엽서가 있을 때만 엽서 아이콘 활성화 */}
          {post.hasPostcard && (
            <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#3C5A3E]" />
            </div>
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
          <span className="text-[0.75rem] text-[#A09B8E] font-semibold uppercase tracking-wider">
            {post.unlocked ? "Unlocked" : "Locked"}
          </span>
          <div className="bg-[#FAF7E4] px-3 py-1 rounded-full border border-[#F0EBE0]">
            {post.unlocked ? (
              <LockOpen size={12} className="text-[#3C5A3E]" />
            ) : (
              <Lock size={12} className="text-[#A09B8E]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
