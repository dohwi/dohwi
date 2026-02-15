import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import TitleManager from "@/components/common/TitleManager";

import "pretendard/dist/web/static/pretendard.css";
import "./globals.css";

const baseUrl = process.env.SITE_URL || "https://dohwi.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "도휘닷컴 · dohwi.com",
    template: "%s · 도휘닷컴",
  },
  description:
    "도휘닷컴에 오신것을 환영합니다 :)",
  keywords: [
    "dohwi.com",
    "도휘닷컴",
    "도휘",
    "dohwi",
    "김도휘",
    "바이브코딩",
    "웹개발",
    "기술 블로그",
    "react",
    "nextjs",
    "nodejs",
  ],
  authors: [{ name: "도휘", url: baseUrl }],
  creator: "도휘",
  publisher: "도휘닷컴",
  applicationName: "도휘닷컴",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    siteName: "도휘닷컴",
    title: "도휘닷컴 · dohwi.com",
    description:
      "도휘닷컴에 오신것을 환영합니다 :)",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "도휘닷컴",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "도휘닷컴 · dohwi.com",
    description:
      "도휘닷컴에 오신것을 환영합니다 :)",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TitleManager />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
