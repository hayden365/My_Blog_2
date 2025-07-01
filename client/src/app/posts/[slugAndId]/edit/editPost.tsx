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
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const EditPostClient = ({ _id }: { _id: string }) => {
  const router = useRouter();
  const {
    title,
    content_json,
    tags,
    setTitle,
    setContent,
    setTags,
    resetPost,
  } = usePostStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: mutateUpdatePost } = useUpdatePost();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", _id],
    queryFn: () => getPost(_id),
  });

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content_json);
      setTags(post.tags.map((tag: { name: string }) => tag.name));
    }
  }, [post, setTitle, setContent, setTags]);

  const titleRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (post && titleRef.current) {
      titleRef.current.textContent = post.title;
    }
  }, [post]);

  const handlePublish = () => {
    const title = titleRef.current?.innerText ?? "";
    mutateUpdatePost(
      { _id, title, content_json: content_json ?? [], tags },
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
  if (!post) return <div>Post not found</div>;

  return (
    <>
      <div role="header" className="py-6 flex justify-between">
        <HomeLogo />
        <div className="flex gap-8">
          <Button
            disabled={!title || !content_json}
            onClick={() => setIsModalOpen(true)}
          >
            Publish
          </Button>
          <LoginButton />
        </div>
      </div>
      <div
        role="main"
        className="flex flex-col py-6 gap-6 h-[calc(100vh-65px)]"
      >
        <h3
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          className="relative min-h-20 text-4xl text-pretty font-semibold outline-none placeholder-gray-400"
        ></h3>
        <SimpleEditor setContent={setContent} content={post.content_json} />
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
