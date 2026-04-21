"use client";

import React from "react";
import { Lock } from "lucide-react";
import { NestSummary } from "@/app/(webview)/nests/page";

export type PostType = "image" | "text";

/*export interface Post {
  id: number;
  type: PostType;
  hasLeaf: boolean;
  content: string;
  title?: string;
  gradient?: string;
}
  */

interface PostCardProps {
  post: NestSummary;
  key?: React.Key;
}

export default function PostCard({ post }: PostCardProps) {
  //const isImageType = post.type === "image";

  return (
    <div className="relative bg-white rounded-[2rem] p-5 shadow-sm border border-[#F0EBE0] mb-6 last:mb-0">
      {/* Leaf Icon */}
      {/*{post.hasLeaf && (
        <div className="absolute -top-2 -left-2 bg-white rounded-full p-2 shadow-sm border border-[#F0EBE0] z-10">
          <Leaf size={18} className="text-[#3C5A3E] fill-[#3C5A3E]/10" />
        </div>
      )}*/}

      {/*<div
              className={`w-full aspect-[16/9] rounded-2xl bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}
            ></div>*/}

      {/* Content Area */}
      <div className="flex flex-col gap-4">
        {post.thumbnailUrl ? (
          <>
            {/* Mock Image Area */}
            <div
              className="w-full aspect-[16/9] rounded-2xl bg-cover bg- center flex items-center justify-center relative"
              style={{ backgroundImage: `url(${post.thumbnailUrl})` }}
            >
              <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
              <Lock size={32} className="text-white/60 relative z-10" />
            </div>
            {/* Content Text */}
            <p className="text-[#4A4A4A] text-[0.95rem] leading-relaxed line-clamp-2 font-medium">
              {/*post.*/}
            </p>
          </>
        ) : (
          <div className="py-2">
            {/* Title */}
            {post.title && (
              <h3 className="text-[#2D2D2D] text-lg font-bold mb-2 tracking-tight">
                {post.title}
              </h3>
            )}
            {/* Body Text */}
            <p className="text-[#5A5A5A] text-[0.95rem] leading-relaxed line-clamp-4">
              {/*post.message*/}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Lock Indicator */}
      <div className="mt-4 pt-4 border-t border-[#F8F5F0] flex justify-between items-center">
        <span className="text-[0.75rem] text-[#A09B8E] font-semibold uppercase tracking-wider">
          Locked Post
        </span>
        <div className="bg-[#FAF7E4] px-3 py-1 rounded-full border border-[#F0EBE0]">
          <Lock size={12} className="text-[#A09B8E]" />
        </div>
      </div>
    </div>
  );
}
