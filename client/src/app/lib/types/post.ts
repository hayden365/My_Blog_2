import { JSONContent } from "@tiptap/react";

export interface Tag {
  _id: string;
  name: string;
  count: number;
}

// 서버에서 받아오는 데이터
export interface Post {
  _id: string;
  title: string;
  subtitle: string;
  content_json: JSONContent;
  createdAt: string;
  slug: string;
  tags: Tag[];
  img_thumbnail?: string;
}

// 서버에 보내는 데이터
export interface PostData {
  _id?: string;
  title: string;
  content_json: JSONContent;
  tags: string[];
  img_thumbnail?: string;
  projects: string[];
  types: string[];
}

export const POST_TYPES = [
  { key: "error-handling", label: "에러 처리" },
  { key: "feature", label: "기능 구현" },
  { key: "theory", label: "이론 정리" },
  { key: "retrospective", label: "회고" },
  { key: "design", label: "기획" },
];
