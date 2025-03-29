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

// 모든 포스트를 가져오는 훅
export function usePosts() {
  const { data, error, isLoading } = useSWR<Post[]>(
    `${process.env.NEXT_PUBLIC_URL}/posts`,
    fetcher
  );

  return {
    posts: data,
    isLoading,
    isError: error,
  };
}

// 특정 포스트를 가져오는 훅
export function usePost(slug: string) {
  const { data, error, isLoading } = useSWR<Post>(
    `${process.env.NEXT_PUBLIC_URL}/posts/${slug}`,
    fetcher
  );

  return {
    post: data,
    isLoading,
    isError: error,
  };
}
