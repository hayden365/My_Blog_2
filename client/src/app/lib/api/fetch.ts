import { PostData } from "../types/post";

const API_URL = process.env.NEXT_PUBLIC_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export async function getPostList() {
  const res = await fetch(`${API_URL}/posts`);
  return handleResponse(res);
}

export async function getPost(_id: string) {
  const res = await fetch(`${API_URL}/posts/${_id}`);
  return handleResponse(res);
}

export const createPost = async (post: PostData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });
  return handleResponse(response);
};

export const updatePost = async ({ _id, title, content, tags }: PostData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/posts/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      tags,
    }),
  });
  return handleResponse(response);
};

export async function deletePost(_id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/posts/${_id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

// 태그 조회
export async function getTags() {
  const res = await fetch(`${API_URL}/tag`);
  return handleResponse(res);
}

// 태그 검색
export async function searchTags(query: string) {
  const res = await fetch(`${API_URL}/tag/search?query=${query}`);
  return handleResponse(res);
}
