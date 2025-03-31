"use client";
import Link from "next/link";
import React from "react";
import { usePosts } from "../lib/hooks/getPosts";
import { formatDate } from "../lib/utils/date";
import Error from "./common/error";
import Loading from "./common/loading";
import { Post } from "../types/post";

const PostList = ({ initialPosts }: { initialPosts: Post[] }) => {
  const { posts, isError, isLoading } = usePosts(initialPosts);

  if (isError) {
    return <Error message="포스트를 불러오는데 실패했습니다." />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ul className="flex flex-col gap-6 w-full max-w-[680px] mx-6">
      {posts?.map((post, index) => (
        <li key={index} className="flex border-b border-gray-100 py-4">
          <Link href={`/${post.slug}`} className="flex-1 pr-4 group">
            <div>
              <h2 className="font-inter font-bold text-xl">{post.title}</h2>
              <p className="text-sm text-gray-500 pt-2">{post.content}</p>
            </div>
            <div className="flex items-center justify-between pt-5">
              <small>{formatDate(post.createdAt)}</small>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
