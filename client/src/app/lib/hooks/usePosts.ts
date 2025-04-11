import { useMutation } from "@tanstack/react-query";

interface PostData {
  title: string;
  content: string;
  tags: string[];
}

export default function useCreatePost() {
  return useMutation({
    mutationFn: async (post: PostData) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return response.json();
    },
  });
}
