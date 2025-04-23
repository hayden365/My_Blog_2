import Link from "next/link";
import React from "react";
import { formatDate } from "../lib/utils/date";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import HorizontalTabs from "./horizontalTabs";

const PostList = ({ data }: { data: Post[] }) => {
  return (
    <div className="w-full max-w-[680px] flex flex-col justify-center items-center pt-6 mx-6">
      <HorizontalTabs />
      <ul className="w-full flex flex-col mx-5">
        {data.map((post, index) => (
          <li
            key={index}
            className="flex flex-col border-b border-gray-100 pt-8 mx-6"
          >
            <Link
              href={`posts/${post.slug}-${post._id}`}
              className="flex-1 pr-4 group"
            >
              <div>
                <h2 className="font-inter font-bold text-xl">{post.title}</h2>
                <p className="text-sm text-gray-500 pt-2">{post.subtitle}</p>
              </div>
              <div className="flex items-center pt-5">
                <small>{formatDate(post.createdAt)}</small>
                <PostOptionsMenu post={post} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
