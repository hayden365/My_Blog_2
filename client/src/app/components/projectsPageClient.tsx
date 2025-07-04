"use client";

import React, { useState } from "react";
import { getProjects } from "../api/fetch";
import ProjectList from "./projectList";
import { useQuery } from "@tanstack/react-query";
import ProjectModal from "./projectModal";
import StyledButton from "./common/styledButton";

const ProjectsPageClient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  if (projects.length === 0)
    return (
      <>
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <span>
            아직 추가된 프로젝트가 없습니다 <br /> 프로젝트를 추가해보세요!
          </span>
          <StyledButton
            className="px-5 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            프로젝트 추가
          </StyledButton>
        </div>
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );

  return (
    <div className="w-full max-w-[700px] flex flex-col justify-center items-center pt-6 mx-6">
      <ProjectList data={projects} />
    </div>
  );
};

export default ProjectsPageClient;
