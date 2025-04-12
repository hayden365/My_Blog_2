import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchPost, fetchPostList } from "../../lib/api/fetch";
import { Post } from "../../lib/types/post";
import PostContentWrapper from "../../components/postContentWrapper";

export async function generateStaticParams() {
  const posts = await fetchPostList();

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostContentWrapper slug={slug} />
    </HydrationBoundary>
  );
}
