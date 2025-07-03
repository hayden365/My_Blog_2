import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full max-w-[800px] mx-6">{children}</div>;
};

export default layout;
