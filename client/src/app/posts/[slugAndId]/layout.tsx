import React from "react";

function PostLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 w-full min-h-screen max-w-[800px] mx-5">
      {children}
    </div>
  );
}

export default PostLayout;
