import NestTabButton from '@/components/admin/NestTabButton';
import NestTable, { Nest } from '@/components/admin/NestTable';

export default async function Page({ searchParams, }: {searchParams: Promise<{ tab?: string }>;}) {
  //게시글 관리 메뉴 파라미터
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || 'all';

  const nests: Nest[] = [
    { 
      id: "1",
      creatorNickname: "김도도",
      content: "여기 벗쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "2",
      creatorNickname: "김도도",
      content: "여기 벗쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "3",
      creatorNickname: "김도도",
      content: "여기 벗쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    { 
      id: "4",
      creatorNickname: "김도도",
      content: "여기 벗쫓이 너무 예...",
      createdAt: "2023-02-01",
      likeCount: 37,
      replyCount: 5,
      reportCount: 0,
    },
    ]

  return (
    <div>
      <div>
        <NestTabButton/>

        <div className="mt-4">
        {activeTab === 'all' && <NestTable nests={nests}/>}
        {activeTab === 'reported' && <div>신고된게시글</div>}
        {activeTab === 'comments' && <div>신고된댓글</div>}
        </div>
      </div>
    </div>
  );
}
