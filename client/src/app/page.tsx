import React from "react";
import PostList from "./components/postList";
import { fetchPostList } from "./lib/api/fetch";

export default async function Home() {
  const postList = await fetchPostList();

  return <PostList data={postList} />;
}
