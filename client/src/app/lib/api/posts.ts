const API_URL = process.env.NEXT_PUBLIC_URL;

export async function getPosts() {
  const res = await fetch(`${API_URL}/posts`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/posts/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}
