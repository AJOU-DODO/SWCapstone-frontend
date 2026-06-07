import type { AdvertiserAccount } from "@/types/indexAdvertiser";
import { formatDate } from "@/utils/formatters";

interface Props {
  account: AdvertiserAccount;
}

export default function AccountStatusCard({ account }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#538752]">
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">총 허용 광고</p>
          <p className="text-2xl font-bold text-gray-800">
            {account.allowedAdCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">게시 중</p>
          <p className="text-2xl font-bold text-[#538752]">
            {account.currentAdCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">심사 대기</p>
          <p className="text-2xl font-bold text-yellow-500">
            {account.pendingAdCount}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">추가 신청 가능</p>
          <p className="text-2xl font-bold text-blue-500">
            {account.remainingAdCount}
          </p>
        </div>
      </div>
      <div
        className={`text-sm px-3 py-2 rounded-lg ${
          account.isExpired
            ? "bg-red-50 text-red-600"
            : "bg-green-50 text-green-700"
        }`}
      >
        {account.isExpired
          ? "⚠️ 권한이 만료되었습니다."
          : `💡 광고 발행 가능 개수: ${account.remainingAdCount}개 | 권한 유효 기한: ${formatDate(account.expiredAt)}`}
      </div>
    </div>
  );
}
