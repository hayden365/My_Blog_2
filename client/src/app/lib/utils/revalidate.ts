const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET;

export async function revalidateTag(tag: string) {
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tag,
        secret: REVALIDATE_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`Successfully revalidated tag: ${tag}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to revalidate tag ${tag}:`, error);
    throw error;
  }
}

export async function revalidatePath(path: string) {
  try {
    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        secret: REVALIDATE_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`Successfully revalidated path: ${path}`, result);
    return result;
  } catch (error) {
    console.error(`Failed to revalidate path ${path}:`, error);
    throw error;
  }
}

// 포스트 관련 revalidation 함수들
export async function revalidatePost(postId: string) {
  await Promise.all([
    revalidateTag(`post-${postId}`),
    revalidatePath("/posts"),
  ]);
}

export async function revalidatePosts() {
  await Promise.all([revalidateTag("posts"), revalidatePath("/posts")]);
}

// 프로젝트 관련 revalidation 함수들
export async function revalidateProject(projectId: string) {
  await Promise.all([
    revalidateTag(`project-${projectId}`),
    revalidatePath("/projects"),
  ]);
}

export async function revalidateProjects() {
  await Promise.all([revalidateTag("projects"), revalidatePath("/projects")]);
}

// 태그 관련 revalidation 함수들
export async function revalidateTags() {
  await Promise.all([revalidateTag("tags"), revalidateTag("tag-search")]);
}

// 특정 태그의 포스트들 revalidation
export async function revalidatePostsByTag(tag: string) {
  await Promise.all([revalidateTag(`posts-${tag}`), revalidatePath("/posts")]);
}

// 디버깅을 위한 revalidation 상태 확인
export async function testRevalidation(tag?: string, path?: string) {
  try {
    const params = new URLSearchParams();
    if (tag) params.append("tag", tag);
    if (path) params.append("path", path);

    const response = await fetch(`/api/revalidate/test?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Test revalidation failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Test revalidation result:", result);
    return result;
  } catch (error) {
    console.error("Test revalidation error:", error);
    throw error;
  }
}

// 모든 캐시 무효화 (개발 환경에서만 사용)
export async function revalidateAll() {
  if (process.env.NODE_ENV === "production") {
    console.warn("revalidateAll should not be used in production");
    return;
  }

  try {
    await Promise.all([
      revalidatePath("/"),
      revalidatePath("/posts"),
      revalidatePath("/projects"),
    ]);
    console.log("All caches revalidated");
  } catch (error) {
    console.error("Failed to revalidate all caches:", error);
    throw error;
  }
}
