import Navbar from "@/components/blog/Navbar";
import { getPosts } from "@/lib/github";

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        본문으로 건너뛰기
      </a>
      <Navbar posts={posts} />
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
      <footer className="py-6 text-center text-sm text-muted">
        © {new Date().getFullYear()} dohwi
      </footer>
    </div>
  );
}
