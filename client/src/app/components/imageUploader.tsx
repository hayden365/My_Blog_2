"use client"; // This component must be a client component

import Image from "next/image";
import { useRef } from "react";
import { useImageUpload } from "../lib/hooks/useImageUpload";

export default function ImageUploader({
  image,
  imageSetter,
}: {
  image: string;
  imageSetter: (image: string) => void;
}) {
  const { handleUpload, progress, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];

    try {
      const imageUrl = await handleUpload(file);
      imageSetter(imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(error instanceof Error ? error.message : "업로드에 실패했습니다");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
    handleFileUpload();
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {image ? (
        <div className="w-full h-full relative">
          <Image
            src={image}
            width={100}
            height={100}
            alt="Uploaded preview"
            className="w-full h-full object-contain rounded-lg"
          />
          <button
            onClick={handleImageClick}
            className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all duration-200"
            title="이미지 변경"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={handleImageClick}
          disabled={isUploading}
          className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors duration-200 disabled:opacity-50"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">
                업로드 중... {Math.round(progress)}%
              </span>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span className="text-sm text-gray-600 mt-2">이미지 추가</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
