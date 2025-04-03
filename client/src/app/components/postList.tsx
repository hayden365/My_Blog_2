import Link from "next/link";
import React from "react";
import { formatDate } from "../lib/utils/date";
import { Post } from "../lib/types/post";

const PostList = ({ data }: { data: Post[] }) => {
  return (
    <ul className="flex flex-col gap-6 w-full max-w-[680px] mx-6">
      {data.map((post, index) => (
        <li key={index} className="flex border-b border-gray-100 py-4">
          <Link href={`/${post.slug}`} className="flex-1 pr-4 group">
            <div>
              <h2 className="font-inter font-bold text-xl">{post.title}</h2>
              <p className="text-sm text-gray-500 pt-2">{post.subtitle}</p>
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
