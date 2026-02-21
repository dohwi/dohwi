import { ImageResponse } from "next/og";
import { getPost } from "@/lib/github";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };

// Harmonious Pastel Palette (Light Mode)
const LIGHT_COLORS = [
  [162, 155, 254, 0.3], // Lavender
  [116, 185, 255, 0.3], // Soft Blue
  [129, 236, 236, 0.3], // Teal
  [253, 121, 168, 0.3], // Pink
  [108, 92, 231, 0.2], // Purple
  [223, 249, 251, 0.3], // Ice Blue
];

const BLOB_COUNT = 15;

interface BlobData {
  x: number;
  y: number;
  radius: number;
  colorIndex: number;
  rotation: number;
  points: { angle: number; length: number }[];
}

function createBlobs(): BlobData[] {
  const blobs: BlobData[] = [];
  for (let i = 0; i < BLOB_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 600;

    const pointCount = 8 + Math.floor(Math.random() * 5);
    const points: { angle: number; length: number }[] = [];
    for (let j = 0; j < pointCount; j++) {
      points.push({
        angle: (j / pointCount) * Math.PI * 2,
        length: 0.8 + Math.random() * 0.4,
      });
    }

    blobs.push({
      x: 600 + Math.cos(angle) * distance,
      y: 315 + Math.sin(angle) * distance,
      radius: 150 + Math.random() * 250,
      colorIndex: i % LIGHT_COLORS.length,
      rotation: Math.random() * Math.PI * 2,
      points,
    });
  }
  return blobs;
}

function generateBlobPath(blob: BlobData): string {
  const { points, radius, rotation } = blob;
  const vertices = points.map(p => ({
    x: Math.cos(p.angle + rotation) * p.length * radius,
    y: Math.sin(p.angle + rotation) * p.length * radius,
  }));
  const len = vertices.length;
  const last = vertices[len - 1];
  const first = vertices[0];
  const startX = (last.x + first.x) / 2;
  const startY = (last.y + first.y) / 2;
  let path = `M ${startX} ${startY}`;
  for (let i = 0; i < len; i++) {
    const curr = vertices[i];
    const next = vertices[(i + 1) % len];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    path += ` Q ${curr.x} ${curr.y} ${midX} ${midY}`;
  }
  return path;
}

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

  const blobs = createBlobs();

  // Fetch Pretendard fonts (Bold for titles, Regular for description/url)
  const [boldFontData, regularFontData] = await Promise.all([
    fetch(
      new URL("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff", "https://cdn.jsdelivr.net")
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Regular.woff", "https://cdn.jsdelivr.net")
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#fafafa",
          position: "relative",
          overflow: "hidden",
          padding: "100px",
          flexDirection: "column",
        }}
      >
        {/* Full screen background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            opacity: 0.2,
          }}
        />

        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0, filter: "blur(50px)", opacity: 0.9 }}
        >
          {blobs.map((blob, i) => {
            const [r, g, b, a] = LIGHT_COLORS[blob.colorIndex];
            return (
              <path
                key={i}
                d={generateBlobPath(blob)}
                fill={`rgba(${r}, ${g}, ${b}, ${a})`}
                transform={`translate(${blob.x}, ${blob.y})`}
              />
            );
          })}
        </svg>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#3b82f6",
              fontFamily: "PretendardBold",
            }}
          >
            도휘닷컴
          </span>
          {category && (
            <span
              style={{
                marginLeft: "20px",
                padding: "8px 20px",
                fontSize: "24px",
                fontWeight: 600,
                color: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderRadius: "99px",
                fontFamily: "PretendardBold",
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
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#0a0a0a",
              marginBottom: "32px",
              lineHeight: 1.25,
              fontFamily: "PretendardBold",
              wordBreak: "keep-all",
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: "36px",
                color: "#4b5563",
                lineHeight: 1.5,
                maxWidth: "960px",
                fontFamily: "PretendardRegular",
                wordBreak: "keep-all",
              }}
            >
              {description}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontSize: "28px",
              color: "#ffffff",
              backgroundColor: "#3b82f6",
              padding: "12px 28px",
              borderRadius: "99px",
              fontFamily: "PretendardRegular",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            }}
          >
            dohwi.com/blog/{slug}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "PretendardBold",
          data: boldFontData,
          style: "normal",
          weight: 700,
        },
        {
          name: "PretendardRegular",
          data: regularFontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
