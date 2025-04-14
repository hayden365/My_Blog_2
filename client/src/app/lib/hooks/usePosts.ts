import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      console.log("Fetching posts with queryKey:", ["posts"]);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/posts`);
      return response.json();
    },
  });
};

export function useCreatePost() {
  return useMutation({
    mutationFn: async (post: PostData) => {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(post),
        }
      );
      return response.data;
    },
  });
}

const updatePost = async ({ id, title, content, tags }: PostData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${process.env.NEXT_PUBLIC_URL}/posts/${id}`,
    {
      title,
      content,
      tags,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.refetchQueries({ queryKey: ["posts"] });
    },
  });
};
