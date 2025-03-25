import Link from "next/link";
import React from "react";

interface MockData {
  title: string;
  content: string;
  date: string;
  slug: string;
}
const mockData: MockData[] = [
  { title: "test", content: "test", date: "2021-10-10", slug: "test" },
  { title: "test2", content: "test", date: "2021-10-12", slug: "test2" },
];

const PostList = () => {
  return (
    <ul className="grid grid-cols-1 gap-4">
      {mockData.map((data, index) => (
        <li key={index} className="border p-4 w-64">
          <Link href={`/${data.slug}`}>
            <h2>{data.title}</h2>
            <p>{data.content}</p>
            <small>{data.date}</small>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
