import { getLikedPostsOf, getPostsOf, getSavedPostsOf } from "@/service/posts";
import { NextRequest, NextResponse } from "next/server";

type Context = {
  params: {
    slug: string[];
  };
};
export async function GET(req: NextRequest, context: Context) {
  const { slug } = context.params;

  if (!slug || !Array.isArray(slug) || slug.length < 2) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const params = req.nextUrl.searchParams;
  const nextCursor = params.get("nextCursor") ?? "9999-12-30T23:59:59Z";
  const limit = Number(params.get("limit") ?? "5");

  const [username, query] = slug;

  let request = getPostsOf;
  if (query === "saved") {
    request = getSavedPostsOf;
  } else if (query === "liked") {
    request = getLikedPostsOf;
  }

  return request(username, nextCursor, limit).then(NextResponse.json);
}
