import React from "react";

const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full mx-auto max-w-[1034px] px-8 py-8">
      {children}
    </div>
  );
};

export default ProjectsLayout;
