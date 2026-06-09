"use client";

import { useRouter } from "next/navigation";
import type { AdProposal } from "@/types/indexAdvertiser";
import ProposalItem from "./ProposalItem";

interface Props {
  proposals: AdProposal[];
}

export default function ProposalList({ proposals }: Props) {
  const router = useRouter();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">광고 신청 내역</h2>
        <button
          onClick={() => router.push("/advertiser/proposals/new")}
          className="px-4 py-2 bg-[#538752] text-white text-sm rounded-lg hover:bg-[#2B6340] transition-colors"
        >
          + 새 광고 신청
        </button>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-400">
          신청한 광고가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {proposals.map((proposal) => (
            <ProposalItem key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </section>
  );
}
