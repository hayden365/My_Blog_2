import { JSONContent } from "@tiptap/react";

export interface Tag {
  _id: string;
  name: string;
  count: number;
}

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

export interface PostData {
  _id: string;
  title: string;
  content_json: JSONContent;
  tags: string[];
  img_thumbnail?: string;
}
