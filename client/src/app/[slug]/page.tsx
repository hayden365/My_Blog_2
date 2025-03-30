"use client";
import { use } from "react";
import { formatDate } from "../utils/date";
import { usePost } from "../hooks/getPosts";
import Link from "next/link";

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
      <div className="my-10 prose prose-lg max-w-none">{post.content}</div>
      <ul className="flex gap-2">
        {post.tags?.map((tag) => (
          <Link href={`/tags/${tag}`} key={tag}>
            <li className="text-neutral-800 bg-zinc-100 px-4 py-2 rounded-3xl">
              {tag}
            </li>
          </Link>
        ))}
      </ul>
    </article>
  );
}
