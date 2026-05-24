import NoticeEditor from '@/components/admin/NoticeEditor';
import { getNoticeDetail } from '@/lib/adminApi/notice';
import { cookies } from 'next/headers';

export default async function Page({ params }: { params: Promise<{ id: number }> }) {

  const { id } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const notice = await getNoticeDetail(accessToken!, id);

  return <NoticeEditor mode="edit" initialData={notice.data}/>;
}
