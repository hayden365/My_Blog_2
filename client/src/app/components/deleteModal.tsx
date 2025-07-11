"use client";
import React, { useEffect } from "react";
import StyledGreenButton from "./common/styledGreenButton";

const DeleteModal = ({
  isOpen,
  onClose,
  handleDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  handleDelete: () => void;
}) => {
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
      <div
        className="cursor-default absolute inset-0 bg-white/95"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose();
        }}
      >
        {" "}
      </div>

      {/* 모달 컨텐츠 */}
      <div className="relative z-10 bg-white p-11 w-3/5 h-5/12 shadow-md flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold">Delete Post</h2>
          <p className="text-sm text-gray-500 pt-1.5 pb-9">
            Are you sure you want to delete this post?
          </p>
          <div className="flex gap-2">
            <StyledGreenButton
              className="bg-white border border-gray-700 text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClose();
              }}
            >
              Cancel
            </StyledGreenButton>
            <StyledGreenButton
              className="bg-red-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete();
              }}
            >
              Delete
            </StyledGreenButton>
          </div>
        </div>
        <button
          className="absolute top-4 right-4 cursor-pointer"
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
  );
};

export default DeleteModal;
