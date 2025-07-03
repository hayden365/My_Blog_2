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
    console.error("Failed to fetch data:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsPageClient tag={tag} />
    </HydrationBoundary>
  );
}
