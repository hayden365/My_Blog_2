import React, { useState, useRef, useEffect } from "react";
import StyledDropdown from "./styledDropdown";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../../api/fetch";
import { ProjectData } from "@/app/lib/types/project";
import { usePostStore } from "@/app/lib/store/postStore";

const ProjectSelector = () => {
  const { projects, setProjects } = usePostStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: projectsData } = useQuery<ProjectData[], Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
    enabled: isOpen,
  });

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProjectSelect = (projectId: string) => {
    setProjects([projectId]);
    setIsOpen(false);
  };

  const selectedProject = projectsData?.find((p) => p._id === projects[0]);

  return (
    <div className="p-2 border rounded bg-gray-100 border-gray-300 w-full">
      {/* 프로젝트 선택 영역 */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shrink bg-transparent focus:outline-none text-sm p-1 w-full text-left flex justify-between items-center"
        >
          <span className="text-sm">
            {selectedProject ? selectedProject.title : "Select a project"}
          </span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <StyledDropdown visible={isOpen} className="w-full">
          <div className="py-1">
            <button
              onClick={() => {
                setProjects([]);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              Select a project
            </button>
            {projectsData?.map((project: ProjectData) => (
              <button
                key={project._id}
                onClick={() => handleProjectSelect(project._id)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
              >
                {project.title}
              </button>
            ))}
          </div>
        </StyledDropdown>
      </div>
    </div>
  );
};

export default ProjectSelector;
