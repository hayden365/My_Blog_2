import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const ProjectPage = ({ params }: { params: { _id: string } }) => {
  // const { _id } = params;
  // const queryClient = new QueryClient();
  // try {
  //   await queryClient.prefetchQuery({
  //     queryKey: ["project", _id],
  //     queryFn: () => getProject(_id),
  //   });
  // } catch (error) {
  //   console.error("Failed to fetch project:", error);
  // }
  // const dehydratedState = dehydrate(queryClient);
  // return (
  //   <HydrationBoundary state={dehydratedState}>
  //     <ProjectPageClient _id={_id} />
  //   </HydrationBoundary>
  // );
};

export default ProjectPage;
