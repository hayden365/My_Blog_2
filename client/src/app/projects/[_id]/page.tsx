import { getProject } from "@/app/api/fetch";
import ProjectContentClient from "@/app/components/projectContentClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const { _id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["project", _id],
      queryFn: () => getProject(_id),
    });
  } catch (error) {
    console.error("Failed to fetch project:", error);
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectContentClient _id={_id} />
    </HydrationBoundary>
  );
}
