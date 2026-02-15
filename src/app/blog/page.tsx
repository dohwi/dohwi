import { Metadata } from "next";

import BlogCard from "@/components/blog/BlogCard";
import { getPosts } from "@/lib/github";

export const metadata: Metadata = {
  title: "블로그 | dohwi.com",
  description: "dohwi의 블로그 포스트",
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{
    q?: string;
    tag?: string;
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, tag, category } = await searchParams;
  const posts = await getPosts();

  let filteredPosts = posts;

  if (q) {
    const query = q.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.includes(tag));
  }

  if (category) {
    filteredPosts = filteredPosts.filter((post) => post.category === category);
  }

  return (
    <div className="flex flex-col gap-8">
      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center text-muted">
          <p>게시물을 찾을 수 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
