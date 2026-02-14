import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.SITE_URL || "https://dohwi.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "dohwi.com",
    template: "%s | dohwi.com",
  },
  description: "Personal website and blog by dohwi - Frontend Developer, Creative Coder",
  keywords: ["dohwi", "frontend", "developer", "blog", "web development", "react", "nextjs"],
  authors: [{ name: "dohwi", url: baseUrl }],
  creator: "dohwi",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: baseUrl,
    siteName: "dohwi.com",
    title: "dohwi.com",
    description: "Personal website and blog by dohwi",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "dohwi.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dohwi.com",
    description: "Personal website and blog by dohwi",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
