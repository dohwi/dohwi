import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts } from "@/lib/github";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (secret && signature) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = `sha256=${Array.from(new Uint8Array(signed))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")}`;

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  try {
    const posts = await getPosts();
    const revalidatedPaths: string[] = [];

    for (const post of posts) {
      revalidatePath(`/blog/${post.slug}`);
      revalidatedPaths.push(`/blog/${post.slug}`);
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatedPaths.push("/", "/blog");

    return NextResponse.json({
      revalidated: revalidatedPaths,
      message: "Revalidation completed",
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
