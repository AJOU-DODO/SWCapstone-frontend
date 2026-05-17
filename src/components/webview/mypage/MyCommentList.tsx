
import Link from "next/link";
import type { MyComment } from "@/types/indexMypage";
import { useInView } from "react-intersection-observer";
import Spinner from "@/components/webview/Spinner";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  commentData: MyComment[] | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean; 
  isFetchingNextPage: boolean;
}

export default function MyCommentList( { commentData, fetchNextPage, hasNextPage, isFetchingNextPage }: Props ) {
  const { ref, inView } = useInView();

  const comments = commentData || [];

  return(
    <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <Link
            key={comment.id}
            href={`/nests/${comment.nestId}`} // 상세 페이지 경로
            className="flex flex-row gap-5 p-4 w-full border-b border-[#54513E] active:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] text-gray-800 mb-3">
                {comment.content}
              </h4>

              <div className="flex justify-between items-center text-[12px] text-gray-500">
                <div className="flex items-center gap-1 truncate">
                  {comment.nestTitle} • {comment.authorNickname}
                </div>
                <span className="text-[11px] text-gray-400">작성 {formatDate(comment.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
        <div ref={ref} className="flex justify-center items-center h-14">
          {isFetchingNextPage && <Spinner size="sm" />}
          {!isFetchingNextPage && !hasNextPage && comments.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">모든 둥지를 확인했어요!</p>
          )}
        </div>
      </div>
  )
}