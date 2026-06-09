"use client";

import { useState, useEffect } from "react";
import {
  getAdvertiserAccount,
  getMyProposals,
  getMyNests,
  getAdStatistics,
} from "@/lib/apiAdvertiser";
import type {
  AdvertiserAccount,
  AdProposal,
  AdNest,
  AdStatistics,
} from "@/types/indexAdvertiser";
import AccountStatusCard from "@/components/advertiser/AccountStatusCard";
import ProposalList from "@/components/advertiser/ProposalList";
import AdStatisticsCard from "@/components/advertiser/AdStatisticsCard";

export default function AdvertiserDashboard() {
  const [account, setAccount] = useState<AdvertiserAccount | null>(null);
  const [proposals, setProposals] = useState<AdProposal[]>([]);
  const [nests, setNests] = useState<AdNest[]>([]);
  const [statistics, setStatistics] = useState<Record<number, AdStatistics>>(
    {},
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [accountData, proposalsData, nestsData] = await Promise.all([
          getAdvertiserAccount(),
          getMyProposals(),
          getMyNests(),
        ]);
        setAccount(accountData.data);
        setProposals(proposalsData.data);
        setNests(nestsData.data);

        const statsResults = await Promise.all(
          nestsData.data.map((nest: AdNest) => getAdStatistics(nest.id)),
        );
        const statsMap: Record<number, AdStatistics> = {};
        statsResults.forEach((result, i) => {
          statsMap[nestsData.data[i].id] = result.data;
        });
        setStatistics(statsMap);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="p-10 pr-20 flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-800">광고주 대시보드</h1>

      {/* 계정 상태 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">계정 상태</h2>
        {account ? (
          <AccountStatusCard account={account} />
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400">
            로딩 중...
          </div>
        )}
      </section>

      {/* 광고 신청 내역 */}
      <ProposalList proposals={proposals} />

      {/* 성과 통계 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          게시 중인 광고 성과
        </h2>
        {nests.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-400">
            게시 중인 광고가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {nests.map((nest) => (
              <AdStatisticsCard
                key={nest.id}
                nest={nest}
                stats={statistics[nest.id]}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
