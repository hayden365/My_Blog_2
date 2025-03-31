import PostContent from "../components/postContent";
import { getPost } from "../lib/api/posts";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const initialPost = await getPost(params.slug);

  return <PostContent initialPost={initialPost} />;
}
