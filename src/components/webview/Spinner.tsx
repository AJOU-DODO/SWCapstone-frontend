// 로딩중에 사용할 스피너 애니메이션 컴포넌트
export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-7 h-7 border-3",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div className="flex justify-center items-center w-full py-3">
      <div
        className={`${sizeClasses[size]} border-gray-200 border-t-blue-500 rounded-full animate-spin`}
      />
    </div>
  );
}