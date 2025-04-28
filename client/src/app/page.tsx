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
    <div>
      <HorizontalTabs tags={tags} activeTag={tag} />
      <PostList data={posts} />
    </div>
  );
}
