"use client";
import React, { useEffect } from "react";
import Button from "./common/styledGreenButton";
import { usePostStore } from "../lib/store/postStore";
import TagInput from "./common/tagInput";
import ImageUploader from "./imageUploader";
import ProjectSelector from "./common/projectSelector";
import TypeSelector from "./common/typeSelector";

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
  const { title, img_thumbnail, setImgThumbnail } = usePostStore();

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
        <div className="flex items-center justify-center gap-14 flex-col md:flex-row">
          {/* 왼쪽 컨텐츠 */}
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-xl font-bold">Story Preview</h2>
            {/* 이미지 들어갈 자리 */}
            <div className="w-full h-[200px] bg-gray-200 rounded-lg">
              <ImageUploader
                image={img_thumbnail}
                imageSetter={setImgThumbnail}
              />
            </div>
            <p className="text-2xl font-bold border-b border-gray-200 pb-1">
              {title}
            </p>
            {/* <p className="text-sm border-b border-gray-200 pb-1">
              {content.slice(0, 50)}
            </p> */}
          </div>

          {/* 오른쪽 컨텐츠 */}
          <div className="flex flex-col gap-4 w-full max-w-xl">
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mt-1">
                About
              </label>
              <TagInput />
            </div>

            {/* 프로젝트 선택 영역 */}
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mt-1">
                Project
              </label>
              <ProjectSelector />
            </div>
            <div className="flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mt-1">
                Type
              </label>
              <TypeSelector />
            </div>
          </div>
          <div className="absolute right-[30px] bottom-[-30px]">
            <Button onClick={handlePublish}>Publish</Button>
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
              stroke="gray"
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
