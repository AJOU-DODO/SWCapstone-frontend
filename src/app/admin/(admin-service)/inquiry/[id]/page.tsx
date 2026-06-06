import { getInquiryDetail } from "@/lib/adminApi/inquiry"; 
import Link from 'next/link';
import { cookies } from 'next/headers';

import InquiryDetail from '@/components/admin/inquiry/InquiryDetail';
import AnswerForm from '@/components/admin/inquiry/AnswerForm';

interface PageProps {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ status?: string; page?: string }>; 
}


export default async function InquiryDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = await searchParams;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const queryString = new URLSearchParams(
    Object.entries(sParams).filter(([_, v]) => v !== undefined) as string[][]
  ).toString();

  const listUrl = queryString ? `/admin/inquiry?${queryString}` : '/admin/inquiry';

  let data;
  try{
    data = await getInquiryDetail(accessToken!, id);
  } catch (error) {
    console.error('문의사항 조회 실패:', error);
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-red-500 font-semibold">문의사항을 불러오는 데 실패했습니다.</p>
        <Link href="/admin/inquiry" className="text-sm text-[#54513E] underline">
          목록으로 이동
        </Link>
      </div>
    );
  }

  const inquiry = data.data;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link 
        href={listUrl} 
        className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
      >
        ← 목록으로
      </Link>
      
      <InquiryDetail inquiry={inquiry}/>
      <AnswerForm inquiryId={id} hasAnswer={!!inquiry.answer}/>
    </div>
  );
}
