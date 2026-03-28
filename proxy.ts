import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isServerActionRequest =
    request.method === "POST" && request.headers.has("next-action");

  if (isServerActionRequest) {
    return NextResponse.json(
      { error: "지원하지 않는 Server Action 요청입니다." },
      { status: 404 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
      has: [{ type: "header", key: "next-action" }],
    },
  ],
};
