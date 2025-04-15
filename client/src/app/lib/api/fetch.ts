import axios from "axios";
import { PostData } from "../types/post";

const API_URL = process.env.NEXT_PUBLIC_URL;

export async function getPostList() {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
}

export async function getPost(_id: string) {
  const res = await axios.get(`${API_URL}/posts/${_id}`);
  return res.data;
}

export const updatePost = async ({ _id, title, content, tags }: PostData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/posts/${_id}`,
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

export async function deletePost(_id: string) {
  const token = localStorage.getItem("token");
  const res = await axios.delete(`${API_URL}/posts/${_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
