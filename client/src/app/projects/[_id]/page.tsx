import { getProject, getProjectPosts } from "@/app/lib/fetch";
import ProjectContentClient from "@/app/components/projectContentClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ProjectData } from "@/app/lib/types/project";
import { notFound } from "next/navigation";
import { Post } from "@/app/lib/types/post";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["project", _id],
        queryFn: () => getProject(_id),
      }),
      queryClient.prefetchQuery({
        queryKey: ["projectPosts", _id],
        queryFn: () => getProjectPosts(_id),
      }),
    ]);
  } catch (error) {
    console.error("Failed to fetch project:", error);
    queryClient.setQueryData(["project", _id], null);
    queryClient.setQueryData(["projectPosts", _id], []);
  }

  const initialProject =
    queryClient.getQueryData<ProjectData>(["project", _id]) || null;
  const initialProjectPosts = queryClient.getQueryData<{
    posts: Post[];
    typeStats: { [key: string]: number };
  }>(["projectPosts", _id]) || { posts: [], typeStats: {} };

  if (!initialProject) {
    notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectContentClient
        _id={_id}
        initialData={initialProject}
        initialProjectPosts={initialProjectPosts}
      />
    </HydrationBoundary>
  );
}
