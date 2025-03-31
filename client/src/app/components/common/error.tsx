interface ErrorProps {
  message?: string;
}

export default function Error({
  message = "데이터를 불러오는데 실패했습니다.",
}: ErrorProps) {
  return (
    <div className="flex justify-center items-center h-[200px] text-red-500">
      {message}
    </div>
  );
}
