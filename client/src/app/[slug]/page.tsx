import PostContent from "../components/postContent";
import { fetchPost } from "../lib/api/fetch";
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await fetchPost(params.slug);

  return <PostContent data={post} />;
}
