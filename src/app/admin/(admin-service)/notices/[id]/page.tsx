import { getNoticeDetail } from '@/lib/adminApi/notice';
import Link from 'next/link';
import { cookies } from 'next/headers';
import PublishButton from '@/components/admin/notice/PublishButton';
import DeleteButton from '@/components/admin/notice/DeleteButton';

interface PageProps {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ status?: string; page?: string }>; 
}

export default async function NoticeDetailPage({ params, searchParams }: PageProps) {
  
  const { id } = await params;
  const sParams = await searchParams;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const queryString = new URLSearchParams(
    Object.entries(sParams).filter(([_, v]) => v !== undefined) as string[][]
  ).toString();

  const listUrl = queryString ? `/admin/notices?${queryString}` : '/admin/notices';

  let notice;
  try{
    notice = await getNoticeDetail(accessToken!, id);
  } catch (error) {
    console.error('공지사항 조회 실패:', error);
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-500 font-semibold">공지사항을 불러오는 데 실패했습니다.</p>
        <Link href="/admin/notices" className="text-sm text-[#54513E] underline">
          목록으로 이동
        </Link>
      </div>
    );
  }

  const noticeData = notice.data;
  const isPublished = noticeData.published;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center border-b pb-4">
        <Link 
          href={listUrl} 
          className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
        >
          ← 목록으로
        </Link>
        
        <div className="flex gap-2">
          {/* 💡 2. 중복되던 분기문을 합쳐서 깔끔하게 청소했습니다. */}
          {noticeData.deletedAt === null && (
            <>
              <Link 
                href={`/admin/notices/${id}/edit`}
                className="px-4 py-2 text-sm font-bold text-[#54513E] bg-[#54513E]/10 rounded-full hover:bg-[#54513E]/20"
              >
                수정하기
              </Link>
              <DeleteButton id={id} />
              {/* 임시저장 상태일 때만 발행 버튼이 뒤에 추가됩니다. */}
              {!isPublished && <PublishButton id={id} />}
            </>
          )}
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {isPublished ? (
            <span className="px-3 py-1 text-xs font-bold bg-[#2B6340]/10 text-[#2B6340] rounded-full">
              ● 발행 완료
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full">
              임시저장 초안
            </span>
          )}

          {noticeData.deletedAt !== null && (
            <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
              삭제됨
            </span>
          )}
          
          <span className='px-3 py-1 text-xs font-bold bg-[#54513E] text-white rounded-full'>
            {noticeData.category}
          </span>
          <span className="text-xs text-gray-400">
            생성 • {new Date(noticeData.createdAt).toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-400">
            | 수정 • {new Date(noticeData.updatedAt).toLocaleDateString()}
          </span>
          {noticeData.deletedAt !== null && (
            <span className="text-xs text-gray-400">
               | 삭제 • {new Date(noticeData.deletedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800">{noticeData.title}</h1>
        <div className="border-t pt-6 text-gray-700 min-h-[300px] whitespace-pre-wrap">
          {noticeData.content}
        </div>
      </div>

    </div>
  );
}