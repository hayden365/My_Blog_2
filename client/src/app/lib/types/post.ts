export interface Tag {
  _id: string;
  name: string;
  count: number;
}

export interface Post {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  createdAt: string;
  slug: string;
  tags: Tag[];
}

export interface PostData {
  _id: string;
  title: string;
  content: string;
  tags: string[];
}
