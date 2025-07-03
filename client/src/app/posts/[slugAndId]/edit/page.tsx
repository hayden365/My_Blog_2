import { cookies } from "next/headers";
import EditPost from "./editPost";
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    redirect("/login");
  }

  const [resolvedParams] = await Promise.all([params, searchParams]);
  const _id = resolvedParams.slugAndId?.split("-").pop() || "";

  return <EditPost _id={_id} />;
}
