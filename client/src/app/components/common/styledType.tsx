import { POST_TYPES } from "@/app/lib/types/post";
import React from "react";

const StyledType = ({ type }: { type: string }) => {
  return (
    <div className="w-fit bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold">
      {POST_TYPES.find((t) => t.key === type)?.label}
    </div>
  );
};

export default StyledType;
