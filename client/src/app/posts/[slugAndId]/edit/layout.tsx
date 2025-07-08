import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full mx-auto max-w-[800px] px-6">{children}</div>;
};

export default layout;
