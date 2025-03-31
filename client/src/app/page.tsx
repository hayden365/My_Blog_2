import React from "react";
import PostList from "./components/postList";
import { getPosts } from "./lib/api/posts";

export default async function Home() {
  const initialPosts = await getPosts();

  return (
    <div className="flex justify-center pt-[50px]">
      <PostList initialPosts={initialPosts} />
    </div>
  );
}
