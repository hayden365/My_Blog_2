import PostContent from "../components/postContent";
import { fetchPost, fetchPostList } from "../lib/api/fetch";
import { Post } from "../lib/types/post";

export async function generateStaticParams() {
  const posts = await fetchPostList();

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await fetchPost(slug);

  return <PostContent data={post} />;
}
