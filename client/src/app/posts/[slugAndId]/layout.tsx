import React from "react";

function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="w-full h-full max-w-[800px] mx-5">{children}</div>;
}

export default PostLayout;
