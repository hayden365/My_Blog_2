"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getPost } from "../lib/fetch";
import PostContent from "./postContent";
import { Post } from "../lib/types/post";
import PostSkeleton from "./common/postSkeleton";

const PostContentClient = ({
  slugAndId,
  initialPost = null,
}: {
  slugAndId: string;
  initialPost: Post | null;
}) => {
  // slugAndId 형식: "slug-id"
  const _id = slugAndId?.split("-").pop() || "";

  const {
    data = initialPost,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", _id],
    queryFn: () => getPost(_id),
    initialData: initialPost,
  });

  if (!_id) return <div>Invalid post ID</div>;
  if (isLoading) return <PostSkeleton />;
  if (error) return <div>Error: {error.message}</div>;

  return <PostContent data={data} />;
};

export default PostContentClient;
