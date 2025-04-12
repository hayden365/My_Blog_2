import React from "react";

function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="w-full max-w-[680px] mx-6">{children}</div>;
}

export default PostLayout;
