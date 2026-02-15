import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-foreground">게시물을 찾을 수 없습니다</h1>
      <p className="text-muted">요청하신 게시물이 존재하지 않습니다.</p>
      <Link
        href="/blog"
        className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105"
      >
        블로그로 돌아가기
      </Link>
    </div>
  );
}
