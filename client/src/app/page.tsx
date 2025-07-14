import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PostsPageShared from "./components/postsPageShared";
import { generateTagParams, prefetchPostData } from "./lib/utils/ssgUtils";

// SSG를 위한 정적 경로 생성
export async function generateStaticParams() {
  return generateTagParams();
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { tag } = await searchParams;
  const { queryClient, initialPosts, initialTags } =
    await prefetchPostData(tag);
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostsPageShared
        tag={tag}
        initialPosts={initialPosts}
        initialTags={initialTags}
      />
    </HydrationBoundary>
  );
}
