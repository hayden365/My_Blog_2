import React from "react";
import { ProjectData } from "../lib/types/project";
import ProjectCard from "./projectCard";

interface ProjectListProps {
  data: ProjectData[];
}

const ProjectList = ({ data }: ProjectListProps) => {
  console.log(data);
  return (
    <div className="flex flex-col gap-10">
      {data.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
