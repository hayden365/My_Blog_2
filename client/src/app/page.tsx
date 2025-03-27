import React from "react";
import PostList from "./components/postList";
import { getAllPosts } from "./hooks/getPosts";

function Home() {
  const posts = getAllPosts();
  return (
    <div>
      <h1>Home</h1>
      <PostList posts={posts} />
    </div>
  );
}

export default Home;
