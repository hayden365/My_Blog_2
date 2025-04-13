import React from "react";

export default function NewPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-[680px] mx-auto px-6">{children}</div>;
}
