
import Link from "next/link";
import { MOCK_USER_COMMENTS } from "@/app/(webview)/mypage/MockData"; // 임시 데이터 경로
import type { MyCommentsData } from "@/types/indexMypage";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  commentData: MyCommentsData | undefined;
}

export default function MyCommentList( { commentData }: Props ) {
  //const comment = MOCK_USER_COMMENTS.data.content;
  const comment = commentData!.content;

  return(
    <div className="flex flex-col gap-3">
        {comment.map((comment) => (
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
      </div>
  )
}