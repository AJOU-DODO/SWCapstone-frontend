"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import {
  getStatsTrends,
  getStatsSummary,
  getPostcardRatio,
} from "@/lib/adminApi/stats";
import { getDefaultDateRange } from "@/utils/formatters";
import type {
  StatsTrend,
  StatsSummary,
  PostcardRatio,
} from "@/types/indexAdmin";
import SummaryCard from "@/components/admin/stats/SummaryCard";
import TrendChart from "@/components/admin/stats/TrendChart";
import PostcardRatioCard from "@/components/admin/stats/PostcardRatioCard";

const defaultDates = getDefaultDateRange();

function StatsPage() {
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [ratioStartDate, setRatioStartDate] = useState("");
  const [ratioEndDate, setRatioEndDate] = useState("");

  const [trends, setTrends] = useState<StatsTrend[]>([]);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [ratio, setRatio] = useState<PostcardRatio | null>(null);

  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [isRatioLoading, setIsRatioLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getStatsSummary();
        setSummary(data.data);
      } catch (error) {
        console.error("요약 데이터 로딩 실패:", error);
      }
    };
    fetchSummary();
  }, []);

  const fetchTrends = useCallback(async (start: string, end: string) => {
    setIsTrendsLoading(true);
    try {
      const params =
        start && end ? { startDate: start, endDate: end } : undefined;
      const data = await getStatsTrends(params);
      setTrends(data.data);
    } catch (error) {
      console.error("트렌드 데이터 로딩 실패:", error);
    } finally {
      setIsTrendsLoading(false);
    }
  }, []);

  const fetchRatio = useCallback(async (start: string, end: string) => {
    setIsRatioLoading(true);
    try {
      const params =
        start && end ? { startDate: start, endDate: end } : undefined;
      const data = await getPostcardRatio(params);
      setRatio(data.data);
    } catch (error) {
      console.error("엽서 비율 데이터 로딩 실패:", error);
    } finally {
      setIsRatioLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrends(defaultDates.start, defaultDates.end);
    fetchRatio("", "");
  }, [fetchTrends, fetchRatio]);

  return (
    <div className="p-10 pr-20 flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-800">통계 확인</h1>

      {/* 요약 카드 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">전체 현황</h2>
        {summary ? (
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard
              label="둥지"
              total={summary.totalNests}
              today={summary.todayNests}
              color="border-[#538752]"
            />
            <SummaryCard
              label="댓글"
              total={summary.totalComments}
              today={summary.todayComments}
              color="border-blue-400"
            />
            <SummaryCard
              label="엽서"
              total={summary.totalPostcards}
              today={summary.todayPostcards}
              color="border-amber-400"
            />
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400">
            로딩 중...
          </div>
        )}
      </section>

      {/* 일별 트렌드 */}
      <TrendChart
        trends={trends}
        startDate={startDate}
        endDate={endDate}
        isLoading={isTrendsLoading}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearch={() => fetchTrends(startDate, endDate)}
      />

      {/* 엽서 교환 비율 */}
      <PostcardRatioCard
        ratio={ratio}
        startDate={ratioStartDate}
        endDate={ratioEndDate}
        isLoading={isRatioLoading}
        onStartDateChange={setRatioStartDate}
        onEndDateChange={setRatioEndDate}
        onSearch={() => fetchRatio(ratioStartDate, ratioEndDate)}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <StatsPage />
    </Suspense>
  );
}
