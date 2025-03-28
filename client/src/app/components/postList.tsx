"use client";
import Link from "next/link";
import React, { use } from "react";
import { Post } from "../hooks/getPosts";
import { formatDate } from "../utils/date";

const PostList = ({ posts }: { posts: Promise<Post[]> }) => {
  const allPosts = use(posts);
  return (
    <ul className="flex flex-col gap-6">
      {allPosts.map((post, index) => (
        <li
          key={index}
          className="flex border-b border-gray-100 py-4 min-w-[580px]"
        >
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
