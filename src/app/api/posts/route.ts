import { createPost, getFollowingPostsPageOf } from "@/service/posts";
import { withResizedPngImage } from "@/util/image";
import { withSessionUser } from "@/util/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return withSessionUser(async (user) => {
    const params = req.nextUrl.searchParams;
    const limit = Number(params.get("limit") ?? "5");
    const nextCursor = params.get("nextCursor") ?? "9999-12-30T23:59:59Z";

    return getFollowingPostsPageOf(user.username, nextCursor, limit) //
      .then((data) => NextResponse.json(data));
  });
}

export async function POST(req: NextRequest) {
  return withSessionUser(async (user) => {
    const form = await req.formData();
    const text = form.get("text")?.toString();
    const file = form.get("file") as Blob;

    if (!text || !file) {
      return new Response("Bad Request", { status: 400 });
    }

    return withResizedPngImage(file, async (resized) => {
      return createPost(user.id, text, resized) //
        .then((data) => NextResponse.json(data));
    });
  });
}
