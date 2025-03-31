import useSWR from "swr";
import { Post } from "../../types/post";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

// 모든 포스트를 가져오는 훅
export function usePosts(fallbackData: Post[]) {
  const { data, error, isLoading } = useSWR<Post[]>(
    `${process.env.NEXT_PUBLIC_URL}/posts`,
    fetcher,
    { fallbackData }
  );

  return {
    posts: data,
    isLoading,
    isError: error,
  };
}

// 특정 포스트를 가져오는 훅
export function usePost(slug: string, fallbackData: Post) {
  const { data, error, isLoading } = useSWR<Post>(
    `${process.env.NEXT_PUBLIC_URL}/posts/${slug}`,
    fetcher,
    { fallbackData }
  );

  return {
    post: data,
    isLoading,
    isError: error,
  };
}
