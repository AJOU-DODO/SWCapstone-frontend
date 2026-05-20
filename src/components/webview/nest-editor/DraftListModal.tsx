"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNestEditorStore } from "@/lib/store/nestEditorStore";
import { fetchDrafts } from "@/lib/api";
import type { DraftItem } from "@/types";

interface Props {
  accessToken: string;
  open: boolean;
  onClose: () => void;
  onLoad: (draft: DraftItem) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatCoord(lat: number, lng: number) {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

export function DraftListModal({ accessToken, open, onClose, onLoad }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [warning, setWarning] = useState(false);
  const { setLoadedDraftId } = useNestEditorStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["drafts"],
    queryFn: () => fetchDrafts(accessToken),
    enabled: open, // 모달이 열릴 때만 fetch
    staleTime: 0,
  });

  const drafts: DraftItem[] = data?.data ?? [];

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setWarning(false);
  };

  const handleLoad = () => {
    if (selectedId === null) {
      setWarning(true);
      return;
    }
    const draft = drafts.find((d) => d.id === selectedId);
    if (draft) {
      setLoadedDraftId(draft.id);
      onLoad(draft);
      setSelectedId(null);
      setWarning(false);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setWarning(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="flex flex-col gap-0 p-0 bg-[#F7F4EC] border-[#E0DDD3] rounded-3xl max-h-[75vh] w-[calc(100vw-2rem)] max-w-md">
        {/* 헤더 */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#E0DDD3] shrink-0">
          <DialogTitle className="text-base font-semibold text-[#3D3830] text-left">
            임시저장 목록
          </DialogTitle>
        </DialogHeader>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 min-h-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#8B8070]" />
            </div>
          ) : isError ? (
            <p className="text-sm text-red-400 text-center py-10">
              목록을 불러오지 못했습니다.
            </p>
          ) : drafts.length === 0 ? (
            <p className="text-sm text-[#B0AC9C] text-center py-10">
              임시저장된 게시물이 없습니다.
            </p>
          ) : (
            drafts.map((draft) => {
              const selected = selectedId === draft.id;
              return (
                <button
                  key={draft.id}
                  type="button"
                  onClick={() => handleSelect(draft.id)}
                  className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                    selected
                      ? "border-[#5C5346] bg-[#5C5346]/5"
                      : "border-[#E0DDD3] bg-white hover:border-[#C8C4B0]"
                  }`}
                >
                  {/* 체크박스 */}
                  <div
                    className={`shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
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

                  {/* 내용 */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-[#8B8070]">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span>
                        {formatCoord(draft.latitude, draft.longitude)}
                      </span>
                    </div>
                    <p className="text-xs text-[#3D3830] leading-relaxed line-clamp-2">
                      {draft.content ?? (
                        <span className="text-[#B0AC9C] italic">본문 없음</span>
                      )}
                    </p>
                  </div>

                  {/* 날짜 */}
                  <span className="shrink-0 text-[10px] text-[#B0AC9C] mt-0.5">
                    {formatDate(draft.createdAt)}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* 경고 메시지 */}
        {warning && (
          <div className="mx-5 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            임시저장 게시물을 선택하지 않으셨습니다.
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
            onClick={handleLoad}
            className="h-12 rounded-2xl bg-[#5C5346] text-white text-sm font-semibold transition-all active:scale-95 hover:bg-[#4A4237]"
          >
            불러오기
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
