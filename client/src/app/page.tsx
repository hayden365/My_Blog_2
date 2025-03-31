import React from "react";
import PostList from "./components/postList";
import { getPosts } from "./lib/api/posts";

export default async function Home() {
  const initialPosts = await getPosts();

  return <PostList initialPosts={initialPosts} />;
}
