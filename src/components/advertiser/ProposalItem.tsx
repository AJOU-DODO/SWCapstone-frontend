import { useRouter } from "next/navigation";
import type { AdProposal } from "@/types/indexAdvertiser";
import { formatDate } from "@/utils/formatters";

interface Props {
  proposal: AdProposal;
}

const STATUS_LABELS = {
  PENDING: { label: "심사 중", color: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "승인됨", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "반려됨", color: "bg-red-100 text-red-700" },
};

export default function ProposalItem({ proposal }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-gray-800">{proposal.title}</p>
        <p className="text-xs text-gray-400">
          {formatDate(proposal.createdAt)}
        </p>
        {proposal.rejectReason && (
          <p className="text-xs text-red-400">
            반려 사유: {proposal.rejectReason}
          </p>
        )}
        {proposal.categoryNames.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {proposal.categoryNames.map((name) => (
              <span
                key={name}
                className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_LABELS[proposal.status].color}`}
        >
          {STATUS_LABELS[proposal.status].label}
        </span>
        {proposal.status === "REJECTED" && (
          <button
            onClick={() =>
              router.push(`/advertiser/proposals/${proposal.id}/edit`)
            }
            className="px-3 py-1.5 border border-[#538752] text-[#538752] text-xs rounded-lg hover:bg-[#538752] hover:text-white transition-colors"
          >
            수정 후 재심사
          </button>
        )}
      </div>
    </div>
  );
}
