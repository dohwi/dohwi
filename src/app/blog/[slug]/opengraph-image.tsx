import { ImageResponse } from "next/og";

import { getPost } from "@/lib/github";

export const runtime = "edge";

interface BlogOgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogOgImage({ params }: BlogOgImageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.frontmatter.title || "Blog Post";
  const description = post?.frontmatter.description || "";
  const category = post?.frontmatter.category || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#fafafa",
            }}
          >
            dohwi.com
          </span>
          {category && (
            <span
              style={{
                marginLeft: "16px",
                padding: "4px 12px",
                fontSize: "14px",
                color: "#60a5fa",
                backgroundColor: "rgba(96, 165, 250, 0.1)",
                borderRadius: "4px",
              }}
            >
              {category}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              color: "#fafafa",
              marginBottom: "20px",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: "24px",
                color: "#a1a1aa",
                lineHeight: 1.4,
                maxWidth: "900px",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
