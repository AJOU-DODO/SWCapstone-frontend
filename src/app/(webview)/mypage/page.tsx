"use client";

import { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchUserStatistics, fetchUserDetail, fetchUserNests, patchUpdatdProfile, fetchPresignedUrl } from "@/lib/apiMypage";
import { uploadImageToS3 } from "@/lib/api";
import UserDetail from '@/components/webview/mypage/UserDetail';
import MenuButtons from "@/components/webview/mypage/MenuButtons";
import MyNestList from "@/components/webview/mypage/MyNestList";
import Spinner from "@/components/webview/Spinner";

export default function Page() {
  const [Base64, setBase64] = useState<string>("");
  
  //브릿지로 accesstoken 수신
  const [accessToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const token = window.AndroidBridge.getAccessToken();
      console.log(token, "마이페이지");
      return token ?? "";
    } catch {
      return "";
    }
  });
  
  useEffect(() => {
      window.onImageReceived = (Base64: string) => {
        setBase64(Base64);
      }
      return () => {
        window.onImageReceived = undefined;
      };
    }, []);

  if(accessToken) console.log("성공");

  //유저 활동 정보
  const { data: statsData, isLoading: isStatsLoading } = useQuery({
    queryKey: ['userStats', accessToken],
    queryFn: () => fetchUserStatistics(accessToken),
    enabled: !!accessToken,
  });

  //유저 정보
  const { data: userData, isLoading: isDetailLoading, refetch} = useQuery({
    queryKey: ['userDetail', accessToken],
    queryFn: () => fetchUserDetail(accessToken),
    enabled: !!accessToken,
  });

  //유저 둥지 정보
  const { 
    data: nestsData, 
    isLoading: isNestLoading,
    fetchNextPage,      // 다음 페이지를 불러오는 함수
    hasNextPage,        // 다음 페이지가 있는지 여부 (last 기반)
    isFetchingNextPage  // 추가 페이지를 로딩 중인지 여부
  } = useInfiniteQuery({
    queryKey: ['userNests', accessToken],
    queryFn: ({ pageParam = 0 }) => fetchUserNests(accessToken, pageParam), 
    enabled: !!accessToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.last) return undefined;
      return lastPage.data.number + 1;
    },
  });

  const allNests = nestsData?.pages.flatMap((page) => page.data.content) || [];

  if (!accessToken || isStatsLoading || isDetailLoading || isNestLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Spinner size="lg" />
      </div>
  );
  }

  const updatedUserData = {
    ...userData, // 기존 닉네임, 바이오 등 유지
    profileImageUrl: Base64 || userData?.data.profileImageUrl
  };

  const handleSave = async (nickname: string, bio: string) => {
    try {
      let finalImageUrl = userData?.data.profileImageUrl;

      if (Base64) {
      // 파일네임 생성
      const fileName = `profile_${Date.now()}.png`;

      // S3에 이미지 업로드
      const response = await fetchPresignedUrl(fileName, accessToken);

      const { presignedUrl, fileUrl } = response.data;

      await uploadImageToS3(presignedUrl, Base64)

      // 서버에 보낼 주소를 S3에서 받은 주소로 교체
      finalImageUrl = fileUrl;
      console.log("새로운 S3 URL 생성 완료:", finalImageUrl);
    }

      const payload = {
        nickname: nickname,
        bio: bio,
        profileImageUrl: finalImageUrl || ""
      };

      console.log("유저 정보 수정 데이터:", payload);

      // PATCH API 호출 
      await patchUpdatdProfile(payload, accessToken);
      
      console.log("프로필업데이트성공");

      refetch();
      return true;
    } catch (error) {
      console.error("수정 실패:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
      return false;
    }
  };

  return (
    <div>
      <UserDetail userStats={statsData?.data} userDetail={updatedUserData?.data} onSave={handleSave}/>
      <MenuButtons/>
      <MyNestList nestsData={allNests} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}/>
    </div>
  );
}
