import { JSONContent } from "@tiptap/core";
import { create } from "zustand";

interface PostState {
  title: string;
  content_json: JSONContent;
  tags: string[];
  img_thumbnail: string;
  setTitle: (title: string) => void;
  setContent: (content_json: JSONContent) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  resetPost: () => void;
  setImgThumbnail: (img_thumbnail: string) => void;
  removeImgThumbnail: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  title: "",
  content_json: [],
  tags: [],
  img_thumbnail: "",
  setTitle: (title) => set({ title }),
  setContent: (content_json) => set({ content_json: content_json }),
  setTags: (tags) => set({ tags }),
  addTag: (tag) =>
    set((state) =>
      state.tags.length < 5 && !state.tags.find((t) => t === tag)
        ? { tags: [...state.tags, tag] }
        : state
    ),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
  resetPost: () => set({ title: "", content_json: [], tags: [] }),

  setImgThumbnail: (img_thumbnail) => set({ img_thumbnail }),
  removeImgThumbnail: () => set({ img_thumbnail: "" }),
}));
