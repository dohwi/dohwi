import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-bold text-foreground">Post Not Found</h1>
      <p className="text-muted">The post you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/blog"
        className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105"
      >
        Back to Blog
      </Link>
    </div>
  );
}
