import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewPostPageClient from "@/app/components/newPostPageClient";

const NewPostPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    redirect("/login");
  }

  return <NewPostPageClient />;
};

export default NewPostPage;
