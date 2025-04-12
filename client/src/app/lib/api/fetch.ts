const API_URL = process.env.NEXT_PUBLIC_URL;

export async function fetchPostList() {
  const res = await fetch(`${API_URL}/posts`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function fetchPost(slug: string) {
  const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
    cache: "force-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}
