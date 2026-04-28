"use client";

import React from "react";
import { Leaf } from "lucide-react";

export default function FeedHeader() {
  return (
    <header className="mb-10 text-center">
      <div className="inline-block mb-4">
        <div className="bg-[#3C5A3E] p-3 rounded-2xl shadow-lg shadow-[#3C5A3E]/20">
          <Leaf className="text-white" size={24} />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-[#2D2D2D] tracking-tight mb-2">
        게시물
      </h1>
      <p className="text-[#8E8A7E] text-sm font-medium">
        주변의 소중한 이야기들이 당신을 기다리고 있어요
      </p>
    </header>
  );
}
