"use client";
import { use } from "react";
import { formatDate } from "../utils/date";
import { usePost } from "../hooks/getPosts";

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { post, isLoading, isError } = usePost(slug);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex justify-center items-center h-[200px] text-red-500">
        포스트를 불러오는데 실패했습니다.
      </div>
    );
  }

  return (
    <article className="py-8">
      <header className="border-b border-gray-100 pb-8">
        <h1 className="text-[42px] font-bold mb-8">{post.title}</h1>
        <time className="text-gray-500">{formatDate(post.createdAt)}</time>
      </header>
      <div className="mt-10 prose prose-lg max-w-none">{post.content}</div>
    </article>
  );
}
