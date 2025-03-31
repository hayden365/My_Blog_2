"use client";
import { formatDate } from "../lib/utils/date";
import Link from "next/link";
import { usePost } from "../lib/hooks/getPosts";
import { Post } from "../types/post";
import Loading from "./common/loading";
import Error from "./common/error";

const PostContent = ({ initialPost }: { initialPost: Post }) => {
  const { post, isLoading, isError } = usePost(initialPost.slug, initialPost);

  if (isError || !post) {
    return <Error message="포스트를 불러오는데 실패했습니다." />;
  }

  if (isLoading) {
    return <Loading />;
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
};

export default PostContent;
