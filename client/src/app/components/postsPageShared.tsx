"use client";
import { useQuery } from "@tanstack/react-query";
import { getPostList, getTags } from "../api/fetch";
import HorizontalTabs from "./horizontalTabs";
import PostList from "./postList";
import { Post, Tag } from "../lib/types/post";

interface PostsPageSharedProps {
  tag?: string;
  initialPosts?: Post[];
  initialTags?: Tag[];
}

export default function PostsPageShared({
  tag,
  initialPosts = [],
  initialTags = [],
}: PostsPageSharedProps) {
  const { data: posts = initialPosts } = useQuery({
    queryKey: ["posts", tag],
    queryFn: () => getPostList(tag),
    initialData: initialPosts.length > 0 ? initialPosts : undefined,
  });

  const { data: tags = initialTags } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
    initialData: initialTags.length > 0 ? initialTags : undefined,
  });

  return (
    <div className="w-full max-w-[700px] flex flex-col justify-center items-center pt-6 mx-6">
      <HorizontalTabs tags={tags} activeTag={tag || "all"} />
      <PostList data={posts} />
    </div>
  );
}
