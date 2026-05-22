import { getNoticeDetail } from '@/lib/adminApi/notice';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: number }> }) {
  
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    const notice = await getNoticeDetail(accessToken!, id);
    const isPublished = notice.data.published; 

    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center border-b pb-4">
          <Link 
            href="/admin/notices" 
            className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
          >
            ← 목록으로
          </Link>
          
          <div className="flex gap-2">
            {/* 임시저장 글과 발행 글의 버튼을 다르게 처리 */}
            {!isPublished ? (
              <>
                <Link 
                  href={`/admin/notice/${id}/edit`}
                  className="px-4 py-2 text-sm font-bold text-[#54513E] bg-[#54513E]/10 rounded-full hover:bg-[#54513E]/20"
                >
                  수정하기
                </Link>
                <button className="px-4 py-2 text-sm font-bold text-white bg-[#2B6340] rounded-full hover:bg-[#204a30]">
                  최종 발행하기
                </button>
              </>
            ) : (
              <>
              <Link 
                  href={`/admin/notice/${id}/edit`}
                  className="px-4 py-2 text-sm font-bold text-[#54513E] bg-[#54513E]/10 rounded-full hover:bg-[#54513E]/20"
                >
                  수정하기
                </Link>
              <button className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-full hover:bg-red-700">
                삭제하기
              </button>
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
            
            <span className="text-xs text-gray-400">
              {notice.data.category} | {new Date(notice.data.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{notice.data.title}</h1>
          <div className="border-t pt-6 text-gray-700 min-h-[300px] whitespace-pre-wrap">
            {notice.data.content}
          </div>
        </div>

      </div>
    );
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
}