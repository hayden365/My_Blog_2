import React from "react";

type PageProps = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const TagPage = async ({ params, searchParams }: PageProps) => {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const { tag } = resolvedParams;
  return <div>{tag}</div>;
};

export default TagPage;
