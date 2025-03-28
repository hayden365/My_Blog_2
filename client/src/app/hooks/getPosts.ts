export interface Post {
  title: string;
  content: string;
  createdAt: string;
  slug: string;
}

export const getAllPosts: () => Promise<Post[]> = async () => {
  const response = await fetch("http://localhost:5001/posts");
  const posts = await response.json();
  return posts;
};
