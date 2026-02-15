import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dohwi.com - 도휘의 개인 블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Refined Pastel Palette
const COLORS = [
  [59, 130, 246, 0.25],  // Blue
  [139, 92, 246, 0.2],   // Purple
  [16, 185, 129, 0.15],  // Emerald
  [244, 63, 94, 0.15],   // Rose
  [245, 158, 11, 0.15],  // Amber
];

const BLOB_COUNT = 10;

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
    const angle = (i / BLOB_COUNT) * Math.PI * 2;
    const distance = 150 + Math.random() * 250;
    
    const pointCount = 6 + Math.floor(Math.random() * 4);
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
      radius: 200 + Math.random() * 200,
      colorIndex: i % COLORS.length,
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

export default async function OgImage() {
  const blobs = createBlobs();
  
  // Fetch fonts
  const [mediumFontData, boldFontData] = await Promise.all([
    fetch(new URL("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Medium.woff", "https://cdn.jsdelivr.net")).then((res) => res.arrayBuffer()),
    fetch(new URL("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff", "https://cdn.jsdelivr.net")).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Background Pattern */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#f3f4f6 1px, transparent 0)",
            backgroundSize: "32px 32px",
            opacity: 0.6,
          }}
        />

        {/* Blurred Decorative Blobs */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0, filter: "blur(70px)", opacity: 0.8 }}
        >
          {blobs.map((blob, i) => {
            const [r, g, b, a] = COLORS[blob.colorIndex];
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

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            zIndex: 10,
          }}
        >
          {/* Top Label */}
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              padding: "6px 16px",
              borderRadius: "8px",
              marginBottom: "40px",
              fontFamily: "PretendardMedium",
              letterSpacing: "1px",
            }}
          >
            EST. 2026
          </div>

          {/* Headline: Domain */}
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 700,
              color: "#0a0a0a",
              letterSpacing: "-7px",
              fontFamily: "PretendardBold",
              lineHeight: 1,
            }}
          >
            dohwi<span style={{ color: "#3b82f6" }}>.</span>com
          </div>

          {/* Sub-headline: Blog Name */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#6b7280",
              marginTop: "24px",
              fontFamily: "PretendardMedium",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ width: 24, height: 1, backgroundColor: "#d1d5db" }} />
            <span>도휘의 개인 블로그</span>
            <div style={{ width: 24, height: 1, backgroundColor: "#d1d5db" }} />
          </div>
        </div>

        {/* Decorative corner accents */}
        <div style={{ position: "absolute", top: 60, left: 60, width: 40, height: 40, borderTop: "2px solid #e5e7eb", borderLeft: "2px solid #e5e7eb", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: 60, right: 60, width: 40, height: 40, borderBottom: "2px solid #e5e7eb", borderRight: "2px solid #e5e7eb", opacity: 0.5 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "PretendardMedium",
          data: mediumFontData,
          style: "normal",
          weight: 500,
        },
        {
          name: "PretendardBold",
          data: boldFontData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
