import React from "react";
import { getPostList, getTags } from "./lib/api/fetch";
import HorizontalTabs from "./components/horizontalTabs";
import PostList from "./components/postList";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const { tag } = await searchParams;
  const [posts, tags] = await Promise.all([getPostList(tag), getTags()]);
  return (
    <div className="w-full max-w-[680px] flex flex-col justify-center items-center pt-6 mx-6">
      <HorizontalTabs tags={tags} activeTag={tag} />
      <PostList data={posts} />
    </div>
  );
}
