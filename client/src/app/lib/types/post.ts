export interface Tag {
  _id: string;
  name: string;
}

export interface Post {
  title: string;
  subtitle: string;
  content: string;
  createdAt: string;
  slug: string;
  tags: Tag[];
}
