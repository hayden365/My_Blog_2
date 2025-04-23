import EditPostClient from "./editPostClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "게시글 수정",
};

type PageProps = {
  params: Promise<{ slugAndId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps) {
  const [resolvedParams] = await Promise.all([params, searchParams]);
  const _id = resolvedParams.slugAndId?.split("-").pop() || "";

  return <EditPostClient _id={_id} />;
}
