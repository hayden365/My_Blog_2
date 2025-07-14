import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProjects } from "../api/fetch";
import ProjectsPageClient from "../components/projectsPageClient";
import { Project } from "../lib/types/post";

export async function generateStaticParams() {
  const queryClient = new QueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: ["projects"],
      queryFn: () => getProjects(),
    });
    const projects = queryClient.getQueryData<Project[]>(["projects"]) || [];
    return projects.map((project) => ({
      _id: project._id,
    }));
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  } finally {
    queryClient.clear();
  }
}

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
  const initialProjects =
    queryClient.getQueryData<Project[]>(["projects"]) || [];
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProjectsPageClient initialProjects={initialProjects} />
    </HydrationBoundary>
  );
}
