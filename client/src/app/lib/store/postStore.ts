import { create } from "zustand";

interface PostState {
  title: string;
  content: string;
  tags: string[];
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setTags: (tags: string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  resetPost: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  title: "",
  content: "",
  tags: [],
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setTags: (tags) => set({ tags }),
  addTag: (tag) =>
    set((state) =>
      state.tags.length < 5 && !state.tags.find((t) => t === tag)
        ? { tags: [...state.tags, tag] }
        : state
    ),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
  resetPost: () => set({ title: "", content: "", tags: [] }),
}));
