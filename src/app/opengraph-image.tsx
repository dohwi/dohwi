import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dohwi.com";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = [
  [59, 130, 246, 0.2],
  [99, 102, 241, 0.18],
  [14, 165, 233, 0.15],
  [168, 85, 247, 0.12],
  [79, 70, 229, 0.12],
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#f3f4f6 1px, transparent 0)",
            backgroundSize: "32px 32px",
            opacity: 0.6,
          }}
        />
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
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#2563eb",
              backgroundColor: "rgba(37, 99, 235, 0.08)",
              padding: "10px 24px",
              borderRadius: "12px",
              marginBottom: "50px",
              fontFamily: "PretendardMedium",
              letterSpacing: "1px",
            }}
          >
            EST. 2026
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 200,
              fontWeight: 700,
              color: "#0a0a0a",
              letterSpacing: "-9px",
              fontFamily: "PretendardBold",
              lineHeight: 1,
            }}
          >
            dohwi<span style={{ color: "#2563eb" }}>.</span>com
          </div>

          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: "#6b7280",
              marginTop: "40px",
              fontFamily: "PretendardMedium",
            }}
          >
            새로운 것을 즐기고, 경험을 공유합니다.
          </div>
        </div>
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
