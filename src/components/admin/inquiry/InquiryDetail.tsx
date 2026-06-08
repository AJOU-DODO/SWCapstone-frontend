import { InquiryDetail as Inquiry } from '@/types/indexAdmin';

export default async function InquiryDetail({ inquiry }:{inquiry: Inquiry}) {

  return (
    <div className="p-6 rounded-lg space-y-3">
      <div className='flex flex-row justify-between items-center'>
        <h1 className="text-2xl font-bold pb-4">{"[" + inquiry.typeDescription + "]"} {inquiry.title}</h1>
        <span className='border-2 border-[#54513E] px-3 rounded cursor-default'>{inquiry.statusDescription}</span>
      </div>

      <div className='flex flex-row justify-between items-center pb-4 border-b-2 border-[#54513E]'>
        <span><strong>작성자:</strong> {inquiry.userNickname} ({inquiry.userId})</span>
        <span><strong>문의일:</strong> {new Date(inquiry.createdAt).toLocaleDateString()}</span>
        <span><strong>답변일:</strong> {inquiry.answeredAt ? new Date(inquiry.answeredAt).toLocaleDateString()  : '----.--.--'}</span>
      </div>
      <div className="mt-4 p-4">
        Q. {inquiry.content}
      </div>
      <div className="mt-4 p-4 border-t border-dashed border-[#54513E]">
        A. {inquiry.answer ? (
              inquiry.answer
            ) : (
              <span className="text-gray-400 italic">아직 답변이 등록되지 않았습니다.</span>
            )}
      </div>
    </div>
  );
}
