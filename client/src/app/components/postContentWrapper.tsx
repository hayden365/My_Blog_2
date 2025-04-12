"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchPost } from "../lib/api/fetch";
import PostContent from "./postContent";

const PostContentWrapper = ({ slug }: { slug: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <PostContent data={data} />;
};

export default PostContentWrapper;
