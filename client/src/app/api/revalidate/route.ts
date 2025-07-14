import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// 동시 요청 처리를 위한 락 메커니즘
const revalidationLocks = new Map<string, Promise<void>>();

async function safeRevalidateTag(tag: string): Promise<void> {
  // 이미 진행 중인 revalidation이 있으면 기다림
  if (revalidationLocks.has(tag)) {
    await revalidationLocks.get(tag);
    return;
  }

  // 새로운 revalidation 시작
  const revalidationPromise = (async () => {
    try {
      console.log(`Starting revalidation for tag: ${tag}`);
      await revalidateTag(tag);
      console.log(`Completed revalidation for tag: ${tag}`);
    } catch (error) {
      console.error(`Revalidation failed for tag: ${tag}`, error);
      throw error;
    } finally {
      // 완료 후 락 해제
      revalidationLocks.delete(tag);
    }
  })();

  revalidationLocks.set(tag, revalidationPromise);
  await revalidationPromise;
}

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

    // 안전한 revalidation 실행
    await safeRevalidateTag(tag);

    return NextResponse.json({
      message: `Cache revalidated for tag: ${tag}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET 요청으로도 캐시 무효화 가능 (개발용)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const secret = searchParams.get("secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Missing tag" }, { status: 400 });
    }

    // 안전한 revalidation 실행
    await safeRevalidateTag(tag);

    return NextResponse.json({
      message: `Cache revalidated for tag: ${tag}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
