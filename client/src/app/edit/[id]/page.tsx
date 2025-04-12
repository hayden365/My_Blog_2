"use client";
import Button from "@/app/components/common/button";
import { HomeLogo } from "@/app/components/common/homeLogo";
import LoginButton from "@/app/components/loginButton";
import PublishModal from "@/app/components/publishModal";
import useCreatePost from "@/app/lib/hooks/usePosts";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState } from "react";

const PostEditPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, content, tags, setTitle, setContent, resetPost } =
    usePostStore();
  const { mutate: createPost } = useCreatePost();
  const handlePublish = () => {
    createPost(
      { title, content, tags },
      {
        onSuccess: (data) => {
          console.log("Success", data);
          resetPost(); // 상태 초기화
        },
        onError: (error) => {
          console.log("Error", error);
        },
      }
    );
    setIsModalOpen(false);
  };
  return (
    <>
      <div role="header" className="px-6 py-6 flex justify-between">
        <HomeLogo />
        <div className="flex gap-8">
          <Button
            disabled={!title || !content}
            onClick={() => setIsModalOpen(true)}
          >
            Publish
          </Button>
          <LoginButton />
        </div>
      </div>
      <div role="main" className="px-6 py-6">
        {/* 제목 */}
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-semibold outline-none placeholder-gray-400 mb-6"
        />
        {/* 본문 */}
        <textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[500px] resize-none text-lg leading-relaxed outline-none placeholder-gray-400"
        />
      </div>
      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handlePublish={handlePublish}
      />
    </>
  );
};

export default PostEditPage;
