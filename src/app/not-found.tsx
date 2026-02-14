import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="text-xl text-muted">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105"
      >
        Go Home
      </Link>
    </div>
  );
}
