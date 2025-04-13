import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchPostList, getPost } from "../../lib/api/fetch";
import { Post } from "../../lib/types/post";
import PostContentWrapper from "../../components/postContentWrapper";

export async function generateStaticParams() {
  const posts = await fetchPostList();

  const params = posts.map((post: Post) => ({
    slugAndId: `${post.slug}-${post._id}`,
  }));

  return params;
}

export default async function PostPage({
  params,
}: {
  params: { slugAndId: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams.slugAndId?.split("-").pop() || "";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostContentWrapper slugAndId={resolvedParams.slugAndId} />
    </HydrationBoundary>
  );
}
