import Link from "next/link";
import React from "react";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import Image from "next/image";
import { format, register } from "timeago.js";
import koLocale from "timeago.js/lib/lang/ko";
import { useAuthStore } from "../lib/store/authStore";
import StyledType from "./common/styledType";

const PostList = ({ data }: { data: Post[] }) => {
  register("ko", koLocale);
  const { isLoggedIn } = useAuthStore();

  return (
    <ul className="w-full flex flex-col">
      {data.map((post) => (
        <li key={post._id} className="border-b border-gray-100 py-8 mx-6">
          <Link
            href={`/posts/${post.slug}-${post._id}`}
            className="flex flex-col gap-6 pr-4 group"
          >
            <div className="flex gap-10 justify-between w-full">
              <div className="flex flex-col justify-between w-full h-full items-start gap-8">
                <div>
                  <h2 className="font-inter font-bold text-xl text-pretty">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 pt-2">{post.subtitle}</p>
                </div>
                {/* 옵션 메뉴 */}
                <div className="hidden sm:flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2">
                    {post.types.map((type) => {
                      return <StyledType key={type} type={type} />;
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <small>{format(post.createdAt, "ko")}</small>
                    {isLoggedIn && <PostOptionsMenu post={post} />}
                  </div>
                </div>
              </div>
              {post.img_thumbnail && (
                <Image
                  src={post.img_thumbnail}
                  alt={post.title}
                  width={100}
                  height={100}
                  className="w-full h-full max-w-20 max-h-16 sm:max-w-32 sm:max-h-20 object-cover"
                />
              )}
            </div>
            {/* 모바일 버전 */}
            <div className="flex sm:hidden justify-between h-full w-full gap-2">
              <div className="flex items-center gap-2">
                {post.types.map((type) => {
                  return <StyledType key={type} type={type} />;
                })}
              </div>
              <div className="flex items-center gap-2">
                <small>{format(post.createdAt, "ko")}</small>
                {isLoggedIn && <PostOptionsMenu post={post} />}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
