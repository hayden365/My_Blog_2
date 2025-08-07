import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tag, path, secret } = await request.json();

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    // 태그 기반 캐시 무효화
    if (tag) {
      revalidateTag(tag);
    }

    // 경로 기반 캐시 무효화
    if (path) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag,
      path,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
