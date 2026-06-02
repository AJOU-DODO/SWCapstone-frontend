"use client";

import MyPageHeader from "@/components/webview/mypage/MyPageHeader";
import PostCardTap from "@/components/webview/mypage/Postcard/PostcardTab";
import PostcardGrid from "@/components/webview/mypage/Postcard/PostcardGrid";
import PostcardModal from "@/components/webview/mypage/Postcard/PostcardModal";
import PostcardEditModal from "@/components/webview/mypage/Postcard/PostcardEditModal";
import DeletePostcardDialog from "@/components/webview/mypage/Postcard/DeletePostcardDialog";
import { ReportModal } from "@/components/webview/nest-detail/ReportModal";
import Spinner from "@/components/webview/Spinner";
import { fetchUserPostcards } from "@/lib/apiMypage";
import type { MyPostcard } from "@/types/indexMypage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { useState, useEffect, useMemo } from "react";

// filter 매칭 함수
const getFilter = (tab: "mine" | "sent" | "received") => {
  if (tab === "mine") return "CREATED_NOT_SHARED";
  if (tab === "sent") return "CREATED_SHARED";
  return "ACQUIRED";
};

type ToastState = { type: "success" | "error"; message: string } | null;

export default function Page() {
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"mine" | "sent" | "received">(
    () => {
      const tab = searchParams.get("tab");
      if (tab === "sent" || tab === "received") return tab;
      return "mine";
    },
  );
  const [selectedPostcard, setSelectedPostcard] = useState<MyPostcard | null>(
    null,
  );
  const [editTarget, setEditTarget] = useState<MyPostcard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MyPostcard | null>(null);
  const [reportTarget, setReportTarget] = useState<number | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      return token ?? "";
    } catch {
      return "";
    }
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  //엽서 리스트 정보
  const {
    data: postcardData,
    isLoading: isPostCardLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["userPostcard", accessToken, activeTab],

    queryFn: ({ pageParam = 0 }) => {
      return fetchUserPostcards(accessToken, getFilter(activeTab), pageParam);
    },
    initialPageParam: 0,
    enabled: !!accessToken,

    getNextPageParam: (lastPage) => {
      if (lastPage.data.last) return undefined;
      return lastPage.data.number + 1;
    },
  });

  useEffect(() => {
    // 안드로이드가 엽서작성완료 신호를 보낼 시 실행될 함수
    const handleAndroidRefresh = () => {
      refetch();
    };

    window.requestReload = handleAndroidRefresh;

    return () => {
      window.requestReload = () => {};
    };
  }, [refetch]);

  const displayList = useMemo(() => {
    return (
      postcardData?.pages.flatMap((page) => page?.data?.content || []) || []
    );
  }, [postcardData]);

  if (!accessToken) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* 토스트 */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium whitespace-nowrap ${
            toast.type === "success"
              ? "bg-[#54513E] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
      <MyPageHeader title="엽서함" />
      <PostCardTap currentTab={activeTab} onTabChange={setActiveTab} />

      {isPostCardLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Spinner size="md" />
        </div>
      ) : (
        <PostcardGrid
          items={displayList}
          activeTab={activeTab}
          onItemClick={(item) => setSelectedPostcard(item)}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      <PostcardModal
        isOpen={!!selectedPostcard}
        postcardData={selectedPostcard}
        activeTab={activeTab}
        accessToken={accessToken}
        onClose={() => setSelectedPostcard(null)}
        onEditClick={() => {
          setEditTarget(selectedPostcard);
          setSelectedPostcard(null);
        }}
        onDeleteClick={() => {
          setDeleteTarget(selectedPostcard);
          setSelectedPostcard(null);
        }}
        onReportClick={() => {
          setReportTarget(selectedPostcard!.id);
          setSelectedPostcard(null);
        }}
      />

      {/* 수정 모달 */}
      <PostcardEditModal
        isOpen={!!editTarget}
        postcard={editTarget}
        accessToken={accessToken}
        activeTab={activeTab}
        onClose={() => setEditTarget(null)}
        onSuccess={() => showToast("success", "엽서가 수정되었습니다.")}
        onError={() => showToast("error", "엽서 수정에 실패했습니다.")}
      />

      {/* 삭제 확인 Dialog */}
      <DeletePostcardDialog
        isOpen={!!deleteTarget}
        postcard={deleteTarget}
        accessToken={accessToken}
        activeTab={activeTab}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => showToast("success", "엽서가 삭제되었습니다.")}
        onError={() => showToast("error", "엽서 삭제에 실패했습니다.")}
      />

      {/* 신고 모달 */}
      <ReportModal
        open={!!reportTarget}
        reportType="POSTCARD"
        targetId={reportTarget ?? 0}
        accessToken={accessToken}
        onClose={() => setReportTarget(null)}
        onSuccess={() => {
          setReportTarget(null);
          showToast("success", "신고가 완료되었습니다.");
        }}
        onError={() =>
          showToast("error", "신고가 실패했습니다. 다시 시도해주세요.")
        }
      />
    </div>
  );
}
