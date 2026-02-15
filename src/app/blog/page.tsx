import { Metadata } from "next";

import BlogCard from "@/components/blog/BlogCard";
import { getPosts } from "@/lib/github";

export const metadata: Metadata = {
  title: "블로그",
  description:
    "도휘의 블로그에 오신것을 환영합니다 ~_~",
  openGraph: {
    title: "블로그 · 도휘닷컴",
    description:
      "도휘의 블로그에 오신것을 환영합니다 ~_~",
  },
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
      <div className="pb-6">
        <p className="text-muted-foreground">
          {tag && category ? (
            <span>
              <span className="font-semibold text-accent">#{tag}</span> 태그와{" "}
              <span className="font-semibold text-accent">{category}</span> 카테고리에{" "}
              <span className="font-mono font-bold">{filteredPosts.length}</span>
              개의 글이 있습니다.
            </span>
          ) : tag ? (
            <span>
              <span className="font-semibold text-accent">#{tag}</span> 태그에{" "}
              <span className="font-mono font-bold">{filteredPosts.length}</span>
              개의 글이 있습니다.
            </span>
          ) : category ? (
            <span>
              <span className="font-semibold text-accent">{category}</span>{" "}
              카테고리에{" "}
              <span className="font-mono font-bold">{filteredPosts.length}</span>
              개의 글이 있습니다.
            </span>
          ) : q ? (
            <span>
              <span className="font-semibold text-accent">&ldquo;{q}&rdquo;</span> 검색 결과:{" "}
              <span className="font-mono font-bold">{filteredPosts.length}</span>
              개의 글이 있습니다.
            </span>
          ) : (
            <span>
              <span className="text-accent font-bold">도휘닷컴</span>에는 현재{" "}
              <span className="font-mono font-bold">{posts.length}</span>
              개의 글이 있습니다.
            </span>
          )}
        </p>
      </div>

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
