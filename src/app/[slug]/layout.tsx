import React from "react";

function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}

export default PostLayout;
