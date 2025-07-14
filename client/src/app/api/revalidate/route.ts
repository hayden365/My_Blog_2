import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json();

    // 보안을 위한 시크릿 키 검증
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Missing tag" }, { status: 400 });
    }

    // 특정 태그의 캐시 무효화
    revalidateTag(tag);

    return NextResponse.json({
      message: `Cache revalidated for tag: ${tag}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}

// GET 요청으로도 캐시 무효화 가능 (개발용)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const secret = searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: "Missing tag" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({
    message: `Cache revalidated for tag: ${tag}`,
    revalidated: true,
    now: Date.now(),
  });
}
