import React from "react";
import { use } from "react";

const TagPage = ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = use(params);
  return <div>{tag}</div>;
};

export default TagPage;
