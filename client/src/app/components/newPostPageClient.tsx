"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { usePostStore } from "../lib/store/postStore";
import { useCreatePost } from "../lib/hooks/usePost";
import { HomeLogo } from "./common/homeLogo";
import StyledGreenButton from "./common/styledGreenButton";
import ProfileButton from "./profileButton";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import PublishModal from "./publishModal";
import { useAuthStore } from "../lib/store/authStore";
import { redirect } from "next/navigation";

const NewPostPageClient = () => {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    redirect("/login");
  }
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

  const titleRef = useRef<HTMLHeadingElement>(null);

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
          <StyledGreenButton
            disabled={!title || !content_json}
            onClick={() => setIsModalOpen(true)}
          >
            Publish
          </StyledGreenButton>
          <ProfileButton />
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

export default NewPostPageClient;
