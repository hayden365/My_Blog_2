import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPostList } from "../../lib/fetch";
import { Post } from "../../lib/types/post";
import PostContentClient from "../../components/postContentClient";
import { prefetchPostDataBySlugAndId } from "../../lib/utils/ssgUtils";

export async function generateStaticParams() {
  const queryClient = new QueryClient();

  try {
    // posts 쿼리키를 사용하여 포스트 목록을 가져옴
    await queryClient.prefetchQuery({
      queryKey: ["posts"],
      queryFn: () => getPostList(),
    });

    const posts = queryClient.getQueryData<Post[]>(["posts"]) || [];

    return posts.map((post: Post) => ({
      slugAndId: `${post.slug}-${post._id}`,
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  } finally {
    queryClient.clear(); // 메모리 정리
  }
}

type PageProps = {
  params: Promise<{ slugAndId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostPage({ params }: PageProps) {
  const [resolvedParams] = await Promise.all([params]);

  const { queryClient, initialPost } = await prefetchPostDataBySlugAndId(
    resolvedParams.slugAndId?.split("-").pop() || ""
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostContentClient
        slugAndId={resolvedParams.slugAndId}
        initialPost={initialPost}
      />
    </HydrationBoundary>
  );
}
