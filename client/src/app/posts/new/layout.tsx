import React from "react";

export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full mx-auto max-w-[800px] px-6">{children}</div>;
}
