import { ProjectData } from "../lib/types/project";

interface ProjectCardProps {
  project: ProjectData;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-lg font-bold">{project.title}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;
