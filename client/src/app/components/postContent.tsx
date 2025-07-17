import Link from "next/link";
import { Post } from "../lib/types/post";
import PostOptionsMenu from "./postOptionsMenu";
import TiptapRenderer from "./tiptapRenderer";
import "./tiptapRenderer.scss";
import { format, register } from "timeago.js";
import Image from "next/image";
import koLocale from "timeago.js/lib/lang/ko";
import { useAuthStore } from "../lib/store/authStore";
import StyledType from "./common/styledType";
import TableOfContents from "./common/tableOfContents";
import { memo, useMemo } from "react";
import {
  generateHeadingId,
  extractHeadingText,
} from "../lib/utils/headingUtils";

const PostContent = memo(function PostContent({ data }: { data: Post }) {
  register("ko", koLocale);
  const { isLoggedIn } = useAuthStore();

  // sections 계산을 useMemo로 최적화하고 일관된 ID 생성
  const sections = useMemo(() => {
    const result = [];
    let headingIndex = 0;

    for (const item of data.content_json.content || []) {
      if (item.type === "heading" && item.attrs?.level <= 2) {
        const text = extractHeadingText(item.content || []);
        result.push({
          id: generateHeadingId(text, headingIndex),
          level: item.attrs?.level,
          text: text,
        });
        headingIndex++;
      }
    }
    return result;
  }, [data.content_json.content]);

  return (
    <div className="w-full flex gap-12">
      <div role="main" className="py-13 mx-5 flex flex-col gap-4 flex-1 w-full">
        <header className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            {data.types.map((type) => {
              return <StyledType key={type} type={type} />;
            })}
          </div>
          <h1 className="text-4xl text-wrap font-bold mt-4 mb-10">
            {data.title}
          </h1>
          <div className="flex items-center justify-between gap-2">
            <time className="text-gray-500">
              {format(data.createdAt, "ko")}
            </time>
            {isLoggedIn && <PostOptionsMenu post={data} />}
          </div>
        </header>
        <article className="my-10 prose prose-lg max-w-none">
          {data.img_thumbnail && (
            <div className="w-full h-[300px] bg-white flex items-center justify-center mb-10">
              <Image
                priority
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
      {/* Table of Contents */}
      <aside className="hidden lg:block">
        <TableOfContents sections={sections} />
      </aside>
    </div>
  );
});

export default PostContent;
