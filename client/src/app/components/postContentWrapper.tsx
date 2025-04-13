"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPost } from "../lib/api/fetch";
import PostContent from "./postContent";

const PostContentWrapper = ({ slugAndId }: { slugAndId: string }) => {
  // slugAndId 형식: "slug-65f5d8b1a1234567890abcde"
  const id = slugAndId?.split("-").pop() || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  if (!id) return <div>Invalid post ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <PostContent data={data} />;
};

export default PostContentWrapper;
