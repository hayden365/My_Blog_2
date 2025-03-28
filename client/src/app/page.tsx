import React from "react";
import PostList from "./components/postList";
import { getAllPosts } from "./hooks/getPosts";

function Home() {
  const posts = getAllPosts();
  return (
    <div className="flex justify-center pt-[50px]">
      <PostList posts={posts} />
    </div>
  );
}

export default Home;
