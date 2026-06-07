interface Props {
  label: string;
  total: number;
  today: number;
  color: string;
}

export default function SummaryCard({ label, total, today, color }: Props) {
  return (
    <div className={`bg-white rounded-xl border-l-4 ${color} p-5 shadow-sm`}>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-800">
        {total.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        오늘 +{today.toLocaleString()}
      </p>
    </div>
  );
}
