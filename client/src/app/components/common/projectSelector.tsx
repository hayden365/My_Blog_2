import React, { useState } from "react";
import StyledDropdown from "./styledDropdown";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../api/fetch";
import { ProjectData } from "@/app/lib/types/project";
import { usePostStore } from "@/app/lib/store/postStore";

const ProjectSelector = () => {
  const { projects, setProjects } = usePostStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: projectsData = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isOpen,
  });
  console.log(projects);
  return (
    <div className="p-2 border rounded bg-gray-100 border-gray-300 w-full">
      {/* 프로젝트 선택 영역 */}
      <div className="relative">
        <select
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          onChange={(e) => {
            setProjects([e.target.value]);
          }}
          defaultValue={projects[0] ?? ""}
          className="shrink bg-transparent focus:outline-none text-sm p-1 w-full"
        >
          <StyledDropdown visible={true} className="w-full">
            <option className="text-sm p-1" value="">
              Select a project
            </option>
            {projectsData.map((project: ProjectData) => (
              <option
                key={project._id}
                className="text-sm p-1"
                value={project._id}
              >
                {project.title}
              </option>
            ))}
          </StyledDropdown>
        </select>
      </div>
    </div>
  );
};

export default ProjectSelector;
