import React, { useRef, useState } from "react";
import StyledDropdown from "./common/styledDropdown";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import { ProjectData } from "../lib/types/project";
import ProjectModal from "./projectModal";
import { useDeleteProject } from "../lib/hooks/useProject";

interface ProjectOptionsMenuProps {
  project: ProjectData;
}

const ProjectOptionsMenu = ({ project }: ProjectOptionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deleteProject } = useDeleteProject();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        />
      )}
      <div className="relative" ref={menuRef}>
        <button
          className="p-3 rounded-full text-gray-500 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
        <StyledDropdown visible={isOpen}>
          <ul className="w-20 text-sm text-gray-700">
            <li className="hover:bg-gray-50 cursor-pointer">
              <button
                className="flex w-full text-left px-4 py-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  setIsModalOpen(true);
                }}
              >
                수정
              </button>
            </li>
            <li className="hover:bg-gray-50 cursor-pointer">
              <button
                className="flex w-full text-left px-4 py-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsOpen(false);
                  deleteProject(project._id);
                }}
              >
                삭제
              </button>
            </li>
          </ul>
        </StyledDropdown>
      </div>
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
      />
    </>
  );
};

export default ProjectOptionsMenu;
