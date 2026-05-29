import DetailHeader from '@/components/admin/nest/NestDetail/DetailHeader';
import ReportInfo from '@/components/admin/nest/NestDetail/ReportInfo';
import NestBody from '@/components/admin/nest/NestDetail/NestBody';
import CommentList from '@/components/admin/nest/NestDetail/CommentList';

export default function NestDetail({ postId }: { postId: string | number }){
  return(
    <div 
    onClick={(e) => e.stopPropagation()}
    className='w-full min-w-0 h-full overflow-y-auto'>
      <DetailHeader nestId={1}/>
      <ReportInfo nestId={1}/>
      <NestBody nestId={1}/>
      <CommentList nestId={1}/>
    </div>
  )
}