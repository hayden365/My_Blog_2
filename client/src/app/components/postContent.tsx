import { formatDate } from "../lib/utils/date";
import Link from "next/link";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import TiptapRenderer from "./tiptapRenderer";
import "./tiptapRenderer.scss";

const PostContent = ({ data }: { data: Post }) => {
  return (
    <div className="py-15">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-[42px] font-bold mb-8">{data.title}</h1>
        <div className="flex items-center justify-between gap-2">
          <time className="text-gray-500">{formatDate(data.createdAt)}</time>
          <PostOptionsMenu post={data} />
        </div>
      </header>
      <article className="my-10 prose prose-lg max-w-none">
        <TiptapRenderer content={data.content_json} className="prose" />
      </article>
      {/* tags */}
      <ul className="flex gap-2">
        {data.tags?.map((tag) => (
          <Link href={`/?tag=${tag.name}`} key={tag.name}>
            <li className="text-neutral-800 bg-zinc-100 px-4 py-2 rounded-3xl">
              {tag.name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default PostContent;
