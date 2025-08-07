import { fetchWithAuth } from "./services/authService";
import { PostData } from "./types/post";
import { ProjectData } from "./types/project";

const API_URL = process.env.NEXT_PUBLIC_URL;

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
      // SSG를 위한 캐싱 설정
      next: {
        revalidate: 30, // 1시간마다 재검증
        tags: ["posts", tag || "all"], // 캐시 태그로 무효화 가능
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch post list:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

export async function getPost(_id: string) {
  try {
    const response = await fetch(`${API_URL}/posts/${_id}`, {
      // 개별 포스트도 캐싱
      next: {
        revalidate: 30,
        tags: ["post", _id],
      },
    });
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
    const response = await fetch(`${API_URL}/tag`, {
      // 태그는 자주 변경되지 않으므로 더 긴 캐시
      next: {
        revalidate: 7200, // 2시간마다 재검증
        tags: ["tags"],
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

// 태그 검색
export async function searchTags(query: string) {
  try {
    const response = await fetch(`${API_URL}/tag/search?query=${query}`, {
      // 검색 결과는 짧은 캐시
      next: {
        revalidate: 1800, // 30분마다 재검증
        tags: ["tag-search"],
      },
    });
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
    const response = await fetch(`${API_URL}/projects`, {
      // 프로젝트도 캐싱
      next: {
        revalidate: 10,
        tags: ["projects"],
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return []; // 빈 배열 반환으로 서버 렌더링 오류 방지
  }
}

export async function getProject(_id: string) {
  try {
    const response = await fetch(`${API_URL}/projects/${_id}`, {
      // 개별 프로젝트도 캐싱
      next: {
        revalidate: 10,
        tags: ["project", _id],
      },
    });
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
    const response = await fetch(`${API_URL}/posts/project/${_id}`, {
      // 프로젝트 포스트도 캐싱
      next: {
        revalidate: 3600,
        tags: ["project-posts", _id],
      },
    });
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
