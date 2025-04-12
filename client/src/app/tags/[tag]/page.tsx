import React from "react";

const TagPage = async ({ params }: { params: { tag: string } }) => {
  const { tag } = await params;
  return <div>{tag}</div>;
};

export default TagPage;
