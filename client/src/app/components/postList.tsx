"use client";
import Link from "next/link";
import React, { use } from "react";
import { Post } from "../hooks/getPosts";

const PostList = ({ posts }: { posts: Promise<Post[]> }) => {
  const allPosts = use(posts);
  return (
    <ul className="grid grid-cols-1 gap-4">
      {allPosts.map((post, index) => (
        <li key={index} className="border p-4 w-64">
          <Link href={`/${post.slug}`}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <small>{post.creatdAt}</small>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
