export default function PostcardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="p-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="relative aspect-[5/3] w-full overflow-hidden rounded-xl bg-gray-200 border border-[#54513E]/30 shadow-sm"
          >
            <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gray-100/50">
              <div className="h-4 w-12 bg-gray-300 rounded-md mb-2" />
              <div className="h-3 w-16 bg-gray-300 rounded mb-1" />
              <div className="h-3 w-3/4 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}