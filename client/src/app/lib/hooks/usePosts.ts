import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PostData {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/posts`);
      return response.json();
    },
  });
};

export function useCreatePost() {
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

const updatePost = async ({ id, title, content, tags }: PostData) => {
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_URL}/posts/${id}`,
    {
      title,
      content,
      tags,
    }
  );
  return response.data;
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: updatePost,
  });
};
