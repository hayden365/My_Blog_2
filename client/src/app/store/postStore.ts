import { create } from "zustand";
import { Tag } from "../lib/types/post";

interface PostState {
  title: string;
  content: string;
  tags: Tag[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  addTag: (tag: Tag) => void;
  removeTag: (tag: Tag) => void;
  resetPost: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  title: "",
  content: "",
  tags: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  addTag: (tag) =>
    set((state) =>
      state.tags.length < 5 && !state.tags.find((t) => t.name === tag.name)
        ? { tags: [...state.tags, tag] }
        : state
    ),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t.name !== tag.name) })),
  resetPost: () => set({ title: "", content: "", tags: [] }),
}));
