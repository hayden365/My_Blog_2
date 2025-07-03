import Link from "next/link";
import React from "react";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import Image from "next/image";
import { format, register } from "timeago.js";
import koLocale from "timeago.js/lib/lang/ko";
import { useAuthStore } from "../lib/store/authStore";

const PostList = ({ data }: { data: Post[] }) => {
  register("ko", koLocale);
  const { isLoggedIn } = useAuthStore();

  return (
    <ul className="w-full flex flex-col mx-5">
      {data.map((post) => (
        <li
          key={post._id}
          className="flex flex-col border-b border-gray-100 py-8 mx-6"
        >
          <Link
            href={`posts/${post.slug}-${post._id}`}
            className="flex-1 pr-4 group"
          >
            <div className="flex gap-4 justify-between">
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="font-inter font-bold text-xl">{post.title}</h2>
                  <p className="text-sm text-gray-500 pt-2">{post.subtitle}</p>
                </div>
                <div className="flex items-center pt-5">
                  <small>{format(post.createdAt, "ko")}</small>
                  {isLoggedIn && <PostOptionsMenu post={post} />}
                </div>
              </div>
              {post.img_thumbnail && (
                <Image
                  src={post.img_thumbnail}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="w-32 h-20 object-cover"
                />
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
