"use client";
import React, { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
import StyledDropdown from "./common/styledDropdown";
import { Post } from "../lib/types/post";
import { useRouter } from "next/navigation";

interface DropdownMenuProps {
  post: Post;
}

const DropdownMenu = ({ post }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
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
              }}
            >
              삭제
            </button>
          </li>
        </ul>
      </StyledDropdown>
    </div>
  );
};

export default DropdownMenu;
