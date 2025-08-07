import Image from "next/image";
import { ProjectData } from "../lib/types/project";
import Link from "next/link";
import TechTag from "./common/techTag";
import ProjectOptionsMenu from "./projectOptionsMenu";
import { useAuthStore } from "../lib/store/authStore";

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { isLoggedIn } = useAuthStore();
  return (
    <Link
      href={`/projects/${project._id}`}
      className="w-full flex flex-col md:flex-row gap-4 "
    >
      <Image
        src={project.coverImg}
        alt={project.title}
        width={1000}
        height={1000}
        className="w-full h-full max-w-110 max-h-70 object-cover object-top rounded-lg"
      />
      <div className="w-full flex flex-col gap-2 py-2 md:w-2/5">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <div className="w-full flex flex-col gap-4 text-gray-600">
          <div className="flex gap-2 items-center">
            <span className="text-sm">
              {project.isGroupProject ? "팀 프로젝트" : "개인 프로젝트"}
            </span>
            •<span className="text-sm">{project.myRole.toUpperCase()}</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <span className="text-sm w-1/5">Language:</span>
              <div className="flex gap-2 w-4/5">
                <TechTag name={project.language} />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-sm w-1/5">Frontend:</span>
              <div className="flex gap-2 flex-wrap w-4/5">
                {project.frontend_tech.map((tech) => (
                  <TechTag key={tech} name={tech} />
                ))}
              </div>
            </div>
            {project.backend_tech.length > 0 && (
              <div className="flex gap-2">
                <span className="text-sm w-1/5">Backend:</span>
                <div className="flex gap-2 flex-wrap w-4/5">
                  {project.backend_tech.map((tech) => (
                    <TechTag key={tech} name={tech} />
                  ))}
                </div>
              </div>
            )}
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
            <div>{isLoggedIn && <ProjectOptionsMenu project={project} />}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
