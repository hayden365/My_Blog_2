"use client";
import Button from "@/app/components/common/styledButton";
import { HomeLogo } from "@/app/components/common/homeLogo";
import LoginButton from "@/app/components/loginButton";
import PublishModal from "@/app/components/publishModal";
import { useCreatePost } from "@/app/lib/hooks/usePost";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const NewPostPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, content, tags, setTitle, setContent, resetPost } =
    usePostStore();
  const { mutate: createPost } = useCreatePost();

  const handlePublish = () => {
    createPost(
      { title, content, tags, _id: "" },
      {
        onSuccess: (data) => {
          console.log("Success", data);
          resetPost();
          router.push("/");
        },
        onError: (error) => {
          console.log("Error", error);
        },
      }
    );
    setIsModalOpen(false);
  };

  console.log(title);
  return (
    <>
      <div role="header" className="py-6 flex justify-between">
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
      <div role="main" className="flex flex-col py-6 gap-6">
        <h3
          contentEditable
          suppressContentEditableWarning
          className="relative min-h-20 text-4xl text-pretty font-semibold outline-none placeholder-gray-400"
          onInput={(e) => {
            const newText = e.currentTarget.textContent ?? "";
            setTitle(newText);
          }}
        >
          {!title && (
            <span className="absolute left-0 top-0 pointer-events-none text-gray-400">
              Title
            </span>
          )}
        </h3>
        <textarea
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="h-full resize-none text-lg leading-relaxed outline-none placeholder-gray-400"
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

export default NewPostPage;
