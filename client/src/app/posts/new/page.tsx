"use client";
import Button from "@/app/components/common/styledButton";
import { HomeLogo } from "@/app/components/common/homeLogo";
import LoginButton from "@/app/components/loginButton";
import PublishModal from "@/app/components/publishModal";
import { useCreatePost } from "@/app/lib/hooks/usePost";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const NewPostPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    title,
    content_json,
    tags,
    img_thumbnail,
    setTitle,
    setContent,
    resetPost,
  } = usePostStore();
  const { mutate: createPost } = useCreatePost();

  const titleRef = React.useRef<HTMLHeadingElement>(null);

  const handlePublish = () => {
    setTitle(titleRef.current?.innerText ?? "");
    createPost(
      {
        title,
        content_json: content_json ?? [],
        tags,
        img_thumbnail: img_thumbnail ?? "",
        _id: "",
      },
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
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="relative min-h-20 text-4xl text-pretty font-semibold outline-none placeholder-gray-400"
        ></input>
        <SimpleEditor setContent={setContent} />
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
