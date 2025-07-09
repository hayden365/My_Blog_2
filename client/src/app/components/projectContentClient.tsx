"use client";

import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/fetch";
import { ProjectData } from "../lib/types/project";
import TechTag from "./common/techTag";
import { FaGithub, FaLink } from "react-icons/fa";
import { RiNotionFill } from "react-icons/ri";

const ProjectContentClient = ({ _id }: { _id: string }) => {
  const { data: project, isLoading } = useQuery<ProjectData>({
    queryKey: ["project", _id],
    queryFn: () => getProject(_id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="w-full flex flex-col gap-10">
      {/* 제목 */}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-4xl font-bold">{project.title}</h1>
        <div className="flex gap-2 items-center">
          <span className="text-gray-500 text-sm">
            {project.isGroupProject ? "팀 프로젝트" : "개인 프로젝트"}
          </span>
          •
          <span className="text-gray-500 text-sm">
            {project.myRole.toUpperCase()}
          </span>
        </div>
      </div>
      {/* 요약 */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold border-b border-gray-200 pb-6 w-full">
          Summary
        </h3>
        <div className="flex items-center border-b border-gray-200 py-4">
          <span className="text-gray-500 text-sm w-1/4">Language</span>
          <TechTag name={project.language} />
        </div>
        <div className="flex items-center border-b border-gray-200 py-4">
          <span className="text-gray-500 text-sm w-1/4">Frontend</span>
          {project.frontend_tech.map((tech) => (
            <TechTag key={tech} name={tech} />
          ))}
        </div>
        {project.backend_tech.length > 0 && (
          <div className="flex items-center border-b border-gray-200 py-4">
            <span className="text-gray-500 text-sm w-1/4">Backend</span>
            {project.backend_tech.map((tech) => (
              <TechTag key={tech} name={tech} />
            ))}
          </div>
        )}
        <div className="flex items-center border-b border-gray-200 py-4">
          <span className="text-gray-500 text-sm w-1/4">Period</span>
          <span className="text-sm text-gray-500 mr-4">
            {project.startDate.split("T")[0]}
          </span>
          ~
          {project.endDate ? (
            <span className="text-sm text-gray-500 ml-4">
              {project.endDate.split("T")[0]}
            </span>
          ) : (
            <span className="bg-gray-100 text-red-500 px-2 py-1 rounded-full text-xs ml-4">
              진행 중
            </span>
          )}
        </div>
        <div className="flex items-center border-b border-gray-200 py-4">
          <span className="text-gray-500 text-sm w-1/4">Link</span>
          <div className="flex gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
              >
                <FaGithub className="w-4 h-4 text-black" />
                Github
              </a>
            )}
            {project.links?.notion && (
              <a
                href={project.links.notion}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
              >
                <RiNotionFill className="w-4 h-4 text-black" />
                Notion
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer border border-gray-200 rounded-md px-2 py-1 flex items-center gap-2 text-sm text-gray-500"
              >
                <FaLink className="w-4 h-4 text-black" />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
      {/* 설명 */}
      <div className="w-full flex flex-col gap-2 py-10">
        <h3 className="text-xl font-bold pb-6 w-full">Description</h3>
        <p className="text-gray-500 text-sm">{project.description}</p>
      </div>
      {/* 포스트 목록 */}
      <div className="w-full flex flex-col gap-2 py-10">
        <h3 className="text-xl font-bold pb-6 w-full">Related Posts</h3>
        <div className="flex flex-col gap-2">
          {/* {project.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectContentClient;
