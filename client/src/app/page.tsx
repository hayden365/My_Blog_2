"use client";
import React from "react";
import PostList from "./components/postList";
import { usePosts } from "./hooks/getPosts";

function Home() {
  const { posts, isError, isLoading } = usePosts();
  return (
    <div className="flex justify-center pt-[50px]">
      <PostList posts={posts} isLoading={isLoading} isError={isError} />
    </div>
  );
}

export default Home;
