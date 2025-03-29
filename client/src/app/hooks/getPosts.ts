"use client";
import useSWR from "swr";

export interface Post {
  title: string;
  content: string;
  createdAt: string;
  slug: string;
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function usePosts() {
  const { data, error, isLoading } = useSWR<Post[]>(
    "http://localhost:5001/posts",
    fetcher
  );

  return {
    posts: data,
    isLoading,
    isError: error,
  };
}
