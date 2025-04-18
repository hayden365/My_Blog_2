"use client";
import Button from "@/app/components/common/styledButton";
import { HomeLogo } from "@/app/components/common/homeLogo";
import LoginButton from "@/app/components/loginButton";
import PublishModal from "@/app/components/publishModal";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/app/lib/api/fetch";
import { useUpdatePost } from "@/app/lib/hooks/usePost";

const EditPostClient = ({ _id }: { _id: string }) => {
  const router = useRouter();
  const { title, content, tags, setTitle, setContent, setTags, resetPost } =
    usePostStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: mutateUpdatePost } = useUpdatePost();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", _id],
    queryFn: () => getPost(_id),
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setTags(post.tags.map((tag: { name: string }) => tag.name));
    }
  }, [post, setTitle, setContent, setTags]);

  const handlePublish = () => {
    mutateUpdatePost(
      { _id, title, content, tags },
      {
        onSuccess: (updatedPost) => {
          resetPost();
          router.push(`/posts/${updatedPost.slug}-${updatedPost._id}`);
        },
        onError: (error: Error) => {
          console.error("게시물 업데이트 중 오류 발생:", error);
        },
      }
    );
    setIsModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;

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

export default EditPostClient;
