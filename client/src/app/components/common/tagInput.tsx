import React, { useState } from "react";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import useTagSearch from "@/app/lib/hooks/useTagSearch";
import { usePostStore } from "@/app/store/postStore";
import { Tag } from "@/app/lib/types/post";

const TagInput = () => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 500);
  const { data: suggestions } = useTagSearch(debouncedInput);
  const { tags, addTag, removeTag } = usePostStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const value = input.trim();
      addTag(value);
      setInput("");
    }

    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded bg-gray-100 border-gray-300">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex-none bg-white border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          {tag}
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={() => removeTag(tag)}
          >
            &times;
          </button>
        </span>
      ))}
      <div className="relative">
        <input
          type="text"
          placeholder="Add a topic..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="shrink bg-transparent focus:outline-none text-sm p-1"
        />

        {/* 자동완성 드롭다운 */}
        {input && suggestions?.length > 0 && (
          <div className="absolute w-auto top-full left-0 mt-1   z-30">
            {/* 꼬리 (말풍선 화살표) */}
            {/* 테두리용 삼각형 */}
            <div className="absolute top-[-7px] left-1.5 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-200 z-10" />
            {/* 내용 삼각형 */}
            <div className="absolute top-[-6px] left-1.5 w-0 h-0 border-x-7 border-x-transparent border-b-7 border-b-white z-20" />

            <ul className="max-h-60 w-full overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
              {suggestions.map((tag: Tag) => (
                <li
                  key={tag.name}
                  onClick={() => {
                    addTag(tag.name);
                    setInput("");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="font-bold text-gray-800">{tag.name}</span>{" "}
                  <span className="text-sm text-gray-500">({tag.count})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
