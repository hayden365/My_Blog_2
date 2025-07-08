import React from "react";

function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="w-full max-w-[800px] mx-auto">{children}</div>;
}

export default PostLayout;
