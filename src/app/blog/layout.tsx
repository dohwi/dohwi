import Navbar from "@/components/blog/Navbar";
import { getPosts } from "@/lib/github";

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Navbar posts={posts} />
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">{children}</main>
      <footer className="py-6 text-center text-sm text-muted/60">
        © {new Date().getFullYear()} dohwi.com
      </footer>
    </div>
  );
}
