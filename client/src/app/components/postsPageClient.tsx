"use client";
import { useQuery } from "@tanstack/react-query";
import { getPostList, getTags } from "../api/fetch";
import HorizontalTabs from "./horizontalTabs";
import PostList from "./postList";

interface PostsPageClientProps {
  tag?: string;
}

export default function PostsPageClient({ tag }: PostsPageClientProps) {
  const { data: posts = [] } = useQuery({
    queryKey: ["posts", tag],
    queryFn: () => getPostList(tag),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
  });

  return (
    <div className="w-full max-w-[700px] flex flex-col justify-center items-center pt-6 mx-6">
      <HorizontalTabs tags={tags} activeTag={tag || "all"} />
      <PostList data={posts} />
    </div>
  );
}
