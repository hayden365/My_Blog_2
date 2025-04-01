export default function BlogListSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[680px] mx-6">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex border-b border-gray-100 py-4">
          <div className="flex-1 pr-4">
            <div className="h-7 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
            <div className="flex items-center justify-between pt-5">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
