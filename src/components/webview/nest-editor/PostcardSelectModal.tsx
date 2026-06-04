"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchUserPostcards } from "@/lib/apiMypage";
import type { MyPostcard } from "@/types/indexMypage";

interface Props {
  open: boolean;
  accessToken: string;
  onClose: () => void;
  onSelect: (postcard: MyPostcard) => void;
}

export function PostcardSelectModal({
  open,
  accessToken,
  onClose,
  onSelect,
}: Props) {
  const [selectedPostcard, setSelectedPostcard] = useState<MyPostcard | null>(
    null,
  );
  const [warning, setWarning] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["userPostcard", accessToken],
    queryFn: () => fetchUserPostcards(accessToken, "CREATED_NOT_SHARED", 0),
    enabled: open && !!accessToken,
    staleTime: 0,
  });

  const postcards: MyPostcard[] =
    data?.data?.content?.filter((p: MyPostcard) => p.mine === true) ?? [];

  const handleSelect = (postcard: MyPostcard) => {
    setSelectedPostcard((prev) => (prev?.id === postcard.id ? null : postcard));
    setWarning(false);
  };

  const handleConfirm = () => {
    if (!selectedPostcard) {
      setWarning(true);
      return;
    }
    onSelect(selectedPostcard);
    setSelectedPostcard(null);
    setWarning(false);
  };

  const handleClose = () => {
    setSelectedPostcard(null);
    setWarning(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="flex flex-col gap-0 p-0 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl max-h-[75vh] w-[calc(100vw-2rem)] max-w-md">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#E0DDD3] shrink-0">
          <DialogTitle className="text-base font-semibold text-[#3D3830] text-left">
            엽서 선택
          </DialogTitle>
        </DialogHeader>

        {/* 엽서 목록 */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 min-h-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#8B8070]" />
            </div>
          ) : postcards.length === 0 ? (
            <p className="text-sm text-[#B0AC9C] text-center py-10">
              보유한 엽서가 없습니다.
            </p>
          ) : (
            postcards.map((postcard) => {
              const selected = selectedPostcard?.id === postcard.id;
              return (
                <button
                  key={postcard.id}
                  type="button"
                  onClick={() => handleSelect(postcard)}
                  className={`w-full text-left flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                    selected
                      ? "border-[#5C5346] bg-[#5C5346]/5"
                      : "border-[#E0DDD3] bg-white hover:border-[#C8C4B0]"
                  }`}
                >
                  {/* 체크박스 */}
                  <div
                    className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected
                        ? "border-[#5C5346] bg-[#5C5346]"
                        : "border-[#C8C4B0]"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="w-2 h-2 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* 엽서 아이콘 */}
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[#EDEAE0] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#5C5346]" />
                  </div>

                  {/* 엽서 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#3D3830] truncate">
                      {postcard.content}
                    </p>
                    <p className="text-[10px] text-[#B0AC9C] mt-0.5">
                      {postcard.authorNickname}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* 경고 메시지 */}
        {warning && (
          <div className="mx-5 flex items-center gap-1.5 text-xs text-red-400">
            엽서를 선택해주세요.
          </div>
        )}

        {/* 하단 버튼 */}
        <DialogFooter className="px-5 pb-8 pt-3 grid grid-cols-2 gap-3 border-t border-[#E0DDD3] shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="h-12 rounded-2xl border-2 border-[#C8C4B0] bg-transparent text-[#5C5346] text-sm font-semibold transition-all active:scale-95 hover:bg-[#EDE9DA]"
          >
            뒤로가기
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237]"
          >
            엽서 담기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
