"use client";
import React from "react";
import PostList from "./components/postList";
import { usePosts } from "./hooks/getPosts";

function Home() {
  const { posts, isError, isLoading } = usePosts();
  return <PostList posts={posts} isLoading={isLoading} isError={isError} />;
}

export default Home;
