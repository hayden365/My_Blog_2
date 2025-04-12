import React from "react";
const layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-[1034px] mx-auto">{children}</div>;
};

export default layout;
