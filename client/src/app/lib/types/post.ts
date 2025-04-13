export interface Tag {
  id: string;
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
