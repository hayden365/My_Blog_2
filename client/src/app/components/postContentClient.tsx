"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPost } from "../api/fetch";
import PostContent from "./postContent";

const PostContentClient = ({ slugAndId }: { slugAndId: string }) => {
  // slugAndId 형식: "slug-id"
  const _id = slugAndId?.split("-").pop() || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", _id],
    queryFn: () => getPost(_id),
  });

  if (!_id) return <div>Invalid post ID</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <PostContent data={data} />;
};

export default PostContentClient;
