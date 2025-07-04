import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProjects } from "../api/fetch";
import ProjectsPageClient from "../components/projectsPageClient";

export default async function ProjectsPage() {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["projects"],
      queryFn: () => getProjects(),
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectsPageClient />
    </HydrationBoundary>
  );
}
