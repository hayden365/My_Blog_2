import Image from "next/image";
import { ProjectData } from "../lib/types/project";
import { LinkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import TechTag from "./common/techTag";

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${project._id}`} className="w-full flex gap-4 ">
      <Image
        src={project.coverImg}
        alt={project.title}
        width={1000}
        height={1000}
        className="w-full h-auto max-w-110 max-h-90 object-cover rounded-lg"
      />
      <div className="w-full flex flex-col gap-2 py-2">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <div className="w-full flex flex-col gap-4 text-gray-600">
          <span>{project.description}</span>
          <div className="flex gap-2 items-center">
            <span className="text-sm">
              {project.isGroupProject ? "팀 프로젝트" : "개인 프로젝트"}
            </span>
            •<span className="text-sm">{project.myRole.toUpperCase()}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <span className="text-sm">Language:</span>
              <TechTag name={project.language} />
            </div>
            <div className="flex gap-2">
              <span className="text-sm">Frontend:</span>
              {project.frontend_tech.map((tech) => (
                <TechTag key={tech} name={tech} />
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm">Backend:</span>
              {project.backend_tech.map((tech) => (
                <TechTag key={tech} name={tech} />
              ))}
            </div>
          </div>
          <div className="text-sm flex items-center gap-2">
            <span className="text-sm">{project.startDate.split("T")[0]}</span>~
            {project.endDate ? (
              <span className=" text-sm">{project.endDate.split("T")[0]}</span>
            ) : (
              <span className="bg-gray-100 text-red-500 px-2 py-1 rounded-full text-xs">
                진행 중
              </span>
            )}
          </div>
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
