"use client";

import { useState, useEffect } from "react";

import DetailHeader from '@/components/admin/nest/NestDetail/DetailHeader';
import ReportInfo from '@/components/admin/nest/NestDetail/ReportInfo';
import NestBody from '@/components/admin/nest/NestDetail/NestBody';
import CommentList from '@/components/admin/nest/NestDetail/CommentList';

import { NestDetailHeader, NestDetailBody } from '@/types/indexAdmin';
import { getNestDetailAdmin, getReportDetail } from '@/lib/adminApi/nest';

export default function NestDetail({ nestId }: { nestId: number }){
  const [header, setHeader] = useState<NestDetailHeader| null>(null);
  const [body, setBody] = useState<NestDetailBody | null>(null);

  useEffect(() => {
      const fetchNestDetail = async () => {
        try {
          const data = await getNestDetailAdmin(nestId);

          setHeader({
            // TODO: 사용자 프로필 이미지 데이터 받아오기
            authorNickname: data.data.authorNickname,
            createdAt: data.data.createdAt,
            // TODO: 최초신고일, 최근신고일 데이터 받아오기
            firstReportedAt: data.data.firstReportedAt ??  "--.--.--", 
            lastReportedAt: data.data.lastReportedAt ?? "--.--.--",
          });

          setBody({
            imageUrls: data.data.imageUrls,
            categoryNames: data.data.categoryNames,
            title: data.data.title,
            content: data.data.content,
            // TODO: 좋아요 수, 싫어요 수 데이터 받아오기
            likeCount: data.data.likeCount ?? 0,
            dislikeCount: data.data.dislikeCount ?? 0,
          });
        } catch (error) {
          console.error('둥지 상세정보 로딩 실패:', error);
        } 
      };
  
      fetchNestDetail();
    }, [nestId]);

  return(
    <div 
    onClick={(e) => e.stopPropagation()}
    className='w-full min-w-0 h-full overflow-y-auto'>
      {header && <DetailHeader header={header} />}
      <ReportInfo nestId={1}/>
      {body && <NestBody body={body} />}
      <CommentList nestId={1}/>
    </div>
  )
}