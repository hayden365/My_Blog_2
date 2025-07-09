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
      {/* {data.map((project) => ( */}
      <ProjectCard key={data[0]._id} project={data[0]} />
      <ProjectCard key="dlkjsfoeifjs" project={data[0]} />
      <ProjectCard key="dlkjsfoeifjsdsfse" project={data[0]} />
      {/* ))} */}
    </div>
  );
};

export default ProjectList;
