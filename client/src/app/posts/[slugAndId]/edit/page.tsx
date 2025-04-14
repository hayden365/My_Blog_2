import EditPostClient from "./editPostClient";

export default async function EditPostPage({
  params,
}: {
  params: { slugAndId: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams.slugAndId?.split("-").pop() || "";

  return <EditPostClient id={id} />;
}
