"use client";

import { useState, useEffect } from "react";

import DetailHeader from '@/components/admin/nest/NestDetail/DetailHeader';
import ReportInfo from '@/components/admin/nest/NestDetail/ReportInfo';
import NestBody from '@/components/admin/nest/NestDetail/NestBody';
import CommentList from '@/components/admin/nest/NestDetail/CommentList';

import { NestDetailHeader, NestDetailBody, ReportDetail, ReportTargetType, NestComment } from '@/types/indexAdmin';
import { getNestDetailAdmin, getReportDetail, getCommentsAdmin } from '@/lib/adminApi/nest';

export default function NestDetail({ nestId, triggerRefresh, onClose }: { nestId: number; triggerRefresh: () => void; onClose: () => void;}){
  const [header, setHeader] = useState<NestDetailHeader| null>(null);
  const [body, setBody] = useState<NestDetailBody | null>(null);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [comment, setCommet] = useState<NestComment[] | []>([]);

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerNestDetailRefresh = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const fetchNestDetail = async () => {
      try {
        const data = await getNestDetailAdmin(nestId);

        setHeader({
          authorId: data.data.authorId,
          nestId: data.data.nestId,
          profileImageUrl: data.data.profileImageUrl,
          authorNickname: data.data.authorNickname,
          createdAt: data.data.createdAt,
          firstReportedAt: data.data.firstReportedAt, 
          lastReportedAt: data.data.lastReportedAt,
          deleted: data.data.deleted
        });

        setBody({
          imageUrls: data.data.imageUrls,
          categoryNames: data.data.categoryNames,
          title: data.data.title,
          content: data.data.content,
          likeCount: data.data.likeCount ?? 0,
          dislikeCount: data.data.dislikeCount ?? 0,
        });
      } catch (error) {
        console.error('둥지 상세정보 로딩 실패:', error);
      } 
    };

    const fetchReportDetail = async () => {
      try {
        const params: { targetType: ReportTargetType; targetId: number } = {
          targetType: "NEST",
          targetId: nestId
        };
        const data = await getReportDetail(params);

        setReport(data.data);

      } catch (error) {
        console.error('신고 집계 정보 로딩 실패:', error);
      } 
    };

    const fetchNestComment = async () => {
      try {
        const data = await getCommentsAdmin(nestId);

        setCommet(data.data);

      } catch (error) {
        console.error('댓글 정보 로딩 실패:', error);
      } 
    };

    fetchNestDetail();
    fetchReportDetail();
    fetchNestComment();
  }, [nestId, refreshKey]);

  return(
    <div 
    onClick={(e) => e.stopPropagation()}
    className='w-full min-w-0 h-full overflow-y-auto'>
      {header && <DetailHeader header={header} triggerRefresh={triggerRefresh} onClose={onClose}/>}
      {report && <ReportInfo report={report}/>}
      {body && <NestBody body={body} />}
      {comment && <CommentList comment={comment} triggerRefresh={triggerNestDetailRefresh}/>}
    </div>
  )
}