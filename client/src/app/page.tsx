import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostList, getTags } from "./api/fetch";
import PostsPageClient from "./components/postsPageClient";

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["posts", tag], // tag를 포함한 쿼리키
        queryFn: () => getPostList(tag),
      }),
      queryClient.prefetchQuery({
        queryKey: ["tags"],
        queryFn: () => getTags(),
      }),
    ]);
  } catch (error) {
    console.error("Failed to prefetch data:", error);
    // 에러가 발생해도 빈 상태로 초기화하여 클라이언트에서 다시 시도할 수 있도록 함
    queryClient.setQueryData(["posts", tag], []);
    queryClient.setQueryData(["tags"], []);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsPageClient tag={tag} />
    </HydrationBoundary>
  );
}
