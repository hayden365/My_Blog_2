import { QueryClient } from "@tanstack/react-query";
import { getPostList, getTags } from "../fetch";
import { Post, Tag } from "../types/post";

// SSG를 위한 정적 경로 생성
export async function generateTagParams() {
  const queryClient = new QueryClient();

  try {
    // 모든 태그를 가져와서 각 태그별로 정적 페이지 생성
    await queryClient.prefetchQuery({
      queryKey: ["tags"],
      queryFn: () => getTags(),
    });

    const tags = queryClient.getQueryData<Tag[]>(["tags"]) || [];

    // "all" 태그와 각 개별 태그에 대한 경로 생성
    const params = [{ tag: "all" }];
    tags.forEach((tag) => {
      params.push({ tag: tag.name });
    });

    return params;
  } catch (error) {
    console.error("Failed to generate tag params:", error);
    return [{ tag: "all" }];
  } finally {
    queryClient.clear();
  }
}

// 포스트 데이터 프리페치
export async function prefetchPostData(tag?: string) {
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["posts", tag],
        queryFn: () => getPostList(tag),
      }),
      queryClient.prefetchQuery({
        queryKey: ["tags"],
        queryFn: () => getTags(),
      }),
    ]);
  } catch (error) {
    console.error("Failed to prefetch data:", error);
    // 에러가 발생해도 빈 상태로 초기화하여 클라이언트에서 다시 시도할 수 있도록 함
    queryClient.setQueryData(["posts", tag], []);
    queryClient.setQueryData(["tags"], []);
  }

  const dehydratedState =
    queryClient.getQueryData<Post[]>(["posts", tag]) || [];
  const initialTags = queryClient.getQueryData<Tag[]>(["tags"]) || [];

  return {
    queryClient,
    dehydratedState,
    initialPosts: dehydratedState,
    initialTags,
  };
}
