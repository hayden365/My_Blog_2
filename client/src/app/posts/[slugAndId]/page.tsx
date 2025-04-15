import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostList, getPost } from "../../lib/api/fetch";
import { Post } from "../../lib/types/post";
import PostContentWrapper from "../../components/postContentWrapper";

export async function generateStaticParams() {
  const posts = await getPostList();

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
  const _id = resolvedParams.slugAndId?.split("-").pop() || "";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", _id],
    queryFn: () => getPost(_id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostContentWrapper slugAndId={resolvedParams.slugAndId} />
    </HydrationBoundary>
  );
}
