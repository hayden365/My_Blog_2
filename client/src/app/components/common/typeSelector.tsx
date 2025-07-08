import { POST_TYPES } from "@/app/lib/types/post";
import React, { useEffect, useState } from "react";
import { usePostStore } from "@/app/lib/store/postStore";

const TypeSelector = () => {
  const { types, setTypes } = usePostStore();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(types);

  useEffect(() => {
    setTimeout(() => {
      setTypes(selectedTypes);
    }, 500);
  }, [selectedTypes, setTypes]);

  return (
    <div className="flex justify-around  border rounded-xl bg-gray-100 border-gray-300 w-full">
      {/* 프로젝트 선택 영역 */}
      {POST_TYPES.map((type: { key: string; label: string }, index: number) => (
        <button
          key={type.key}
          className={`text-sm w-full h-full p-2 hover:bg-gray-300 ${selectedTypes.includes(type.key) ? "bg-gray-300" : ""} ${
            index !== POST_TYPES.length - 1
              ? "border-r border-gray-300"
              : "rounded-r-xl"
          } ${index === 0 ? "rounded-l-xl" : ""}`}
          onClick={() => {
            if (selectedTypes.includes(type.key)) {
              setSelectedTypes(selectedTypes.filter((key) => key !== type.key));
            } else {
              setSelectedTypes([...selectedTypes, type.key]);
            }
          }}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default TypeSelector;
