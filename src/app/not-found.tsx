import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "요청하신 페이지를 찾을 수 없습니다. 도휘닷컴 메인 페이지로 이동해 주세요.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-xl text-muted">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        메인으로 돌아가기
      </Link>
    </div>
  );
}
