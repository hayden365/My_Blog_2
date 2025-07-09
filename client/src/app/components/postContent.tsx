import Link from "next/link";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import TiptapRenderer from "./tiptapRenderer";
import "./tiptapRenderer.scss";
import { format, register } from "timeago.js";
import Image from "next/image";
import koLocale from "timeago.js/lib/lang/ko";
import { useAuthStore } from "../lib/store/authStore";

const PostContent = ({ data }: { data: Post }) => {
  register("ko", koLocale);
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="py-13 mx-5 flex flex-col gap-4">
      <header className="border-b border-gray-100 pb-4">
        <h1 className="text-4xl text-wrap font-bold mb-8">{data.title}</h1>
        <div className="flex items-center justify-between gap-2">
          <time className="text-gray-500">{format(data.createdAt, "ko")}</time>
          {isLoggedIn && <PostOptionsMenu post={data} />}
        </div>
      </header>
      <article className="my-10 prose prose-lg max-w-none">
        {data.img_thumbnail && (
          <div className="w-full h-[300px] bg-white flex items-center justify-center mb-10">
            <Image
              src={data.img_thumbnail}
              alt={data.title}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          </div>
        )}
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
