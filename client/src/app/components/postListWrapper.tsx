"use client";

import { useQuery } from "@tanstack/react-query";
import { getPostList } from "@/app/lib/api/fetch";
import PostList from "./postList";

export default function PostListWrapper() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPostList(),
  });
  return <PostList data={data ?? []} />;
}
