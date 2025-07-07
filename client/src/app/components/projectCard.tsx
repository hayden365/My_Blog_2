import Image from "next/image";
import { ProjectData } from "../lib/types/project";
import { LinkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      href={`/projects/${project._id}`}
      className="w-full flex flex-col gap-4 border border-gray-200 rounded-lg p-4 shadow-md"
    >
      <Image
        src={project.coverImg}
        alt={project.title}
        width={1000}
        height={1000}
        className="w-full h-auto"
      />
      <div className="w-full border-b border-gray-200" />
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-lg font-bold">{project.title}</h3>
        <div className="w-full flex flex-col gap-2">
          <div className="flex gap-2">
            <span>{project.isGroupProject ? "Group" : "Solo"}</span>
            <span>{project.myRole}</span>
          </div>
          <span>{project.language}</span>
          <span>{project.frontend_tech.map((tech) => tech).join(", ")}</span>
          <span>{project.backend_tech.map((tech) => tech).join(", ")}</span>
          <span>
            {project.startDate} ~ {project.endDate ?? "진행 중"}
          </span>
          {project.links?.github !== "" && (
            <div className="flex gap-2">
              <LinkIcon className="w-4 h-4" />
              <a href={project.links?.github} target="_blank">
                Github
              </a>
              <LinkIcon className="w-4 h-4" />
              <a href={project.links?.notion} target="_blank">
                Notion
              </a>
              <LinkIcon className="w-4 h-4" />
              <a href={project.links?.demo} target="_blank">
                Demo
              </a>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
