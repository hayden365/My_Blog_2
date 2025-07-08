"use client";
import Button from "@/app/components/common/styledGreenButton";
import { HomeLogo } from "@/app/components/common/homeLogo";
import ProfileButton from "@/app/components/profileButton";
import PublishModal from "@/app/components/publishModal";
import { usePostStore } from "@/app/lib/store/postStore";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/app/api/fetch";
import { useUpdatePost } from "@/app/lib/hooks/usePost";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useAuthStore } from "@/app/lib/store/authStore";
import { redirect } from "next/navigation";

const EditPostClient = ({ _id }: { _id: string }) => {
  const { isLoggedIn, isLoading: isAuthLoading } = useAuthStore();

  if (!isLoggedIn && !isAuthLoading) {
    redirect("/login");
  }
  const router = useRouter();
  const {
    title,
    content_json,
    tags,
    projects,
    setTitle,
    setContent,
    setTags,
    resetPost,
    setProjects,
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
      setProjects(post.projects.map((project: string) => project));
    }
  }, [post, setTitle, setContent, setTags, setProjects]);

  const titleRef = React.useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (post && titleRef.current) {
      titleRef.current.textContent = post.title;
    }
  }, [post]);

  const handlePublish = () => {
    const title = titleRef.current?.innerText ?? "";
    mutateUpdatePost(
      { _id, title, content_json: content_json ?? [], tags, projects },
      {
        onSuccess: (updatedPost) => {
          resetPost();
          router.replace(`/posts/${updatedPost.slug}-${updatedPost._id}`);
          router.refresh();
          window.scrollTo(0, 0);
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
      <div role="header" className="py-6 flex items-center justify-between">
        <HomeLogo />
        <div className="flex gap-8">
          <Button
            disabled={!title || !content_json}
            onClick={() => setIsModalOpen(true)}
          >
            Publish
          </Button>
          <ProfileButton />
        </div>
      </div>
      <div role="main" className="flex flex-col py-6 gap-6 min-h-0 flex-1">
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
