import React from "react";
import PostList from "./components/postList";
import { useGetPosts } from "./lib/hooks/usePosts";

export default function Home() {
  const { data: postList } = useGetPosts();

  return <PostList data={postList} />;
}
