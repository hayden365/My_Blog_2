import { fetchWithAuth } from "../services/authService";
import { PostData } from "../types/post";

const API_URL = process.env.NEXT_PUBLIC_URL;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export async function getPostList() {
  const response = await fetch(`${API_URL}/posts`);
  return handleResponse(response);
}

export async function getPost(_id: string) {
  const response = await fetch(`${API_URL}/posts/${_id}`);
  return handleResponse(response);
}

export const createPost = async (post: PostData) => {
  const response = await fetchWithAuth(`${API_URL}/posts`, {
    method: "POST",
    body: JSON.stringify(post),
  });
  return handleResponse(response);
};

export const updatePost = async ({ _id, title, content, tags }: PostData) => {
  const response = await fetchWithAuth(`${API_URL}/posts/${_id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      content,
      tags,
    }),
  });
  return handleResponse(response);
};

export async function deletePost(_id: string) {
  const response = await fetchWithAuth(`${API_URL}/posts/${_id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}

// 태그 조회
export async function getTags() {
  const response = await fetch(`${API_URL}/tag`);
  return handleResponse(response);
}

// 태그 검색
export async function searchTags(query: string) {
  const response = await fetch(`${API_URL}/tag/search?query=${query}`);
  return handleResponse(response);
}
