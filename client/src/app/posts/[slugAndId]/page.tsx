import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostList, getPost } from "../../api/fetch";
import { Post } from "../../lib/types/post";
import PostContentWrapper from "../../components/postContentWrapper";

export async function generateStaticParams() {
  try {
    const posts = await getPostList();
    return posts.map((post: Post) => ({
      slugAndId: `${post.slug}-${post._id}`,
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

type PageProps = {
  params: Promise<{ slugAndId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostPage({ params, searchParams }: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const _id = resolvedParams.slugAndId?.split("-").pop() || "";
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["post", _id],
      queryFn: () => getPost(_id),
    });
  } catch (error) {
    console.error("Failed to fetch post:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostContentWrapper slugAndId={resolvedParams.slugAndId} />
    </HydrationBoundary>
  );
}
