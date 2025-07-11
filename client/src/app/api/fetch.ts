import { fetchWithAuth } from "../lib/services/authService";
import { PostData } from "../lib/types/post";
import { ProjectData } from "../lib/types/project";

const API_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3001";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export async function getPostList(tag?: string) {
  try {
    const url = new URL(`${API_URL}/posts`);
    if (tag) {
      url.searchParams.append("tag", tag);
    }

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch post list:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

export async function getPost(_id: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${_id}`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null; // null 반환으로 서버 렌더링 오류 방지
  }
}

export const createPost = async (post: PostData) => {
  const response = await fetchWithAuth(`${API_URL}/posts`, {
    method: "POST",
    body: JSON.stringify(post),
  });
  return handleResponse(response);
};

export const updatePost = async (post: PostData) => {
  const response = await fetchWithAuth(`${API_URL}/posts/${post._id}`, {
    method: "PUT",
    body: JSON.stringify({
      post,
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
  try {
    const response = await fetch(`${API_URL}/tag`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

// 태그 검색
export async function searchTags(query: string) {
  try {
    const response = await fetch(`${API_URL}/tag/search?query=${query}`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to search tags:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

/* 프로젝트 */
// 프로젝트 조회
export async function getProjects() {
  try {
    const response = await fetch(`${API_URL}/projects`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

export async function getProject(_id: string) {
  try {
    const response = await fetch(`${API_URL}/projects/${_id}`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null; // null 반환으로 서버 렌더링 오류 방지
  }
}

// 프로젝트 생성
export const createProject = async (project: ProjectData) => {
  const response = await fetchWithAuth(`${API_URL}/projects`, {
    method: "POST",
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

// 프로젝트 포스트 조회
export async function getProjectPosts(_id: string) {
  try {
    const response = await fetch(`${API_URL}/posts/project/${_id}`);
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch project posts:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

// 프로젝트 수정
export const updateProject = async (project: ProjectData) => {
  const response = await fetchWithAuth(`${API_URL}/projects/${project._id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
  return handleResponse(response);
};

// 프로젝트 삭제
export async function deleteProject(_id: string) {
  const response = await fetchWithAuth(`${API_URL}/projects/${_id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
