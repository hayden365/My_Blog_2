"use client";
import React, { useState, useRef } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import StyledDropdown from "./common/styledDropdown";
import { Post } from "../lib/types/post";
import { useRouter } from "next/navigation";
import DeleteModal from "./deleteModal";
import { useDeletePost } from "../lib/hooks/usePosts";

interface PostOptionsMenuProps {
  post: Post;
}

const PostOptionsMenu = ({ post }: PostOptionsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: deletePostMutation } = useDeletePost();

  const handleDelete = () => {
    setIsModalOpen(false);
    deletePostMutation(post._id);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        />
      )}
      <div className="relative" ref={menuRef}>
        <button
          className="p-3 rounded-full text-gray-500 hover:text-black"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
        <StyledDropdown visible={isOpen}>
          <ul className="w-20 text-sm text-gray-700">
            <li className="hover:bg-gray-50 cursor-pointer">
              <button
                className="flex w-full text-left px-4 py-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  router.push(`/posts/${post.slug}-${post._id}/edit`);
                }}
              >
                수정
              </button>
            </li>
            <li className="hover:bg-gray-50 cursor-pointer">
              <button
                className="flex w-full text-left px-4 py-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsModalOpen(true);
                }}
              >
                삭제
              </button>
            </li>
          </ul>
        </StyledDropdown>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default PostOptionsMenu;
