"use client";

import { useState } from "react";
import { Mail, X } from "lucide-react";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import { PostcardSelectModal } from "./PostcardSelectModal";
import type { MyPostcard } from "@/types/indexMypage";

export function PostcardSelector() {
  const { accessToken, postcardId, postcardTitle, setPostcard, clearPostcard } =
    useNestEditorStore();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (postcard: MyPostcard) => {
    setPostcard(postcard.id, postcard.content);
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-2 gap-1.5">
        <span className="text-s text-[#8B8070] font-medium">엽서</span>

        {postcardId ? (
          // 엽서가 선택된 상태
          <div className="flex items-center gap-2 px-3 py-2 bg-[#EDEAE0] rounded-2xl w-fit">
            <Mail className="w-3.5 h-3.5 text-[#5C5346] shrink-0" />
            <span className="text-xs font-medium text-[#5C5346] max-w-45 truncate">
              {postcardTitle}
            </span>
            <button
              type="button"
              onClick={clearPostcard}
              className="ml-0.5 text-[#8B8070] hover:text-[#5C5346] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          // 엽서가 선택되지 않은 상태
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-[#C8C4B0] text-[#8B8070] text-xs font-medium transition-all active:scale-95 hover:border-[#8B8070] hover:text-[#5C5346]"
          >
            <Mail className="w-3.5 h-3.5" />
            엽서 선택
          </button>
        )}
      </div>

      <PostcardSelectModal
        open={modalOpen}
        accessToken={accessToken ?? ""}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
