import MypageHeader from '@/components/webview/mypage/MyPageHeader';
import MyCommentList from '@/components/webview/mypage/MyCommentList';

export default function Page() {
  return(
    <div>
      <MypageHeader title='내 댓글'/>
      <MyCommentList/>
    </div>
  );
}