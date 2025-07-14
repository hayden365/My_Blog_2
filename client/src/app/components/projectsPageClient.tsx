"use client";

import React, { useState } from "react";
import { getProjects } from "../lib/fetch";
import ProjectList from "./projectList";
import { useQuery } from "@tanstack/react-query";
import ProjectModal from "./projectModal";
import StyledButton from "./common/styledButton";
import { useAuthStore } from "../lib/store/authStore";
import { Project } from "../lib/types/post";

const ProjectsPageClient = ({
  initialProjects,
}: {
  initialProjects: Project[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
    initialData: initialProjects,
  });

  if (isLoggedIn && projects.length === 0)
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
    <div className="w-full flex flex-col gap-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-gray-500 text-sm">
            개발 경험을 담은 주요 프로젝트들을 소개합니다.
          </p>
        </div>
        {isLoggedIn && (
          <StyledButton
            className="self-end px-5 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            프로젝트 추가
          </StyledButton>
        )}
      </div>
      <ProjectList data={projects} />
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProjectsPageClient;
