"use client";

import Link from 'next/link';
import { useState, useEffect, use } from "react";

import { getNestDetailAdmin } from '@/lib/adminApi/nest';
import { NestDetail, AdNestDetailHeader, NestDetailBody } from '@/types/indexAdmin';

import AdDetailHeader from '@/components/admin/advertise/AdDetailHeader';
import NestBody from '@/components/admin/nest/NestDetail/NestBody';

interface PageProps {
  params: Promise<{ id: number }>;
  searchParams: Promise<{ includeDeleted?: string; page?: string }>; 
}

export default function AdsDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  
  const nestId = resolvedParams.id;

  const searchObj = new URLSearchParams();
  if (resolvedSearchParams.includeDeleted) searchObj.set("includeDeleted", resolvedSearchParams.includeDeleted);
  if (resolvedSearchParams.page) searchObj.set("page", resolvedSearchParams.page);

  const queryString = searchObj.toString();

  const [detailData, setDetailData] = useState<NestDetail | null>(null);
  const [header, setHeader] = useState<AdNestDetailHeader| null>(null);
  const [body, setBody] = useState<NestDetailBody | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getNestDetailAdmin(nestId);
        setDetailData(data);

        setHeader({
          authorId: data.data.authorId,
          nestId: data.data.nestId,
          profileImageUrl: data.data.profileImageUrl,
          authorNickname: data.data.authorNickname,
          createdAt: data.data.createdAt,
          latitude: data.data.latitude, 
          longitude: data.data.longitude,
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
        console.error("광고 상세 정보 로딩 실패:", error);
        setIsLoading(false);
        return (
        <div className="p-6 text-center space-y-4">
          <p className="text-red-500 font-semibold">광고 세부내용을 불러오는 데 실패했습니다.</p>
          <Link href="/admin/ads" className="text-sm text-[#54513E] underline">
            목록으로 이동
          </Link>
        </div>
      );
      } finally {
        setIsLoading(false);
      }
    };

    if (nestId) {
      fetchDetail();
    }
  }, [nestId]);

  const listUrl = queryString ? `/admin/ads?${queryString}` : '/admin/ads';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-sm font-semibold text-[#54513E]">
        상세 정보를 불러오는 중입니다...
      </div>
    );
  }
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link 
        href={listUrl} 
        className="text-sm font-semibold text-[#54513E] hover:text-black flex items-center gap-1"
      >
        ← 목록으로
      </Link>

      <div className='flex flex-col'>
        {header && <AdDetailHeader header={header} listUrl={listUrl}/>}
        {body && <NestBody body={body} />}
      </div>
      
    </div>
  );
}
