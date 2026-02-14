import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dohwi.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OgImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OgImage({ params }: OgImageProps) {
  const { slug } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #a29bfe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              marginBottom: "16px",
            }}
          >
            dohwi.com
          </span>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#fafafa",
              textAlign: "center",
            }}
          >
            {slug ? decodeURIComponent(slug) : "Personal Blog"}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
