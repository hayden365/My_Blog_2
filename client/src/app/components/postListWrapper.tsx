"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPostList } from "@/app/lib/api/fetch";
import PostList from "./postList";

export default function PostListWrapper() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPostList,
  });

  return <PostList data={data ?? []} />;
}
