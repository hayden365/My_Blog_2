"use client";
import React, { useEffect, useState } from "react";
import Button from "./common/button";
import { usePostStore } from "../store/postStore";
import { useDebounce } from "../lib/hooks/useDebounce";
import useTagSearch from "../lib/hooks/useTagSearch";
import { Tag } from "../lib/types/post";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  handlePublish: () => void;
}

const PublishModal = ({
  isOpen,
  onClose,
  handlePublish,
}: PublishModalProps) => {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 300);
  const { data: suggestions } = useTagSearch(debouncedInput);
  const { title, content, tags, addTag, removeTag } = usePostStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* dim 처리된 배경 */}
      <div className="absolute inset-0 bg-white"></div>

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 bg-white p-6 w-11/12 max-w-[1040px] transition-transform duration-300 ease-out starting:opacity-0 starting:scale-50 opacity-100 scale-100">
        <div className="flex items-center justify-between gap-16 flex-col md:flex-row">
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-xl font-bold">Story Preview</h2>
            {/* 이미지 들어갈 자리 */}
            <div className="w-full h-[200px] bg-gray-200 rounded-lg"></div>
            <p className="text-2xl font-bold border-b border-gray-200 pb-1">
              {title}
            </p>
            <p className="text-sm border-b border-gray-200 pb-1">
              {content.slice(0, 50)}
            </p>
          </div>

          {/* Tag Section */}
          <div className="flex flex-col gap-4 w-full max-w-xl">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>

            <div className="flex flex-wrap items-center gap-2 p-2 border rounded bg-gray-50">
              {tags.map((tag) => (
                <span
                  key={tag.name}
                  className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag.name}
                  <button
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add a topic..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm p-1"
              />
            </div>

            {/* 자동완성 예시 */}
            {input && suggestions?.length > 0 && (
              <div className="mt-1 w-full bg-white border rounded shadow-md z-20">
                <ul className="max-h-60 overflow-y-auto">
                  {suggestions.map((tag: Tag) => (
                    <li
                      key={tag.name}
                      onClick={() => {
                        addTag(tag);
                        setInput(""); // 입력 초기화
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="font-semibold">{tag.name}</span>{" "}
                      <span className="text-sm text-gray-500">
                        ({tag.count.toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </div>

          <button
            className="absolute top-[-30px] right-[30px] cursor-pointer"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishModal;
