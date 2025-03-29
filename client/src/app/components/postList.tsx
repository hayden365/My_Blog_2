"use client";
import Link from "next/link";
import React from "react";
import { Post } from "../hooks/getPosts";
import { formatDate } from "../utils/date";

const PostList = ({
  posts,
  isLoading,
  isError,
}: {
  posts: Post[] | undefined;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[200px] text-red-500">
        포스트를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (!posts) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-6 w-full max-w-[680px] mx-6">
      {posts.map((post, index) => (
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
