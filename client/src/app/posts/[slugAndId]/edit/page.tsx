"use client";
import Button from "@/app/components/common/button";
import { HomeLogo } from "@/app/components/common/homeLogo";
import LoginButton from "@/app/components/loginButton";
import PublishModal from "@/app/components/publishModal";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdatePost } from "@/app/lib/hooks/usePosts";

const EditPostPage = ({ params }: { params: { slug: string; id: string } }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { title, content, tags, setTitle, setContent, resetPost } =
    usePostStore();
  const { mutate: updatePost } = useUpdatePost();
  const slugAndId = `${params.slug}-${params.id}`;

  const handlePublish = () => {
    updatePost(
      { id: params.id, title, content, tags },
      {
        onSuccess: () => {
          resetPost();
          router.push(`/posts/${slugAndId}`);
        },
        onError: (error: Error) => {
          console.error("Error updating post:", error);
        },
      }
    );
    setIsModalOpen(false);
  };

  return (
    <>
      <div role="header" className="py-6 flex justify-between">
        <HomeLogo />
        <div className="flex gap-8">
          <Button
            disabled={!title || !content}
            onClick={() => setIsModalOpen(true)}
          >
            Update
          </Button>
          <LoginButton />
        </div>
      </div>
      <div role="main" className="py-6">
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-4xl font-semibold outline-none placeholder-gray-400 mb-6"
        />
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

export default EditPostPage;
