interface Props {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  isLoading,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate}
        max={endDate || undefined}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
      />
      <span className="text-gray-400">~</span>
      <input
        type="date"
        value={endDate}
        min={startDate || undefined}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
      />
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="px-4 py-1.5 bg-[#538752] text-white text-sm rounded-md hover:bg-[#2B6340] transition-colors disabled:opacity-50"
      >
        {isLoading ? "조회 중..." : "조회"}
      </button>
    </div>
  );
}
