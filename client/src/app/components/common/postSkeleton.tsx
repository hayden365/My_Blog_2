export default function PostSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[680px] mx-6 py-13">
      <div className="h-7 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
      <div className="h-80 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mt-2"></div>
    </div>
  );
}
